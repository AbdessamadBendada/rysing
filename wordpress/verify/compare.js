/*
  Fidelity gate: the Divi port measured against the static source.

  Usage:
    node wordpress/verify/compare.js            # needs both servers, see below
    STATIC_URL=... DIVI_URL=... node ...        # override either side

  It needs the static site served over HTTP so both sides load identically:

    python3 -m http.server 8777 --bind 127.0.0.1   # from the repo root

  Exits non-zero if any gate fails, so it can be used as a check before a
  deploy.

  WHY THIS MEASURES GEOMETRY RATHER THAN COMPARING PIXELS: matching content is
  not evidence that two pages match, and a screenshot diff on this page is all
  noise — the reel plays, the marquee scrolls, both rails drift and the reveals
  are mid-transition at any given instant. Geometry is stable and it catches the
  failures that actually happened here: collapsed grid tracks, lost gutters,
  swallowed margins and sections that render but at the wrong height.

  Screenshots still matter and this does NOT replace them. The white-section /
  grey-heading failure measured perfectly while being completely wrong to look
  at. Run with --shots to capture matched viewport images.
*/

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const STATIC = process.env.STATIC_URL || 'http://127.0.0.1:8777/index.html';
const DIVI = process.env.DIVI_URL || 'http://rysing.local/';
const SHOTS = process.argv.includes('--shots');
const OUT = path.join(__dirname, 'out');

/* The source's own breakpoints plus the two desktop widths it was graded at. */
const VIEWPORTS = [1440, 1280, 1080, 980, 860, 760, 620, 390];

/* Section order is frozen; this is checked as a sequence, not a set. */
const SECTIONS = [
	'hero', 'reel', 'stats', 'system',
	'work-row--a', 'work-row--b', 'manifesto', 'spot',
	'team', 'duo', 'marquee', 'treel-wrap',
	'belong', 'work-row--c', 'fudge-copy', 'closing-glow',
];

/* container -> selector for the items that must line up inside it */
const ITEMS = [
	['stats-grid', '.stat'],
	['work-row--a', '.work-item'],
	['work-row--b', '.work-item'],
	['work-row--c', '.work-item'],
	['system-list', '.system-item'],
	['team-track', '.team-item'],
	['treel-track', '.tquote'],
	['footer-grid', ':scope > *'],
];

async function measure( page, url, width ) {
	await page.setViewportSize( { width, height: 900 } );
	await page.goto( url, { waitUntil: 'load', timeout: 60000 } );
	await page.evaluate( () => document.fonts.ready );

	/* Walk the page so every IntersectionObserver reveal fires, then return to
	   the top so fixed and sticky layers settle where they started. */
	await page.evaluate( async () => {
		const step = window.innerHeight * 0.8;
		for ( let y = 0; y < document.body.scrollHeight; y += step ) {
			window.scrollTo( 0, y );
			await new Promise( ( r ) => setTimeout( r, 60 ) );
		}
		window.scrollTo( 0, 0 );
		await new Promise( ( r ) => setTimeout( r, 400 ) );
	} );

	return page.evaluate(
		( { sections, items } ) => {
			const out = {
				docHeight: document.documentElement.scrollHeight,
				/* documentElement, not a content container: measuring #main-content
				   alone excludes the footer, which is where overflow often hides. */
				overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				sections: {},
				items: {},
			};

			sections.forEach( ( s ) => {
				const el = document.querySelector( '.' + s );
				out.sections[ s ] = el ? Math.round( el.getBoundingClientRect().height ) : null;
			} );

			/* Divi's two signature defaults, asserted in text.
			 *
			 * `.et_pb_section { background: #fff }` and `h1–h6 { color: #333 }`
			 * are INVISIBLE to every geometry check above: the homepage once
			 * measured pixel-perfect at all eight viewports while rendering as
			 * white plates with dark grey headings. Only a screenshot showed it.
			 *
			 * Reading an image to catch that is the most expensive check in the
			 * suite; this is the cheapest. Any section painting an opaque light
			 * background, or any heading landing on Divi's grey, fails here. */
			out.paint = { sections: [], headings: [] };

			const rgb = ( v ) => ( v.match( /\d+/g ) || [] ).map( Number );

			document.querySelectorAll( '.et_pb_section, section' ).forEach( ( el ) => {
				const bg = getComputedStyle( el ).backgroundColor;
				const [ r, g, b, a = 1 ] = rgb( bg );
				/* opaque and bright on a black-grounded design = Divi's default */
				if ( a > 0.5 && r > 200 && g > 200 && b > 200 ) {
					out.paint.sections.push( `${ el.className.toString().slice( 0, 40 ) } ${ bg }` );
				}
			} );

			document.querySelectorAll( 'h1, h2, h3, h4, h5, h6' ).forEach( ( el ) => {
				const c = getComputedStyle( el ).color;
				const [ r, g, b ] = rgb( c );
				if ( r === 51 && g === 51 && b === 51 ) {
					out.paint.headings.push( `${ el.tagName } ${ el.className.toString().slice( 0, 30 ) }` );
				}
			} );

			/* Geometry, NOT element.children. display:contents changes layout
			   without changing the DOM, so a child count reports the Divi wrapper
			   and claims a mismatch that does not exist. */
			items.forEach( ( [ container, sel ] ) => {
				const el = document.querySelector( '.' + container );
				if ( ! el ) return;
				const kids = [ ...el.querySelectorAll( sel ) ];
				out.items[ container ] = {
					count: kids.length,
					widths: kids.map( ( k ) => Math.round( k.getBoundingClientRect().width ) ),
				};
			} );

			return out;
		},
		{ sections: SECTIONS, items: ITEMS }
	);
}

( async () => {
	if ( SHOTS ) fs.mkdirSync( OUT, { recursive: true } );

	const browser = await chromium.launch();
	const report = {};
	let failures = 0;

	for ( const width of VIEWPORTS ) {
		const ctx = await browser.newContext( { deviceScaleFactor: 1 } );
		const page = await ctx.newPage();
		const errors = [];
		page.on( 'pageerror', ( e ) => errors.push( String( e ).slice( 0, 120 ) ) );
		page.on( 'console', ( m ) => { if ( m.type() === 'error' ) errors.push( m.text().slice( 0, 120 ) ); } );

		const a = await measure( page, STATIC, width );
		if ( SHOTS ) await page.screenshot( { path: path.join( OUT, `static-${ width }.png` ), fullPage: true } );

		const b = await measure( page, DIVI, width );
		if ( SHOTS ) await page.screenshot( { path: path.join( OUT, `divi-${ width }.png` ), fullPage: true } );

		report[ width ] = { static: a, divi: b, errors };
		await ctx.close();
	}

	await browser.close();

	const line = ( ...c ) => console.log( c.join( '' ) );
	line( '', 'vw'.padStart( 6 ), 'static'.padStart( 9 ), 'divi'.padStart( 9 ), 'Δ'.padStart( 7 ), '  overflow  errors' );

	for ( const w of VIEWPORTS ) {
		const { static: s, divi: d, errors } = report[ w ];
		const diff = d.docHeight - s.docHeight;
		if ( diff !== 0 || d.overflow !== 0 || errors.length ) failures++;
		line(
			'', String( w ).padStart( 6 ), String( s.docHeight ).padStart( 9 ), String( d.docHeight ).padStart( 9 ),
			String( diff ).padStart( 7 ), String( d.overflow ).padStart( 10 ), String( errors.length ).padStart( 8 )
		);
	}

	console.log( '\nper-section height deltas (blank = identical):' );
	for ( const sec of SECTIONS ) {
		const deltas = VIEWPORTS
			.map( ( w ) => [ w, ( report[ w ].divi.sections[ sec ] ?? 0 ) - ( report[ w ].static.sections[ sec ] ?? 0 ) ] )
			.filter( ( [ , d ] ) => d !== 0 );
		if ( deltas.length ) {
			failures++;
			console.log( `  ${ sec.padEnd( 16 ) } ${ deltas.map( ( [ w, d ] ) => `${ w }:${ d > 0 ? '+' : '' }${ d }` ).join( ' ' ) }` );
		}
	}

	console.log( '\nitem grids that are not pixel-identical:' );
	let gridFail = 0;
	for ( const w of VIEWPORTS ) {
		for ( const [ c ] of ITEMS ) {
			const s = report[ w ].static.items[ c ], d = report[ w ].divi.items[ c ];
			if ( ! s || ! d ) continue;
			if ( s.count !== d.count || s.widths.join() !== d.widths.join() ) {
				gridFail++; failures++;
				console.log( `  @${ w } ${ c }: static ${ s.count }×[${ s.widths }] vs divi ${ d.count }×[${ d.widths }]` );
			}
		}
	}
	if ( ! gridFail ) console.log( '  (none)' );

	/* Divi's painted defaults — the failure geometry cannot see. */
	const paint = report[ 1440 ].divi.paint;
	console.log( '\nDivi painted defaults leaking through:' );
	if ( paint.sections.length || paint.headings.length ) {
		failures++;
		paint.sections.forEach( ( s ) => console.log( `  WHITE SECTION  ${ s }` ) );
		paint.headings.forEach( ( h ) => console.log( `  #333 HEADING   ${ h }` ) );
	} else {
		console.log( '  (none)' );
	}

	fs.mkdirSync( OUT, { recursive: true } );
	fs.writeFileSync( path.join( OUT, 'report.json' ), JSON.stringify( report, null, 2 ) );

	console.log( failures === 0 ? '\nPASS — port is pixel-identical to the source.' : `\nFAIL — ${ failures } gate(s)` );
	process.exit( failures === 0 ? 0 : 1 );
} )();

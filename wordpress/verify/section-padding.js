/*
  Section-padding gate: Divi's own section padding leaking into the port.

  WHY THIS EXISTS SEPARATELY FROM compare.js.

  divi.css resets section padding at :where() specificity — (0,0,0) — so that
  the authored sections keep the padding they declare in base.css. Divi's own
  `.et_pb_section { padding: 4% 0 }` scores (0,1,0) and therefore beats that
  reset. Every authored section is saved only because it declares its own
  padding at the same specificity and wins on source order.

  A section that declares NO padding of its own is unprotected. `.reel` was
  exactly that, and took 57px top and bottom at 1440 (50px below 981).

  compare.js could not see it, and that is the point. `.reel` has a fixed
  height (260vh), so the padding was absorbed instead of added: the section
  measured 2340px on both sides and the height gate passed at 0px delta
  across all eight viewports. What moved was the contents — `.reel-stage` is
  sticky, so it started 57px lower and lost 57px of the scroll distance the
  showreel aperture opens over.

  So this compares computed padding directly rather than inferring it from
  height. Any future section that forgets to declare padding fails here on
  the day it is ported.

  Keyed by authored class name, not by element: Divi 5 renders every section
  as `div.et_pb_section`, so `querySelectorAll('section')` finds none of them
  and a tag-based check silently compares nothing.

  Usage:  node wordpress/verify/section-padding.js
  Needs:  the static site on :8777 and the Local site at rysing.local
*/

const { spawn } = require( 'child_process' );

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const STATIC = 'http://127.0.0.1:8777/index.html';
const DIVI = 'http://rysing.local/';

/* The two widths where Divi's default differs: it is `4% 0` above 980px and
   a flat `50px 0` below, so a check at one width alone can miss the other. */
const VIEWPORTS = [ 1440, 760 ];

/* Authored section and band classes. A name that matches nothing on either
   side is reported rather than skipped, so a rename cannot quietly turn this
   gate into a no-op. */
const NAMES = [
	'hero', 'reel', 'stats', 'system', 'manifesto', 'spot', 'team', 'duo',
	'recognition', 'proof', 'belong', 'fudge', 'closing', 'band', 'work',
	'site-foot',
];

const sleep = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

const COLLECT = ( names ) => `(() => {
	const out = {};
	for ( const n of ${ JSON.stringify( names ) } ) {
		document.querySelectorAll( '.' + n ).forEach( ( el, i ) => {
			const c = getComputedStyle( el );
			out[ n + '#' + i ] = {
				pad: [ c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft ].join( ' ' ),
				height: c.height,
			};
		} );
	}
	return out;
})()`;

async function connect( port ) {
	const proc = spawn( CHROME, [
		'--headless', '--disable-gpu', `--remote-debugging-port=${ port }`,
		'--user-data-dir=/tmp/rysing-section-padding', '--no-first-run',
	], { stdio: 'ignore' } );

	let targets;
	for ( let i = 0; i < 40; i++ ) {
		try {
			targets = await ( await fetch( `http://127.0.0.1:${ port }/json/list` ) ).json();
			break;
		} catch ( e ) { await sleep( 250 ); }
	}
	if ( ! targets ) throw new Error( 'Chrome did not expose a debugging target' );

	const ws = new WebSocket( targets.find( ( t ) => t.type === 'page' ).webSocketDebuggerUrl );
	await new Promise( ( r ) => ( ws.onopen = r ) );

	let id = 0;
	const pending = new Map();
	ws.onmessage = ( e ) => {
		const m = JSON.parse( e.data );
		if ( m.id && pending.has( m.id ) ) { pending.get( m.id )( m.result ); pending.delete( m.id ); }
	};
	const send = ( method, params = {} ) => new Promise( ( r ) => {
		const i = ++id;
		pending.set( i, r );
		ws.send( JSON.stringify( { id: i, method, params } ) );
	} );

	return { proc, ws, send };
}

( async () => {
	const { proc, ws, send } = await connect( 9405 );
	await send( 'Page.enable' );
	await send( 'Runtime.enable' );
	await send( 'Page.bringToFront' );
	await send( 'Network.setCacheDisabled', { cacheDisabled: true } );

	let failures = 0;

	for ( const width of VIEWPORTS ) {
		await send( 'Emulation.setDeviceMetricsOverride',
			{ width, height: 900, deviceScaleFactor: 1, mobile: width < 600 } );

		const grab = async ( url ) => {
			await send( 'Page.navigate', { url } );
			await sleep( 1300 );
			const { result } = await send( 'Runtime.evaluate',
				{ expression: COLLECT( NAMES ), returnByValue: true } );
			return result.value;
		};

		const a = await grab( STATIC );
		const b = await grab( DIVI );

		console.log( `\n=== ${ width }px` );
		const keys = Object.keys( a );
		if ( ! keys.length ) {
			console.log( '  NOTHING MATCHED on the static page — the class names above are stale' );
			failures++;
			continue;
		}

		let bad = 0;
		for ( const k of keys ) {
			if ( ! b[ k ] ) {
				console.log( `  ${ k.padEnd( 20 ) } present in static, MISSING in Divi` );
				bad++;
				continue;
			}
			if ( a[ k ].pad !== b[ k ].pad ) {
				console.log( `  ${ k.padEnd( 20 ) } static[ ${ a[ k ].pad } ]  divi[ ${ b[ k ].pad } ]` );
				console.log( `  ${ ''.padEnd( 20 ) } height ${ a[ k ].height } -> ${ b[ k ].height }` +
					( a[ k ].height === b[ k ].height ? '   (height identical — compare.js cannot see this)' : '' ) );
				bad++;
			}
		}
		if ( bad ) failures += bad;
		else console.log( `  ${ keys.length } sections, padding identical` );
	}

	console.log( failures
		? `\nFAIL — ${ failures } section(s) differ. Divi's own padding is leaking through; see divi.css, the note under the :where() reset.`
		: '\nPASS — no Divi section padding is leaking into the port.' );

	ws.close();
	proc.kill();
	process.exit( failures ? 1 : 0 );
} )();

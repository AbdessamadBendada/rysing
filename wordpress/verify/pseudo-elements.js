/*
  Pseudo-element gate: authored ::before / ::after destroyed by the port.

  WHY THIS EXISTS.

  divi.css kills Divi's row and column clearfix pseudo-elements, because they
  become real grid/flex items the moment a row is laid out as grid or flex.
  That rule was written believing "no source rule competes for these".

  It was wrong. An element has exactly ONE ::after. When an authored class is
  placed on a Divi row — `.spot` is — the authored pseudo-element and Divi's
  clearfix are the same pseudo-element, and the killer deletes the authored
  one too. `.spot::after` is the gradient scrim that darkens the lower half
  of the spotlight photograph so the white copy over it holds. It vanished.

  NOTHING ELSE COULD SEE IT. The scrim is `position:absolute; inset:0` and
  paints only a gradient, so no geometry moves when it disappears:
  compare.js passed at 0px across eight viewports, section-padding.js passed,
  and an element-by-element audit found 332 of 332 boxes identical. The only
  symptom was the photograph reading brighter and the copy on it losing
  contrast.

  And `content` alone is not the test. Divi's clearfix is five declarations —
  `content:""; display:block; clear:both; visibility:hidden; height:0;
  line-height:0` — at the same specificity as base.css's rule. base.css wins
  the properties it names and never names `visibility`, `height`, `width` or
  `line-height`, so those survive. Restoring `content` produced a scrim with
  the right gradient and the right inset that still painted nothing, because
  it was `visibility:hidden`, `height:0` and `width:0`. So this gate compares
  the computed BOX as well as `content`.

  The authored selectors are read out of shared.css rather than hardcoded, so
  a pseudo-element added to the design is covered the day it is written.

  Usage:  node wordpress/verify/pseudo-elements.js
  Needs:  the static site on :8777 and the Local site at rysing.local
*/

const { spawn } = require( 'child_process' );
const fs = require( 'fs' );
const path = require( 'path' );

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const STATIC = 'http://127.0.0.1:8777/index.html';
const DIVI = 'http://rysing.local/';
const SHARED_CSS = path.join( __dirname, '..', '..', 'shared.css' );

const sleep = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );

/* Every `.class::before` / `.class::after` the design authors. */
function authoredSelectors() {
	const css = fs.readFileSync( SHARED_CSS, 'utf8' );
	const found = new Set();
	const re = /(^|[\s,{}])\.([a-z0-9_-]+)::(before|after)\b/gi;
	let m;
	while ( ( m = re.exec( css ) ) ) found.add( `${ m[ 2 ] }::${ m[ 3 ] }` );
	return [ ...found ].sort();
}

const PROBE = ( sels ) => `(() => {
	const out = {};
	for ( const s of ${ JSON.stringify( sels ) } ) {
		const [ cls, pseudo ] = s.split( '::' );
		document.querySelectorAll( '.' + cls ).forEach( ( el, i ) => {
			const c = getComputedStyle( el, '::' + pseudo );
			/* Not generated and painting nothing anywhere: not interesting. */
			if ( c.content === 'none' && c.backgroundImage === 'none'
				&& c.backgroundColor === 'rgba(0, 0, 0, 0)' ) return;
			out[ s + '#' + i ] = {
				content: c.content,
				w: Math.round( parseFloat( c.width ) || 0 ),
				h: Math.round( parseFloat( c.height ) || 0 ),
				visibility: c.visibility,
				display: c.display,
				opacity: c.opacity,
				bg: c.backgroundImage === 'none' ? c.backgroundColor : 'image',
			};
		} );
	}
	return out;
})()`;

( async () => {
	const sels = authoredSelectors();
	const port = 9431;
	const proc = spawn( CHROME, [
		'--headless', '--disable-gpu', `--remote-debugging-port=${ port }`,
		'--user-data-dir=/tmp/rysing-pseudo-gate', '--no-first-run',
	], { stdio: 'ignore' } );

	let targets;
	for ( let i = 0; i < 40; i++ ) {
		try { targets = await ( await fetch( `http://127.0.0.1:${ port }/json/list` ) ).json(); break; }
		catch ( e ) { await sleep( 250 ); }
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
		const i = ++id; pending.set( i, r );
		ws.send( JSON.stringify( { id: i, method, params } ) );
	} );

	await send( 'Page.enable' );
	await send( 'Runtime.enable' );
	await send( 'Network.setCacheDisabled', { cacheDisabled: true } );
	await send( 'Emulation.setDeviceMetricsOverride',
		{ width: 1440, height: 900, deviceScaleFactor: 1, mobile: false } );

	const grab = async ( url ) => {
		await send( 'Page.navigate', { url } );
		await sleep( 1700 );
		await send( 'Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true } );
		const { result } = await send( 'Runtime.evaluate',
			{ expression: PROBE( sels ), returnByValue: true } );
		return result.value;
	};

	const a = await grab( STATIC );
	const b = await grab( DIVI );

	console.log( `${ sels.length } authored pseudo-element selectors read from shared.css` );
	console.log( `${ Object.keys( a ).length } instances present on the static homepage\n` );

	let fail = 0;
	for ( const k of Object.keys( a ) ) {
		const s = a[ k ];
		const d = b[ k ];
		if ( ! d ) {
			console.log( `  DESTROYED  ${ k } — not generated at all in the port` );
			fail++;
			continue;
		}
		/* Generated but not painting is the same defect wearing a disguise. */
		const dead = d.content === 'none'
			|| d.visibility === 'hidden'
			|| d.display === 'none'
			|| ( s.w > 0 && d.w === 0 )
			|| ( s.h > 0 && d.h === 0 );
		if ( dead ) {
			console.log( `  NOT PAINTING  ${ k }` );
			console.log( `     static  ${ JSON.stringify( s ) }` );
			console.log( `     divi    ${ JSON.stringify( d ) }` );
			fail++;
		} else if ( s.w !== d.w || s.h !== d.h ) {
			console.log( `  box differs   ${ k }  static ${ s.w }x${ s.h }  divi ${ d.w }x${ d.h }` );
			fail++;
		}
	}

	console.log( fail
		? `\nFAIL — ${ fail } authored pseudo-element(s) lost in the port. See divi.css, the clearfix note.`
		: '\nPASS — every authored pseudo-element is generated and painting in the port.' );

	ws.close();
	proc.kill();
	process.exit( fail ? 1 : 0 );
} )();

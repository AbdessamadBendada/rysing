<?php
/**
 * Native Divi 5 block construction helpers.
 *
 * Shared by create-home-page.php and create-theme-builder.php. The block format
 * is reverse-engineered and unaffiliated with Elegant Themes, so it is pinned
 * to a version: VERIFIED AGAINST DIVI 5.0.1. Re-check after every Divi upgrade
 * — later releases add attribute fields.
 *
 * @package rysing-divi
 */

/** Divi stores every attribute as a breakpoint map; desktop is the base. */
function r_value( $value ) {
	return array( 'desktop' => array( 'value' => $value ) );
}

/**
 * Wrapper class, admin label and arbitrary attributes.
 *
 * Divi DROPS any attribute whose value is '', so a flag attribute must be given
 * a real value. data-reveal and data-stagger are passed as 'true' for exactly
 * that reason: as '' they never reach the DOM, the IntersectionObserver in
 * main.js finds no anchor, and every reveal animation on the page silently
 * fails — for the whole page, with no console error.
 *
 * The corollary for verification: the check is never "the attribute is in the
 * generator", it is "the behaviour the attribute drives actually runs".
 */
function r_attrs( $class, $label, $attributes = array() ) {
	$list = array();

	if ( $class ) {
		$list[] = array(
			'name'          => 'class',
			'value'         => $class,
			'targetElement' => '',
		);
	}

	foreach ( $attributes as $name => $value ) {
		$list[] = array(
			'name'          => $name,
			'value'         => '' === $value ? 'true' : $value,
			'targetElement' => '',
		);
	}

	return array(
		'module' => array(
			'meta'       => array( 'adminLabel' => r_value( $label ) ),
			'decoration' => array(
				'attributes' => r_value( array( 'attributes' => $list ) ),
			),
		),
	);
}

function r_open( $name, $attrs = array() ) {
	return '<!-- wp:divi/' . $name .
		( $attrs ? ' ' . wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) : '' ) .
		' -->';
}

function r_close( $name ) {
	return '<!-- /wp:divi/' . $name . ' -->';
}

function r_module( $name, $attrs ) {
	return '<!-- wp:divi/' . $name . ' ' .
		wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ' /-->';
}

/**
 * Collapse authored HTML to a single line.
 *
 * wpautop turns every newline inside Text module content into a <br>. Inside a
 * grid or flex container those <br> elements become real grid items and shove
 * the actual children into the wrong tracks — the symptom is a child squeezed
 * to min-content while grid-template-columns computes perfectly.
 *
 * The generator is the only correct place to fix this; no CSS reliably undoes
 * it. The OTHER wpautop failure — consecutive non-block siblings merged into a
 * single <p> — is NOT prevented by single-line emission, and is handled by the
 * display:contents rules in divi.css. Both defences are needed.
 *
 * THE /u IS LOAD BEARING. Without it PCRE runs in 8-bit mode, where `\R`
 * matches the bare byte 0x85 (NEL) as a newline. 0x85 is also a perfectly
 * ordinary UTF-8 continuation byte: ★ is U+2605 = E2 98 85, so the pattern
 * ate the third byte of every star, left the invalid pair E2 98, and
 * WordPress substituted a `?` for it on the way to the database. The
 * testimonial rail shipped "? ? ? ? ? " where its five red stars should be.
 * Any character whose encoding ends in 0x85 is exposed the same way.
 */
function r_inline( $html ) {
	return trim( preg_replace( '/\s*\R\s*/u', ' ', $html ) );
}

/**
 * Text module.
 *
 * `rysing-passthrough` makes the module wrapper and its .et_pb_text_inner
 * display:contents on the frontend, so the authored element becomes a real
 * child of the section or grid above it. See the long note in divi.css — it is
 * the rule the whole port depends on.
 */
function r_text( $html, $label, $class = '', $attributes = array() ) {
	$attrs            = r_attrs( trim( 'rysing-passthrough ' . $class ), $label, $attributes );
	$attrs['content'] = array( 'innerContent' => r_value( r_inline( $html ) ) );

	return r_module( 'text', $attrs );
}

/**
 * Code module — for structural markup that must survive byte-identical.
 *
 * WHY THIS EXISTS, and why it is not a shortcut.
 *
 * Divi's Text module runs its content through wpautop, which wraps every run of
 * consecutive non-block siblings in a <p>. Its block list contains <a>, <span>,
 * <strong>, <small>, <button>, <input> and <i> — none of them. Measured on this
 * page, that injected 110+ paragraphs: inside every <blockquote>, inside all
 * eight .system-toggle buttons, around all 26 .marquee-track items, inside
 * .award-lockup, .team-track, .reel-stage, .treel-wrap and both footer <nav>
 * elements. In the footer the injected <p> was not even closed before </nav>.
 *
 * That breaks far more than spacing. .footer-grid > * and
 * .work-row--a > :nth-child(1) are CHILD combinators, so an extra wrapper makes
 * them stop matching entirely — the hand-set column proportions and vertical
 * offsets of the work gallery simply vanish. No CSS reset recovers a selector
 * that no longer matches.
 *
 * CodeModule declares 'applyWpautop' => false, so its content reaches the DOM
 * exactly as authored. Verified by rendering both module types side by side.
 *
 * The skill's rule is to avoid Code modules unless executable inline code is
 * genuinely required, and that rule is respected in spirit: it exists so a page
 * is not dumped into one opaque block instead of being built from real modules.
 * Here the page is still built from real Divi sections, rows, columns, Text,
 * Image and Button modules — Code is used only for the structures the skill's
 * own fallback tier is about, the ones Divi cannot express cleanly. Every
 * heading, paragraph, eyebrow and CTA on the page is still a native Text or
 * Button module the client edits normally.
 */
function r_code( $html, $label, $class = '', $attributes = array() ) {
	$attrs            = r_attrs( trim( 'rysing-passthrough ' . $class ), $label, $attributes );
	$attrs['content'] = array( 'innerContent' => r_value( r_inline( $html ) ) );

	return r_module( 'code', $attrs );
}

/** Button module. The source's inner arrow span is rebuilt as ::after in divi.css. */
function r_button( $text, $url, $label, $class = 'btn-pill', $attributes = array() ) {
	$attrs           = r_attrs( $class, $label, $attributes );
	$attrs['button'] = array(
		'innerContent' => r_value(
			array(
				'text'       => $text,
				'linkUrl'    => $url,
				'linkTarget' => 'sameWindow',
			)
		),
	);

	return r_module( 'button', $attrs );
}

/** Image module. */
function r_image( $src, $alt, $label, $class = '', $attributes = array() ) {
	$attrs          = r_attrs( trim( 'rysing-passthrough ' . $class ), $label, $attributes );
	$attrs['image'] = array(
		'innerContent' => r_value(
			array(
				'src'        => $src,
				'alt'        => $alt,
				'titleText'  => '',
				'linkTarget' => 'off',
			)
		),
	);

	return r_module( 'image', $attrs );
}

/**
 * Column.
 *
 * $box = true adds .rysing-box, which opts the column OUT of display:contents
 * because a source class has turned it into a real layout container
 * (.spot-copy, .founder-body, .fudge-copy).
 */
function r_column( $content, $label = 'Column', $class = '', $box = false, $attributes = array() ) {
	$class                               = trim( $class . ( $box ? ' rysing-box' : '' ) );
	$attrs                               = r_attrs( $class, $label, $attributes );
	$attrs['module']['advanced']['type'] = r_value( '4_4' );

	return r_open( 'column', $attrs ) . $content . r_close( 'column' );
}

/** Row. $box = true when a source class makes the row the grid/flex container. */
function r_row( $columns, $label, $class = '', $box = false, $attributes = array() ) {
	$class                                          = trim( $class . ( $box ? ' rysing-box' : '' ) );
	$attrs                                          = r_attrs( $class, $label, $attributes );
	$attrs['module']['advanced']['columnStructure'] = r_value( '4_4' );

	return r_open( 'row', $attrs ) . implode( '', $columns ) . r_close( 'row' );
}

/** Section. Always a real box — it carries the source section class. */
function r_section( $rows, $class, $label, $attributes = array() ) {
	return r_open( 'section', r_attrs( $class, $label, $attributes ) ) .
		implode( '', $rows ) . r_close( 'section' );
}

/** The common shape: one passthrough row, one passthrough column, n modules. */
function r_plain( $modules, $label ) {
	return r_row( array( r_column( implode( '', $modules ), $label . ' Column' ) ), $label . ' Row' );
}

/**
 * A source grid/flex container holding modules — class on the COLUMN.
 *
 * Use this, not a classed row, whenever the container has a single set of
 * children. Divi treats rows and columns very differently and only one of them
 * is safe to hand a design class:
 *
 *   ROWS are heavily painted, and at specificity the design cannot beat.
 *     .et_block_row { padding: 2% 0 }            (0,1,0) — equal to .band-head,
 *                                                 wins on order: +53px per row
 *     .et_pb_row:not([class*="et_flex_column"])
 *       { margin: 0 auto }                       (0,1,1) — BEATS .band-head
 *                                                 outright, zeroing its
 *                                                 margin-bottom at any order
 *   COLUMNS are nearly bare. Measured: padding and margin all compute to 0,
 *     and Divi touches only width and margin-right, both of which the adapter
 *     already resets at full specificity.
 *
 * The margin case is the decisive one. No cascade trick recovers it: a (0,1,1)
 * Divi selector outranks the source's (0,1,0) class regardless of load order,
 * so the only fixes are to restate the design's margin inside the adapter —
 * duplicating a token that would then drift — or to stop putting design classes
 * on rows. This is the second.
 *
 * Two-column containers (.spot, .duo) still have to carry their class on the
 * row, because the row is the only element whose children are the two columns.
 * Both are safe: .spot is `position: relative` and .duo is `display: grid`
 * plus a gap — neither declares padding or margin for Divi to overwrite.
 */
function r_grid( $modules, $class, $label, $attributes = array() ) {
	return r_row(
		array( r_column( implode( '', $modules ), $label . ' Column', $class, true, $attributes ) ),
		$label . ' Row'
	);
}

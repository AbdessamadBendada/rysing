<?php
/**
 * Media Library audit gate.
 *
 * Run with:
 *   wordpress/wp eval-file wordpress/verify/audit-media.php
 *
 * Asserts the three things that must stay true for every page that is ported,
 * not just the homepage:
 *
 *   1. No active content references a child-theme asset URL, except the
 *      explicitly approved decorative backdrops below.
 *   2. Every manifest asset exists as an attachment with metadata and alt text.
 *   3. Nothing in the content points at an attachment that is missing on disk.
 *
 * Exits non-zero on failure so it can gate a deploy. Run it after every page
 * batch — a new page is the obvious place for a theme image URL to creep back
 * in, and this is far cheaper than noticing it in a screenshot.
 *
 * @package rysing-divi
 */

require_once dirname( __DIR__ ) . '/lib/assets.php';

/**
 * Child-theme assets that are ALLOWED to remain.
 *
 * Fixed decorative backdrops referenced only from base.css background-image,
 * the self-hosted faces, and browser chrome. None is client-manageable and none
 * appears in post content. Anything else under the theme's asset folder is a
 * failure.
 */
const RYSING_THEME_ALLOWED = array(
	'pattern-blue.webp',
	'pattern-red.webp',
	'favicon-32.png',
	'favicon-180.png',
	'favicon-512.png',
);

$post_types = array( 'page', 'post', 'et_header_layout', 'et_body_layout', 'et_footer_layout', 'et_template', 'et_pb_layout' );

$failures = 0;

/* ---- 1. no theme asset URLs in active content ---------------------- */

$leaks = array();

foreach ( get_posts( array( 'post_type' => $post_types, 'post_status' => 'any', 'numberposts' => -1, 'fields' => 'ids' ) ) as $id ) {
	$content = get_post_field( 'post_content', $id );

	if ( ! $content || ! preg_match_all( '#/wp-content/themes/[^"\'\\\\ )]+#', $content, $m ) ) {
		continue;
	}

	foreach ( array_unique( $m[0] ) as $url ) {
		if ( in_array( basename( $url ), RYSING_THEME_ALLOWED, true ) ) {
			continue;
		}
		$leaks[] = sprintf( 'post %d (%s): %s', $id, get_post_type( $id ), $url );
	}
}

if ( $leaks ) {
	$failures += count( $leaks );
	foreach ( $leaks as $l ) {
		WP_CLI::warning( "theme asset URL in content — $l" );
	}
} else {
	WP_CLI::log( '  content references no child-theme assets  OK' );
}

/* ---- 2. every manifest asset is a complete attachment --------------- */

$missing = array();
$thin    = array();

foreach ( rysing_assets() as $file => $meta ) {
	$id = rysing_asset_id( $file );

	if ( ! $id ) {
		$missing[] = $file;
		continue;
	}

	if ( ! file_exists( get_attached_file( $id ) ) ) {
		$thin[] = "$file — attachment #$id has no file on disk";
		continue;
	}

	$alt = (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
	$m   = wp_get_attachment_metadata( $id );
	$is_image = 0 === strpos( (string) get_post_mime_type( $id ), 'image/' );

	if ( $is_image && empty( $m['sizes'] ) ) {
		$thin[] = "$file — no responsive sizes generated";
	}

	/* Videos legitimately carry empty alt; images must not. */
	if ( $is_image && '' === $alt ) {
		$thin[] = "$file — empty alt text";
	}
}

if ( $missing || $thin ) {
	$failures += count( $missing ) + count( $thin );
	foreach ( $missing as $f ) {
		WP_CLI::warning( "not imported — $f" );
	}
	foreach ( $thin as $t ) {
		WP_CLI::warning( $t );
	}
} else {
	WP_CLI::log( sprintf( '  %d manifest assets imported with metadata and alt  OK', count( rysing_assets() ) ) );
}

/* ---- 3. uploads URLs in content resolve to real files --------------- */

$uploads  = wp_get_upload_dir();
$orphans  = array();
$referenced = 0;

foreach ( get_posts( array( 'post_type' => $post_types, 'post_status' => 'any', 'numberposts' => -1, 'fields' => 'ids' ) ) as $id ) {
	$content = get_post_field( 'post_content', $id );

	if ( ! $content || ! preg_match_all( '#' . preg_quote( $uploads['baseurl'], '#' ) . '/([^"\'\\\\ )]+)#', $content, $m ) ) {
		continue;
	}

	foreach ( array_unique( $m[1] ) as $rel ) {
		$referenced++;
		if ( ! file_exists( $uploads['basedir'] . '/' . $rel ) ) {
			$orphans[] = sprintf( 'post %d: %s', $id, $rel );
		}
	}
}

if ( $orphans ) {
	$failures += count( $orphans );
	foreach ( $orphans as $o ) {
		WP_CLI::warning( "uploads URL with no file — $o" );
	}
} else {
	WP_CLI::log( sprintf( '  %d distinct uploads URLs in content all resolve  OK', $referenced ) );
}

if ( $failures ) {
	WP_CLI::error( "$failures media audit failure(s)." );
}

WP_CLI::success( 'Media audit passed.' );

<?php
/**
 * Repoint active content from child-theme asset URLs to Media Library URLs.
 *
 * Run with:
 *   wordpress/wp eval-file wordpress/rewrite-media-urls.php
 *   wordpress/wp eval-file wordpress/rewrite-media-urls.php dry-run
 *
 * Covers EVERY post type that can hold builder content, not just pages: Divi
 * keeps the global header and footer in et_header_layout / et_footer_layout
 * custom post types, and a rewrite that only walks pages leaves the site
 * wordmark and the footer mark pointing at the theme on every page of the site
 * while the audit of "pages" comes back clean.
 *
 * Idempotent: it rewrites only what still matches a theme URL, so a second run
 * reports zero updates.
 *
 * @package rysing-divi
 */

$rysing_admins = get_users(
	array(
		'role'   => 'administrator',
		'number' => 1,
		'fields' => 'ID',
	)
);

if ( empty( $rysing_admins ) ) {
	WP_CLI::error( 'No administrator found; wp_update_post() would run content through KSES.' );
}

wp_set_current_user( (int) $rysing_admins[0] );
kses_remove_filters();

require_once __DIR__ . '/lib/assets.php';

/* `wp eval-file` forwards POSITIONAL arguments as $args; it rejects unknown
   flags before the file ever runs, so this is `dry-run`, not `--dry-run`. */
$dry_run = in_array( 'dry-run', (array) ( $args ?? array() ), true );

/* Every post type whose content can carry a media URL. et_template holds no
   markup itself but is walked anyway so the audit covers the whole Theme
   Builder tree rather than the parts we happen to remember. */
$post_types = array(
	'page',
	'post',
	'et_header_layout',
	'et_body_layout',
	'et_footer_layout',
	'et_template',
	'et_pb_layout',
);

$theme_base = get_stylesheet_directory_uri() . '/assets/rysing-assets/';

/* Divi stores module HTML unicode-escaped inside its block JSON, so the same
   URL can appear in more than one textual form. The forward slashes are the
   part that varies: wp_json_encode() is called with JSON_UNESCAPED_SLASHES in
   lib/blocks.php, but content written by the Visual Builder is not. Both forms
   are rewritten so a client who edits a module in Divi does not leave an
   un-rewritten URL behind. */
$variants = static function ( $url ) {
	return array_unique(
		array(
			$url,
			str_replace( '/', '\\/', $url ),
			str_replace( '/', '\\u002F', $url ),
		)
	);
};

$posts = get_posts(
	array(
		'post_type'        => $post_types,
		'post_status'      => 'any',
		'numberposts'      => -1,
		'fields'           => 'ids',
		'suppress_filters' => false,
	)
);

$updated_posts = 0;
$replacements  = 0;
$unmapped      = array();

foreach ( $posts as $post_id ) {
	$content = get_post_field( 'post_content', $post_id );

	if ( '' === $content || false === strpos( $content, 'rysing-assets/' ) ) {
		continue;
	}

	$before = $content;

	foreach ( rysing_assets() as $file => $unused ) {
		$new = rysing_asset_url( $file );

		foreach ( $variants( $theme_base . $file ) as $i => $old ) {
			$new_variant = $variants( $new )[ $i ];
			$count       = 0;
			$content     = str_replace( $old, $new_variant, $content, $count );
			$replacements += $count;
		}
	}

	/* Anything still pointing at the theme is a file the manifest does not
	   know about. Report it rather than leaving it to the final audit — at this
	   point we know exactly which post it is in. */
	if ( preg_match_all( '#rysing-assets/([^"\'\\\\ )]+)#', $content, $m ) ) {
		foreach ( array_unique( $m[1] ) as $leftover ) {
			$unmapped[] = sprintf( '%s (post %d, %s)', $leftover, $post_id, get_post_type( $post_id ) );
		}
	}

	if ( $content === $before ) {
		continue;
	}

	$updated_posts++;

	if ( $dry_run ) {
		WP_CLI::log( sprintf( '  would update post %d (%s)', $post_id, get_post_type( $post_id ) ) );
		continue;
	}

	/* post_title is always passed: wp_update_post() fills omitted keys from its
	   defaults, which are empty strings, so omitting it blanks the title. */
	$result = wp_update_post(
		array(
			'ID'           => $post_id,
			'post_title'   => get_post_field( 'post_title', $post_id ),
			'post_content' => wp_slash( $content ),
		),
		true
	);

	if ( is_wp_error( $result ) ) {
		WP_CLI::error( sprintf( 'post %d: %s', $post_id, $result->get_error_message() ) );
	}

	WP_CLI::log( sprintf( '  updated post %d (%s)', $post_id, get_post_type( $post_id ) ) );
}

if ( $unmapped ) {
	foreach ( array_unique( $unmapped ) as $u ) {
		WP_CLI::warning( "still on a theme URL and not in the manifest: $u" );
	}
}

/* Divi caches rendered CSS and markup per page; a stale cache serves the old
   image URLs and makes a correct rewrite look like it did nothing. */
if ( function_exists( 'et_core_page_resource_remove_static_resources' ) ) {
	et_core_page_resource_remove_static_resources( 'all', 'all' );
}

WP_CLI::success(
	sprintf(
		'%s%d post(s), %d URL replacement(s).',
		$dry_run ? 'DRY RUN — would update ' : '',
		$updated_posts,
		$replacements
	)
);

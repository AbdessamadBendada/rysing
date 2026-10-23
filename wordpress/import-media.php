<?php
/**
 * Import the content media into the WordPress Media Library.
 *
 * Run with:
 *   wordpress/wp eval-file wordpress/import-media.php
 *
 * Idempotent by construction: every attachment is keyed to the source file it
 * came from through the _rysing_source_asset meta, so a second run finds each
 * one and creates nothing. Verified by the --dry-run / second-run check at the
 * end of the batch.
 *
 * The source files stay in the child theme afterwards. They are the rollback
 * copy and the import source — NOT active content. Nothing in the database
 * points at them once rewrite-media-urls.php has run, and the final audit
 * proves it.
 *
 * @package rysing-divi
 */

/* Attachments are posts, so the same KSES/author rules apply as everywhere
   else in this project. */
$rysing_admins = get_users(
	array(
		'role'   => 'administrator',
		'number' => 1,
		'fields' => 'ID',
	)
);

if ( empty( $rysing_admins ) ) {
	WP_CLI::error( 'No administrator found; attachments would be created with no author.' );
}

wp_set_current_user( (int) $rysing_admins[0] );

/* wp_generate_attachment_metadata() and wp_handle_sideload() live in wp-admin
   and are not loaded during a normal CLI bootstrap. Without image.php the
   import silently produces attachments with NO metadata and no responsive
   sizes — which looks like a success and fails requirement 1. */
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

require_once __DIR__ . '/lib/assets.php';

$source_dir = get_stylesheet_directory() . '/assets/rysing-assets/';

if ( ! is_dir( $source_dir ) ) {
	WP_CLI::error( "Source directory not found: $source_dir (run wordpress/sync-theme.sh first)" );
}

$created = 0;
$updated = 0;
$skipped = 0;
$failed  = array();

foreach ( rysing_assets() as $file => $meta ) {
	list( $title, $alt ) = $meta;

	$path = $source_dir . $file;

	if ( ! file_exists( $path ) ) {
		$failed[] = "$file — source file missing";
		continue;
	}

	$existing = rysing_asset_id( $file );

	if ( $existing ) {
		/* Already imported. Keep the title and alt in sync with the manifest so
		   this file stays the single source of truth, but create nothing. */
		$changed = false;

		if ( get_post_field( 'post_title', $existing ) !== $title ) {
			wp_update_post(
				array(
					'ID'         => $existing,
					'post_title' => $title,
				)
			);
			$changed = true;
		}

		if ( (string) get_post_meta( $existing, '_wp_attachment_image_alt', true ) !== $alt ) {
			update_post_meta( $existing, '_wp_attachment_image_alt', $alt );
			$changed = true;
		}

		$changed ? $updated++ : $skipped++;
		continue;
	}

	/* Copy to a temp file: wp_handle_sideload() MOVES what it is given, and the
	   theme copy has to survive as the rollback source. */
	$tmp = wp_tempnam( $file );

	if ( ! $tmp || ! copy( $path, $tmp ) ) {
		$failed[] = "$file — could not stage a temp copy";
		continue;
	}

	/* Assigned to a variable first: wp_handle_sideload() takes $file BY
	   REFERENCE, so passing the array inline is a fatal error. */
	$upload = array(
		'name'     => $file,
		'tmp_name' => $tmp,
	);

	$sideload = wp_handle_sideload( $upload, array( 'test_form' => false ) );

	if ( ! empty( $sideload['error'] ) ) {
		@unlink( $tmp );
		$failed[] = "$file — " . $sideload['error'];
		continue;
	}

	$attachment_id = wp_insert_attachment(
		array(
			'post_mime_type' => $sideload['type'],
			'post_title'     => $title,
			'post_content'   => '',
			'post_status'    => 'inherit',
		),
		$sideload['file'],
		0,
		true
	);

	if ( is_wp_error( $attachment_id ) ) {
		$failed[] = "$file — " . $attachment_id->get_error_message();
		continue;
	}

	$attachment_id = (int) $attachment_id;

	/* Responsive sizes and dimensions. For video this returns the file metadata
	   instead, which is why it is called unconditionally. */
	wp_update_attachment_metadata(
		$attachment_id,
		wp_generate_attachment_metadata( $attachment_id, $sideload['file'] )
	);

	update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt );

	/* Provenance. This, not the filename, is how every later run finds the
	   attachment — WordPress renames colliding uploads, so the stored filename
	   is not a stable key. */
	update_post_meta( $attachment_id, RYSING_ASSET_META, $file );

	$created++;
}

WP_CLI::log( sprintf( 'created %d, updated %d, unchanged %d', $created, $updated, $skipped ) );

if ( $failed ) {
	foreach ( $failed as $f ) {
		WP_CLI::warning( $f );
	}
	WP_CLI::error( count( $failed ) . ' asset(s) failed to import.' );
}

/* Report what the library now holds, including how many responsive sizes were
   generated — an attachment with no sizes means image.php was not loaded. */
$total = 0;
$sizes = 0;
foreach ( rysing_assets() as $file => $unused ) {
	$id = rysing_asset_id( $file );
	if ( ! $id ) {
		continue;
	}
	$total++;
	$m = wp_get_attachment_metadata( $id );
	if ( ! empty( $m['sizes'] ) ) {
		$sizes += count( $m['sizes'] );
	}
}

WP_CLI::success( sprintf( '%d attachments in the Media Library, %d generated sizes.', $total, $sizes ) );

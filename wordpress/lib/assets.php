<?php
/**
 * The content-media manifest, and the only way a generator may reference media.
 *
 * ONE source of truth for every content image and video: its Media Library
 * title and its alt text. The importer reads this to create attachments; the
 * generators read it to emit URLs. Nothing else may hardcode a media URL.
 *
 * WHY THIS FILE EXISTS RATHER THAN URLS IN THE GENERATORS
 *
 * Content media belongs in the Media Library, not in the child theme. A theme
 * is deployed code — the client cannot see its contents in WP admin, cannot
 * swap a logo without a developer, and loses every image the day the theme is
 * replaced. WordPress also generates no responsive sizes for a file it does not
 * know about, so a theme-served image ships one fixed file to every device.
 *
 * The decisive property, though, is requirement 6: re-running a generator must
 * never restore a child-theme URL. rysing_asset_url() resolves through the
 * Media Library and HARD FAILS if an attachment is missing, so a generator
 * physically cannot emit a theme path. That is enforcement, not convention.
 *
 * WHAT DELIBERATELY STAYS IN THE THEME
 *
 *   rysing-assets/pattern-blue.webp   fixed decorative backdrops, referenced
 *   rysing-assets/pattern-red.webp    only from base.css background-image
 *   rysing-assets/*.woff2             the five self-hosted faces
 *   rysing-assets/favicon-*.png       browser chrome, emitted from functions.php
 *
 * None of those appear in post content, none is client-manageable, and the two
 * patterns are exactly the "fixed decorative backdrop" exemption. Everything
 * else that appears in a page or a Theme Builder layout is in the table below.
 *
 * @package rysing-divi
 */

const RYSING_ASSET_META = '_rysing_source_asset';

/**
 * filename => [ title, alt ]
 *
 * ALT TEXT IS THE ATTACHMENT'S, NOT NECESSARILY THE MARKUP'S. The two are
 * allowed to differ, and in two places they do:
 *
 * - The testimonial portrait renders with alt="" because the person's name sits
 *   beside it in the same figure, so announcing the image would duplicate it.
 *   The ATTACHMENT still needs a real description, because in the Media Library
 *   it has no such context. Requirement 2 is about the library.
 * - Gerd's photograph is used twice with different framing (a service spotlight
 *   and his case study), so the markup carries the more specific alt at each
 *   use while the attachment carries the general one.
 */
function rysing_assets() {
	return array(
		/* --- Brand ----------------------------------------------------- */
		'rysing-logo-lockup-light.webp'    => array( 'Rysing logo lockup (light)', 'Rysing' ),

		/* --- Team ------------------------------------------------------ */
		'anzhelika-red-suit.webp'          => array( 'Anzhelika — founder', 'Anzhelika, founder of Rysing' ),
		'kristina-verbitskaia.webp'        => array( 'Kristina Verbitskaia — photographer', 'Portrait of Kristina Verbitskaia' ),
		'marc-babin.webp'                  => array( 'Marc Babin — partner and producer', 'Portrait of Marc Babin' ),
		'kim-brand-designer.webp'          => array( 'Kim — brand designer', 'Portrait of Kim' ),
		'abdessamad-pic.webp'              => array( 'Ben — web development', 'Portrait of Ben' ),

		/* --- Selected work --------------------------------------------- */
		'work-01-opsdetox.webp'            => array( 'OPS Detox — branded tote bag', 'OPS Detox tote bag, branded merchandise' ),
		'work-02-finer-things.mp4'         => array( 'Finer Things — showreel', '' ),
		'work-02-finer-things-poster.webp' => array( 'Finer Things — video poster', 'Luxury design studio for the finest hotels in the world' ),
		'work-03-clemens.webp'             => array( 'Clemens Doppler on stage', 'Clemens Doppler speaking on stage' ),
		'project-05-djongow.webp'          => array( 'Jennifer Djongow on stage', 'Jennifer Djongow speaking on stage' ),
		'project-04-futurfai.webp'         => array( 'FuturfAI — brand identity', 'FuturfAI brand identity on a display' ),
		'work-06-knowle-victory.webp'      => array( 'Julian Knowle — US Open victory', 'Julian Knowle lifting the US Open doubles trophy' ),
		'work-08-u4success.webp'           => array( 'U4Success — branded shirt', 'U4Success branded shirt' ),
		'work-09-digitfinance.webp'        => array( 'Digit Finance — brand application', 'Digit Finance brand application' ),
		'Gerd-Hero-Section-image.webp'     => array( 'Gerd Bommer on stage', 'Gerd Bommer speaking on stage, wearing a headset microphone' ),

		/* --- Showreel --------------------------------------------------- */
		'rysing-showreel-web.mp4'          => array( 'Rysing showreel', '' ),
		'reel-03.jpg'                      => array( 'Rysing showreel — poster frame', 'Rysing showreel' ),

		/* --- Testimonials ----------------------------------------------- */
		/* TODO(copy): placeholder — all six quotes currently share this one
		   stand-in portrait. Each is replaced on its own. */
		'anzhelika-chair.webp'             => array( 'Testimonial portrait (placeholder)', 'Portrait of a Rysing client' ),

		/* --- Client logos ------------------------------------------------ */
		'logo-clemensdoppler.webp'         => array( 'Client logo — Clemens Doppler', 'Clemens Doppler' ),
		'logo-gerdbommer.webp'             => array( 'Client logo — Gerd Bommer', 'Gerd Bommer' ),
		'logo-jenniferdjongow.webp'        => array( 'Client logo — Jennifer Djongow', 'Jennifer Djongow' ),
		'logo-julianknowle.webp'           => array( 'Client logo — Julian Knowle', 'Julian Knowle' ),
		'logo-futurfai.webp'               => array( 'Client logo — FuturfAI', 'FuturfAI' ),
		'logo-u4success.webp'              => array( 'Client logo — U4Success', 'U4Success' ),
		'logo-wise-up.webp'                => array( 'Client logo — Wise Up', 'Wise Up' ),
		'logo-digitalworld.webp'           => array( 'Client logo — Digital World', 'Digital World' ),
		'logo-digitfinance.webp'           => array( 'Client logo — Digit Finance', 'Digit Finance' ),
		'logo-volkshilfe.webp'             => array( 'Client logo — Volkshilfe', 'Volkshilfe' ),
		'logo-mam.webp'                    => array( 'Client logo — MAM', 'MAM' ),
		'logo-dsp.webp'                    => array( 'Client logo — Der Schulter Physio', 'Der Schulter Physio' ),
		'logo-rb.webp'                     => array( 'Client logo — RB Real Beauty', 'RB Real Beauty' ),
	);
}

/**
 * The attachment id for a source file, or 0.
 *
 * Looked up by the provenance meta rather than by filename or URL: WordPress
 * renames an upload that collides with an existing one, so the stored filename
 * is not a stable key, while the source asset it came from is.
 */
function rysing_asset_id( $file ) {
	static $cache = array();

	if ( isset( $cache[ $file ] ) ) {
		return $cache[ $file ];
	}

	$found = get_posts(
		array(
			'post_type'        => 'attachment',
			'post_status'      => 'any',
			'numberposts'      => 1,
			'fields'           => 'ids',
			'meta_key'         => RYSING_ASSET_META,
			'meta_value'       => $file,
			'suppress_filters' => false,
		)
	);

	$id = $found ? (int) $found[0] : 0;

	/* Only hits are cached. Caching a MISS is wrong inside the importer, which
	   asks for an id, creates the attachment, then asks again — a cached 0
	   would persist for the rest of the run and report an empty library after a
	   successful import of all 32 files. */
	if ( $id ) {
		$cache[ $file ] = $id;
	}

	return $id;
}

/**
 * The Media Library URL for a source file.
 *
 * Hard fails rather than falling back to the theme copy. A silent fallback is
 * precisely the bug requirement 6 is about: the generator would keep working,
 * the page would keep rendering, and the theme URLs would quietly reappear in
 * the database on the next run with nothing to show that anything regressed.
 */
function rysing_asset_url( $file ) {
	$id = rysing_asset_id( $file );

	if ( ! $id ) {
		$message = sprintf(
			'Asset "%s" has no Media Library attachment. Run: wordpress/wp eval-file wordpress/import-media.php',
			$file
		);

		if ( class_exists( 'WP_CLI' ) ) {
			WP_CLI::error( $message );
		}

		throw new RuntimeException( $message );
	}

	return wp_get_attachment_url( $id );
}

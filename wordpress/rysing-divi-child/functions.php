<?php
/**
 * Rysing Divi child theme.
 *
 * Responsibilities, and nothing beyond them: conditional asset enqueues, the
 * page-role helper those enqueues branch on, body classes, and the skip link.
 *
 * @package rysing-divi
 */

defined( 'ABSPATH' ) || exit;

const RYSING_ROLE_META = '_rysing_page_role';

/**
 * The role a page plays in the ported site, or '' for pages we did not build.
 *
 * Keyed on post meta rather than on the slug or the page ID. The client can
 * rename the page or change its permalink in wp-admin and the styling must
 * follow it; a slug match would silently stop applying and leave an unstyled
 * page with no error anywhere. The generator writes this meta.
 */
function rysing_page_role() {
	if ( ! is_singular() ) {
		return '';
	}

	$id = get_queried_object_id();

	return $id ? (string) get_post_meta( $id, RYSING_ROLE_META, true ) : '';
}

/**
 * Assets.
 *
 * Priority 30 so Divi has already registered 'divi-style-child' (it enqueues
 * the child stylesheet for us at the default priority — see the parent's
 * et_divi_enqueue_stylesheet). Depending on that handle puts every rule here
 * after both Divi stylesheets, which is the only position from which the
 * adapter rules can win without !important.
 *
 * These load on ported pages only. The design system is 185KB and the asset
 * folder is self-hosted; loading it sitewide so one landing page can use it
 * would tax wp-admin-authored pages that never reference a single rule.
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		$role = rysing_page_role();

		if ( ! $role ) {
			return;
		}

		$uri = get_stylesheet_directory_uri();
		$dir = get_stylesheet_directory();

		/* filemtime as the version: these files are rewritten by sync-theme.sh
		   on every deploy, and a stale cached stylesheet against fresh markup
		   renders the page as a half-built version of itself rather than as
		   anything that looks like a caching problem. */
		$ver = static function ( $rel ) use ( $dir ) {
			$path = $dir . $rel;

			return file_exists( $path ) ? (string) filemtime( $path ) : null;
		};

		wp_enqueue_style( 'rysing-base', $uri . '/assets/css/base.css', array( 'divi-style-child' ), $ver( '/assets/css/base.css' ) );
		wp_enqueue_style( 'rysing-divi', $uri . '/assets/css/divi.css', array( 'rysing-base' ), $ver( '/assets/css/divi.css' ) );

		if ( 'home' === $role ) {
			wp_enqueue_style( 'rysing-divi-home', $uri . '/assets/css/divi-home.css', array( 'rysing-divi' ), $ver( '/assets/css/divi-home.css' ) );
		}

		/* In the footer, and not deferred. The script reads layout geometry on
		   load (the reel aperture and both rails measure before first paint),
		   so it wants the parsed DOM but not another frame's delay. */
		wp_enqueue_script( 'rysing-interactions', $uri . '/assets/js/main.js', array(), $ver( '/assets/js/main.js' ), true );
	},
	30
);

/**
 * Drop the `no-js` class before the first paint.
 *
 * This has to be inline and early, exactly as the static <head> does it.
 * `.no-js` changes the reel's layout and turns the testimonial rail into a
 * wrapped row, so clearing it from the deferred main.js would paint the
 * no-script layout and then reflow on every load. It sits on <html> rather
 * than <body> because <body> does not exist yet at this point.
 *
 * WordPress has no filter that adds a class to <html> without JavaScript, so
 * the class is added and removed by the same pair of inline statements.
 */
add_action(
	'wp_head',
	function () {
		if ( ! rysing_page_role() ) {
			return;
		}

		echo '<script>document.documentElement.classList.add("no-js");' .
			'document.documentElement.classList.remove("no-js");</script>' . "\n";
	},
	0
);

/**
 * Favicons and theme colour.
 *
 * theme-color tracks --ink. A stale value here tints the mobile browser chrome
 * a different black from the page sitting under it.
 */
add_action(
	'wp_head',
	function () {
		if ( ! rysing_page_role() ) {
			return;
		}

		$uri = get_stylesheet_directory_uri() . '/assets/rysing-assets/';

		printf( '<link rel="icon" type="image/png" sizes="32x32" href="%s">' . "\n", esc_url( $uri . 'favicon-32.png' ) );
		printf( '<link rel="icon" type="image/png" sizes="512x512" href="%s">' . "\n", esc_url( $uri . 'favicon-512.png' ) );
		printf( '<link rel="apple-touch-icon" href="%s">' . "\n", esc_url( $uri . 'favicon-180.png' ) );
		echo '<meta name="theme-color" content="#000000">' . "\n";
	},
	2
);

/**
 * Stop Divi re-declaring its module defaults AFTER the design stylesheet.
 *
 * This is the single most important cascade decision in the port, and it was
 * arrived at by measurement, not preference.
 *
 * Divi does not emit its CSS from one stylesheet. Beyond the enqueued parent
 * and child sheets it also emits "critical" and "unified static" CSS, and
 * those blocks re-declare Divi's own module defaults, for example
 *
 *     @media only screen and (min-width: 1350px) { .et_pb_section { padding: 54px 0 } }
 *
 * at specificity (0,1,0) — identical to the design's own
 * `.band { padding-inline: var(--gutter) }`. On equal specificity the later
 * rule wins.
 *
 * The measured symptom: every section lost its 57.6px horizontal gutter and
 * took Divi's 54px vertical padding, but ONLY at 1350px and wider. The page
 * measured essentially correct from 390 to 1280 and went full-bleed at 1440 —
 * a cascade bug that presents as a breakpoint bug.
 *
 * Two fixes were tried and rejected before this one:
 *
 * - Printing the child stylesheets last in wp_head. It does not work: Divi
 *   injects the critical block by filtering the buffered page output, after
 *   every wp_head hook has already run, so no priority can get past it.
 * - Escalating the adapter's specificity. Worse: a selector strong enough to
 *   beat Divi also beats the design's own classes, which would force the
 *   design's padding values to be restated inside the adapter, where they
 *   would silently drift from base.css.
 *
 * Switching the two features off is the fix that addresses the cause. Divi then
 * serves its defaults from the normally enqueued parent stylesheet, which loads
 * BEFORE the child theme, so the design wins by ordinary cascade order and the
 * adapter can stay at zero specificity.
 *
 * Deliberately NOT conditional on rysing_page_role(). Both filters fire before
 * the main query is available, so a role check inside them silently evaluates
 * to '' and returns the value unchanged — which is exactly how the first
 * attempt at this failed while looking correct. Divi's performance features
 * stay off site-wide; on a site whose pages are all built from this design
 * system that is the intended trade, and the cost is one extra cached
 * stylesheet request rather than inlined above-the-fold CSS.
 */
add_filter( 'et_pb_critical_css_enabled', '__return_false' );

/* Divi reads its options out of the single et_divi array, so the setting is
   filtered rather than written. That keeps it in version control with the rest
   of the theme instead of living only in this database, where the next
   environment would not inherit it.

   The guard is not optional. pre_option_et_divi short-circuits get_option(),
   so calling get_option('et_divi') to read the stored array re-enters this
   same filter and recurses until the process dies. The flag makes the inner
   read return the real stored value. */
add_filter(
	'option_et_divi',
	function ( $value ) {
		if ( ! is_array( $value ) ) {
			return $value;
		}

		$value['et_pb_static_css_file'] = 'off';

		return $value;
	}
);

/**
 * Suppress Divi's unified page-resource stylesheet on ported pages.
 *
 * The last of the late sheets, and the one the two filters above do not reach:
 * Divi writes a per-page resource named
 * et-core-unified-tb-<header>-tb-<footer>-<page>, and enqueues it at the very
 * end of <head> — after the child theme's stylesheets, whatever they declare
 * as a dependency.
 *
 * Its whole contents were read before this was added. It is 4KB and holds
 * nothing but Divi's own defaults for the module INSTANCES on the page —
 * generated selectors like .et_pb_code_0 and .et_pb_text_3 — plus Divi's
 * mobile-nav styles and three rules that actively fight the design:
 *
 *     @media (min-width: 1350px) { .et_pb_section { padding: 54px 0 } }
 *     @media (min-width: 1350px) { .et_block_row  { padding: 27px 0 } }
 *     color: rgba(0,0,0,0.6)
 *
 * The first is what stripped every section's gutter above 1350px. The last
 * would paint content near-black on a #000 page. None of the file is design
 * output: no module on this page carries a single Divi design setting, because
 * all styling comes from base.css. Measured: zero occurrences of any design
 * class in the file.
 *
 * Suppressed through style_loader_tag rather than wp_dequeue_style because the
 * resource is enqueued after wp_enqueue_scripts has finished, so there is no
 * queue left to dequeue it from. Returning an empty tag works wherever it is
 * added from.
 *
 * Scoped to ported pages — unlike the two filters above, this one runs while
 * the main query is available, so rysing_page_role() is reliable here and a
 * client-authored Divi page keeps its own generated CSS.
 */
add_filter(
	'style_loader_tag',
	function ( $tag, $handle ) {
		if ( 0 !== strpos( $handle, 'et-core-unified' ) ) {
			return $tag;
		}

		return rysing_page_role() ? '' : $tag;
	},
	10,
	2
);

/* Divi's PageResource has TWO output paths and picks between them at runtime:
   when it can it calls wp_enqueue_style() (caught by the filter above), and
   otherwise it builds the <link> itself and prints it, which no core style
   hook ever sees. On this site it takes the second path, so filtering only
   style_loader_tag looked correct, registered fine, and changed nothing —
   the stylesheet kept loading and kept winning.

   Both are filtered because which path runs depends on Divi's own caching
   state and can change between requests. */
add_filter(
	'et_core_page_resource_tag',
	function ( $tag, $slug ) {
		if ( 0 !== strpos( (string) $slug, 'et-core-unified' ) ) {
			return $tag;
		}

		return rysing_page_role() ? '' : $tag;
	},
	10,
	2
);

/* And a third path, which only appears on the request that GENERATES the
   resource. Until the cache file exists, Divi echoes the same CSS as an inline
   <style id="et-core-unified-…-cached-inline-styles"> from its own 'head-late'
   output stage. That block never passes through style_loader_tag and never
   enters wp_styles' print queue — Divi prints it directly — so neither filter
   above sees it, and neither does print_styles_array (tried; it does nothing
   here).
 *
 * The window is small but entirely real: it is the first page view after any
 * cache clear or deploy. It rendered a full-bleed, gutterless page at 1350px
 * and wider while every subsequent view was correct, which is the kind of
 * defect that gets reported once and then refuses to reproduce.
 *
 * Emptying the resource's data at source covers all three paths at once —
 * inline block, generated file, and enqueued tag — because they are all built
 * from this same array. */
add_filter(
	'et_core_page_resource_get_data',
	function ( $data, $context, $resource ) {
		unset( $context );

		if ( ! isset( $resource->slug ) || 0 !== strpos( (string) $resource->slug, 'et-core-unified' ) ) {
			return $data;
		}

		return rysing_page_role() ? array() : $data;
	},
	10,
	3
);

/**
 * Preload the two faces that draw above the fold.
 *
 * Kinfolk sets every .display headline and Aileron Regular sets body copy, so
 * both are needed for the hero's first paint. The other three Aileron weights
 * are deliberately left to normal discovery — preloading all five would
 * contend with the hero video for the same connection.
 */
add_action(
	'wp_head',
	function () {
		if ( ! rysing_page_role() ) {
			return;
		}

		$uri = get_stylesheet_directory_uri() . '/assets/rysing-assets/';

		foreach ( array( 'Kinfolk-Regular.woff2', 'Aileron-Regular.woff2' ) as $font ) {
			printf(
				'<link rel="preload" as="font" type="font/woff2" href="%s" crossorigin>' . "\n",
				esc_url( $uri . $font )
			);
		}
	},
	1
);

/**
 * Body classes.
 *
 * `rysing` scopes the design system away from wp-admin-authored pages; the
 * per-role class is what a page-scoped stylesheet hangs off.
 */
add_filter(
	'body_class',
	function ( $classes ) {
		$role = rysing_page_role();

		if ( $role ) {
			$classes[] = 'rysing';
			$classes[] = 'page-' . sanitize_html_class( $role );
		}

		return $classes;
	}
);

/**
 * Skip link.
 *
 * The static source ships one as the first focusable element on every page and
 * styles it through .skip-link in the design system. Divi's page content starts
 * below the Theme Builder header, so this has to be emitted before it rather
 * than built as a module inside the layout.
 */
add_action(
	'wp_body_open',
	function () {
		if ( ! rysing_page_role() ) {
			return;
		}

		printf(
			'<a class="skip-link" href="%s">%s</a>',
			esc_url( '#reel' ),
			esc_html__( 'Skip to content', 'rysing-divi' )
		);

		/* The static layout carries this id on <main>. Divi owns the content
		   wrapper and gives it #et-boc, so the anchor is emitted as its own
		   empty target instead. Both the header wordmark and the footer's
		   "Back to top" link resolve to #top — without this they are dead
		   links that silently do nothing. */
		echo '<span id="top"></span>';
	},
	1
);

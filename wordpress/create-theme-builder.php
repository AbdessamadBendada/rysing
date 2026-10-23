<?php
/**
 * Build the Rysing global header and footer as Divi 5 Theme Builder templates.
 *
 * Run with:
 *   wordpress/wp eval-file wordpress/create-theme-builder.php
 *
 * These are GLOBAL on purpose. The skill's rule is to promote header and footer
 * to Theme Builder templates as soon as a second page needs them, and then keep
 * them global — page-scoped copies drift, and three pages end up with three
 * footers carrying identical markup. The five remaining Rysing pages (about,
 * process, contact, communication-strategy, case-gerd-bommer) will inherit
 * these unchanged. Do not reintroduce a page-scoped .site-footer.
 *
 * Idempotent: layouts are found by their own meta, and the default template is
 * reused rather than duplicated.
 *
 * Verified against Divi 5.0.1.
 *
 * @package rysing-divi
 */

/* Same KSES trap as the page generator: with no admin user, every block comment
   is entity-encoded and the header/footer render blank. Worse here, because a
   mangled Theme Builder layout affects every page at once. */
$rysing_admins = get_users(
	array(
		'role'   => 'administrator',
		'number' => 1,
		'fields' => 'ID',
	)
);

if ( empty( $rysing_admins ) ) {
	WP_CLI::error( 'No administrator found. Block comments would be KSES-encoded.' );
}

wp_set_current_user( (int) $rysing_admins[0] );
kses_remove_filters();

foreach ( array( 'ET_THEME_BUILDER_TEMPLATE_POST_TYPE', 'ET_THEME_BUILDER_HEADER_LAYOUT_POST_TYPE', 'ET_THEME_BUILDER_FOOTER_LAYOUT_POST_TYPE' ) as $needed ) {
	if ( ! defined( $needed ) ) {
		WP_CLI::error( "Divi Theme Builder not loaded: $needed is undefined." );
	}
}

require_once __DIR__ . '/lib/blocks.php';

const RYSING_TB_META = '_rysing_tb_role';

/* Media resolves through the Media Library, never the child theme.
   rysing_asset_url() hard fails on a missing attachment, so re-running this
   generator cannot reintroduce a /wp-content/themes/ image URL. */
require_once __DIR__ . '/lib/assets.php';

/* Cross-page destinations.
 *
 * The static site links to flat files (about.html); WordPress serves pretty
 * permalinks. These are the paths those pages WILL have once ported. Only the
 * homepage is in scope today, so About/Services/Process/Contact/Blog are
 * live links to pages that do not exist yet and will 404 until each is built.
 * That is a deliberate, reported gap rather than a silent one — the
 * alternative, pointing them at '#', would hide it. */
$nav = array(
	'home'     => '/',
	'about'    => '/about/',
	'services' => '/communication-strategy/',
	'process'  => '/process/',
	'contact'  => '/contact/',
	'blog'     => '/blog/',
);


/* ------------------------------------------------------------------
 * Header
 * ------------------------------------------------------------------ */

/* .site-head is position:fixed and a flex row over two children: the wordmark
   and .head-right. Both must be real children, which rysing-passthrough
   delivers. The pills here stay real anchors rather than Button modules
   because each carries an inner .arrow span that base.css masks — and because
   .btn-pill-head is hidden below 1080px by a source media query that keys off
   the anchor itself. */
$header_section = r_section(
	array(
		r_plain(
			array(
				r_code(
					'<a class="wordmark" href="' . $nav['home'] . '#top" aria-label="Rysing home"><img src="' . rysing_asset_url( 'rysing-logo-lockup-light.webp' ) . '" alt="Rysing" width="1377" height="292" /></a>',
					'Wordmark'
				),
				r_code(
					'<div class="head-right">
						<a class="btn-pill btn-pill-head" href="' . $nav['home'] . '#contact">Apply to work with us <span class="arrow" aria-hidden="true"></span></a>
						<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-overlay" aria-label="Open menu"><span class="menu-toggle-lines" aria-hidden="true"></span></button>
					</div>',
					'Header Actions'
				),
			),
			'Header'
		),
	),
	'site-head',
	'Site Header'
);

/* The full-screen menu.
 *
 * A sibling of <header> in the source, not a child, and position:fixed — so it
 * gets its own section. The header carries only mark, ask and burger at every
 * width, so this overlay IS the navigation rather than a mobile fallback.
 *
 * Anything here ships into all six pages. About and Services are real pages,
 * not homepage anchors, so they take no home prefix. */
$overlay_section = r_section(
	array(
		r_plain(
			array(
				r_code(
					'<button class="overlay-close" type="button" aria-label="Close menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg></button>',
					'Overlay Close Button'
				),
				r_code(
					'<nav class="overlay-nav display" aria-label="Overlay navigation">' .
					'<a href="' . $nav['home'] . '#top">Home</a>' .
					'<a href="' . $nav['about'] . '">About</a>' .
					'<a href="' . $nav['services'] . '">Services</a>' .
					'<a href="' . $nav['process'] . '">Process</a>' .
					'<a href="' . $nav['home'] . '#work">Portfolio</a>' .
					'<a href="' . $nav['blog'] . '">Blog</a>' .
					'<a href="' . $nav['contact'] . '">Contact</a>' .
					'</nav>',
					'Overlay Navigation'
				),
				/* TODO(asset): real award logo files pending from client Drive.
				   TODO(link): final social profile URLs not supplied. */
				r_code(
					'<div class="overlay-bottom">
						<div class="award-lockups" aria-label="Awards">
							<div class="award-lockup"><span class="award-mark" aria-hidden="true"></span><div><span>[ Award name ]</span><span>[ Detail ]</span></div></div>
							<div class="award-lockup"><span class="award-mark" aria-hidden="true"></span><div><span>[ Award name ]</span><span>[ Detail ]</span></div></div>
							<div class="award-lockup"><span class="award-mark" aria-hidden="true"></span><div><span>[ Award name ]</span><span>[ Detail ]</span></div></div>
							<div class="award-lockup"><span class="award-mark" aria-hidden="true"></span><div><span>[ Award name ]</span><span>[ Detail ]</span></div></div>
						</div>
						<div class="social-links" aria-label="Social media">
							<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg></a>
							<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.2l.8-4h-4V9c0-.7.3-1 1-1Z"/></svg></a>
							<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM2 9h4v13H2V9Zm7 0h4v1.8c1-1.4 2.4-2.2 4.2-2.2 4 0 4.8 2.6 4.8 6V22h-4v-6.6c0-1.6 0-3.6-2.2-3.6S13 13.5 13 15.3V22H9V9Z"/></svg></a>
							<a href="#" aria-label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.7 3.3-3.2 16c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20 2.9c.9-.3 1.9.2 1.7.4Z"/></svg></a>
						</div>
					</div>',
					'Overlay Awards & Socials'
				),
			),
			'Menu Overlay'
		),
	),
	'menu-overlay',
	'Menu Overlay',
	array(
		'id'          => 'menu-overlay',
		'aria-hidden' => 'true',
	)
);


/* ------------------------------------------------------------------
 * Footer
 * ------------------------------------------------------------------ */

$footer_section = r_section(
	array(
		r_plain(
			array(
				r_code( '<span class="footer-light" aria-hidden="true"></span>', 'Footer Light' ),
				r_code(
					'<div class="footer-grid label">
						<p class="footer-blurb">Brand, content and sales for founders who want to become the only choice in their industry.</p>
						<nav aria-label="Company">
							<h3>Company</h3>
							<a href="' . $nav['home'] . '#system">Services</a><a href="' . $nav['home'] . '#spotlight">Keynote speaking</a><a href="' . $nav['home'] . '#work">Work</a><a href="' . $nav['home'] . '#sunday-fudge">Sunday Fudge</a><a href="' . $nav['home'] . '#contact">Apply to work with us</a>
						</nav>
						<div>
							<h3>Contact</h3>
							<a href="mailto:hello@rysing.agency">hello@rysing.agency</a><a href="#">rysing.agency</a><span>Vienna, Austria</span>
						</div>
						<nav class="footer-legal" aria-label="Legal">
							<a href="#">Imprint</a><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a><a href="#">Cookie Policy</a><a href="' . $nav['home'] . '#top">Back to top ↑</a>
						</nav>
					</div>',
					'Footer Grid'
				),
				r_code(
					'<div class="footer-meta label"><span>© 2026 Rysing, Vienna, Austria. All rights reserved.</span></div>',
					'Footer Copyright'
				),
				r_code(
					'<a href="' . $nav['home'] . '#top" aria-label="Rysing, back to top"><img class="footer-mark" src="' . rysing_asset_url( 'rysing-logo-lockup-light.webp' ) . '" alt="Rysing" width="1377" height="292" loading="lazy" decoding="async" /></a>',
					'Footer Wordmark'
				),
			),
			'Footer'
		),
	),
	'site-footer',
	'Site Footer'
);


/* ------------------------------------------------------------------
 * Store the layouts
 * ------------------------------------------------------------------ */

/**
 * Create or update a Theme Builder layout post.
 *
 * Divi's own et_theme_builder_insert_layout() does three things beyond the
 * insert: it sets the 'layout' term in the layout_type taxonomy, enables the
 * builder for the post, and publishes it. All three are required or the layout
 * is ignored at render time, so they are reproduced here rather than guessed.
 */
function rysing_tb_layout( $post_type, $role, $title, $content ) {
	$existing = get_posts(
		array(
			'post_type'        => $post_type,
			'post_status'      => 'any',
			'numberposts'      => 1,
			'fields'           => 'ids',
			'meta_key'         => RYSING_TB_META,
			'meta_value'       => $role,
			'suppress_filters' => false,
		)
	);

	$postarr = array(
		'post_type'    => $post_type,
		'post_status'  => 'publish',
		/* Always passed: wp_insert_post() fills omitted keys from defaults,
		   which are empty strings, so an update that omits the title silently
		   blanks it. */
		'post_title'   => $title,
		'post_content' => wp_slash( $content ),
	);

	if ( $existing ) {
		$postarr['ID'] = (int) $existing[0];
		$id            = wp_update_post( $postarr, true );
	} else {
		$id = wp_insert_post( $postarr, true );
	}

	if ( is_wp_error( $id ) ) {
		WP_CLI::error( $id->get_error_message() );
	}

	$id = (int) $id;

	wp_set_object_terms( $id, 'layout', 'layout_type', true );
	et_builder_enable_for_post( $id );
	update_post_meta( $id, RYSING_TB_META, $role );

	$stored = get_post_field( 'post_content', $id );

	if ( substr_count( $stored, '&lt;!-- wp:divi/' ) > 0 ) {
		WP_CLI::error( "Layout $role was KSES-encoded and would render blank on every page." );
	}

	return $id;
}

$header_id = rysing_tb_layout(
	ET_THEME_BUILDER_HEADER_LAYOUT_POST_TYPE,
	'header',
	'Rysing Header',
	$header_section . $overlay_section
);

$footer_id = rysing_tb_layout(
	ET_THEME_BUILDER_FOOTER_LAYOUT_POST_TYPE,
	'footer',
	'Rysing Footer',
	$footer_section
);


/* ------------------------------------------------------------------
 * Attach them to the default template
 * ------------------------------------------------------------------ */

/* The default template is the one Divi applies wherever no more specific
   template matches — which is what "global" means here. Reuse it if it exists
   rather than adding a second default, since two defaults is an undefined
   state. */
$templates = get_posts(
	array(
		'post_type'        => ET_THEME_BUILDER_TEMPLATE_POST_TYPE,
		'post_status'      => 'publish',
		'numberposts'      => -1,
		'fields'           => 'ids',
		'suppress_filters' => false,
	)
);

$template_id = 0;
foreach ( $templates as $candidate ) {
	if ( '1' === get_post_meta( $candidate, '_et_default', true ) ) {
		$template_id = (int) $candidate;
		break;
	}
}

if ( ! $template_id ) {
	$template_id = wp_insert_post(
		array(
			'post_type'   => ET_THEME_BUILDER_TEMPLATE_POST_TYPE,
			'post_status' => 'publish',
			'post_title'  => 'Rysing Default Template',
		),
		true
	);

	if ( is_wp_error( $template_id ) ) {
		WP_CLI::error( $template_id->get_error_message() );
	}

	$template_id = (int) $template_id;
}

/* Body: id 0 and ENABLED. This combination is counter-intuitive and getting it
   wrong blanks every page on the site.
 *
 * Divi derives a per-area "override" flag rather than storing it:
 *
 *     override = ( 0 !== $id ) || ( false === $enabled )
 *
 * So id=0 with enabled=0 does NOT mean "leave the body alone" — it computes to
 * override=true, which Divi reads as "override the body with layout 0", and it
 * renders the page content as nothing. The fifteen sections vanish and the
 * .et-l--body wrapper disappears with them; the page returns 200 with the
 * header and footer intact, which makes it look like the page generator failed
 * rather than the template.
 *
 * id=0 with enabled=1 computes to override=false, which is the actual "do not
 * touch the body" state. Each page then supplies its own content, which is
 * what a global header/footer template is supposed to do. */
$metas = array(
	'_et_autogenerated_title'   => '0',
	'_et_default'               => '1',
	'_et_enabled'               => '1',
	'_et_header_layout_id'      => $header_id,
	'_et_header_layout_enabled' => '1',
	'_et_body_layout_id'        => 0,
	'_et_body_layout_enabled'   => '1',
	'_et_footer_layout_id'      => $footer_id,
	'_et_footer_layout_enabled' => '1',
);

foreach ( $metas as $key => $value ) {
	update_post_meta( $template_id, $key, $value );
}

/* Attach the template to the LIVE Theme Builder container.
 *
 * This step is invisible and absolutely required. A published et_template with
 * perfect meta is still never consulted: Divi does not query templates by post
 * type at render time. It finds the one published et_theme_builder post (the
 * container), reads its repeated _et_template meta, and considers only those
 * ids — see et_theme_builder_get_theme_builder_template_ids().
 *
 * Skip this and the symptom is the .et-l--header and .et-l--footer wrappers
 * never appearing in the DOM at all, while every piece of meta you would think
 * to check reads correctly. It looks like a layout problem, not a linkage one.
 */
$tb_id = et_theme_builder_get_theme_builder_post_id( true, true );

if ( ! $tb_id ) {
	WP_CLI::error( 'Could not resolve or create the live Theme Builder container post.' );
}

/* _et_template is a repeated meta key, so update_post_meta() cannot manage it.
   Delete and re-add, which also keeps a re-run from stacking duplicates. */
$attached = array_map( 'intval', get_post_meta( $tb_id, '_et_template', false ) );

if ( ! in_array( $template_id, $attached, true ) ) {
	add_post_meta( $tb_id, '_et_template', $template_id );
}

/* A backup option, written during Divi's own save, SHADOWS the post meta above
   when present. A stale one pins the old template list and the new template is
   ignored. */
delete_option( 'et_tb_templates_backup_' . $tb_id );

/* Divi caches the resolved template-to-layout map; a stale cache serves the
   previous header on every page and looks exactly like the script not having
   run. */
if ( function_exists( 'et_theme_builder_clear_wp_cache' ) ) {
	et_theme_builder_clear_wp_cache();
}

if ( function_exists( 'et_core_page_resource_remove_static_resources' ) ) {
	et_core_page_resource_remove_static_resources( 'all', 'all' );
}

WP_CLI::success(
	sprintf(
		'Theme Builder container %d -> template %d (default): header layout %d, footer layout %d.',
		$tb_id,
		$template_id,
		$header_id,
		$footer_id
	)
);

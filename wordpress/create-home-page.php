<?php
/**
 * Build the Rysing homepage from native Divi 5 blocks.
 *
 * Run with:
 *   wordpress/wp eval-file wordpress/create-home-page.php
 *
 * Idempotent. The page is found by its _rysing_page_role meta rather than by
 * title or slug, so a second run updates the same page instead of creating a
 * duplicate, and the client renaming the page in wp-admin does not orphan it.
 *
 * Section order is taken from src/index.html and is FROZEN — it is the order
 * the client gave, not one derived from how the page reads. Do not resequence.
 *
 * Verified against Divi 5.0.1.
 *
 * @package rysing-divi
 */

/* ------------------------------------------------------------------
 * Bootstrap
 * ------------------------------------------------------------------ */

/* Without an admin user, current_user_can('unfiltered_html') is false and
   wp_insert_post() runs the content through KSES, which entity-encodes every
   block comment into &lt;!-- wp:divi/text. parse_blocks() then returns nothing:
   the page renders BLANK, post_title is silently emptied, and no error appears
   anywhere. This is the single most expensive failure in this workflow. */
$rysing_admins = get_users(
	array(
		'role'   => 'administrator',
		'number' => 1,
		'fields' => 'ID',
	)
);

if ( empty( $rysing_admins ) ) {
	WP_CLI::error( 'No administrator found. Block comments would be KSES-encoded and the page would render blank.' );
}

wp_set_current_user( (int) $rysing_admins[0] );
kses_remove_filters();

if ( 'rysing-divi-child' !== get_stylesheet() ) {
	WP_CLI::error( 'The rysing-divi-child theme is not active; the page would render unstyled.' );
}

const RYSING_ROLE = 'home';
const RYSING_META = '_rysing_page_role';

/* Media resolves through the Media Library, never the child theme.
   rysing_asset_url() hard fails on a missing attachment, so re-running this
   generator cannot reintroduce a /wp-content/themes/ image URL. */
require_once __DIR__ . '/lib/assets.php';


/* Block construction helpers, shared with create-theme-builder.php so the
 * block format lives in exactly one place. */
require_once __DIR__ . '/lib/blocks.php';


/* ==================================================================
 * The page. Fifteen sections, in the client's frozen order.
 * ================================================================== */

$sections = array();


/* --- 1. Hero ---------------------------------------------------- */

/* .hero is a flex column: the eyebrow pushes itself up with margin-bottom:auto
   and the headline settles at the bottom. All three children must be real
   children of the section, which is what rysing-passthrough delivers. */
$sections[] = r_section(
	array(
		r_plain(
			array(
				r_code( '<span class="hero-light" aria-hidden="true"></span>', 'Hero Backdrop Light' ),
				r_text(
					'<p class="hero-eyebrow label">Branding &amp; visibility studio for courageous brands</p>',
					'Hero Eyebrow'
				),
				r_text(
					'<h1 class="hero-title display">
						<span class="alt">Rise into</span> visibility, authority <span class="keep"><span class="alt">and</span> <em>impact</em></span>
						<span class="tail">with a clear strategy, differentiated brand and thought leadership content</span>
					</h1>',
					'Hero Heading'
				),
			),
			'Hero'
		),
	),
	'hero',
	'Hero'
);


/* --- 2. Showreel ------------------------------------------------ */

/* One module. The reel is a <video> with a custom transport button whose
   aria-pressed state and aperture mask are both driven from main.js; there is
   no client-editable prose in it, and no native module expresses it. */
$sections[] = r_section(
	array(
		r_plain(
			array(
				r_code(
					'<div class="reel-stage">
						<div class="reel-frame">
							<video class="reel-video" autoplay muted loop playsinline preload="metadata" poster="' . rysing_asset_url( 'reel-03.jpg' ) . '" aria-label="Rysing showreel">
								<source src="' . rysing_asset_url( 'rysing-showreel-web.mp4' ) . '" type="video/mp4" />
							</video>
						</div>
						<div class="reel-bar">
							<span class="label">rysing showreel</span>
							<button class="reel-toggle" type="button" aria-label="Pause showreel" aria-pressed="false">
								<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3h4v14H4zm8 0h4v14h-4z" /></svg>
							</button>
						</div>
					</div>',
					'Showreel Player'
				),
			),
			'Showreel'
		),
	),
	'reel',
	'Showreel',
	array(
		'id'         => 'reel',
		'aria-label' => 'Showreel',
	)
);


/* --- 3. Stats --------------------------------------------------- */

/* .stats-grid is grid-template-columns:repeat(4,1fr) over four .stat children,
   so the ROW carries the class and stays a real box; the column dissolves and
   the four modules become its grid children. Each figure is its own module so
   the client can edit one without touching the others. */
$stats = array(
	array( '35+', 'personal brands built' ),
	array( '350+', 'students taught' ),
	array( '3000+', 'content pieces published' ),
	array( '50k+', 'followers and subscribers over all platforms' ),
);

$stat_modules = array();
foreach ( $stats as $i => $stat ) {
	$stat_modules[] = r_code(
		'<div class="stat"><strong>' . $stat[0] . '</strong><span>' . $stat[1] . '</span></div>',
		'Stat ' . ( $i + 1 ) . ' — ' . $stat[0]
	);
}

$sections[] = r_section(
	array(
		r_plain( array( r_code( '<span class="stats-light" aria-hidden="true"><span></span><span></span></span>', 'Stats Light' ) ), 'Stats Light' ),
		r_grid(
			$stat_modules,
			'stats-grid',
			'Stats Grid',
			array(
				'data-reveal'  => '',
				'data-stagger' => '',
			)
		),
	),
	'stats',
	'Stats',
	array( 'aria-label' => 'Studio results' )
);


/* --- 4. The four levels (services accordion) -------------------- */

/* One module per stage. main.js drives the open/closed state off .system-item
   and aria-expanded, and the first stage ships open — with every row shut the
   section is four numerals and a column of air, and nothing signals that the
   rows open at all. */
$stages = array(
	array(
		'num'     => '01',
		'name'    => 'Brand Building',
		'for'     => 'For those who want to become the only choice in their industry',
		'outcome' => 'Be understood, and remembered.',
		'tags'    => array( 'Brand strategy', 'Category position', 'Message architecture', 'Offer narrative' ),
		'open'    => true,
	),
	array(
		'num'     => '02',
		'name'    => 'Design &amp; Websites',
		'for'     => 'For those who want a differentiated and scalable brand presence',
		'outcome' => 'Become unmistakably you.',
		'tags'    => array( 'Brand design', 'Website design', 'Website development', 'SEO &amp; GEO', 'Videography' ),
		'open'    => false,
	),
	array(
		'num'     => '03',
		'name'    => 'LinkedIn &amp; Instagram Marketing',
		'for'     => 'For those who want to grow their influence on social media',
		'outcome' => 'Be seen in the right places.',
		'tags'    => array( 'Content strategy', 'Content automations', 'Content creation', 'Social media management', 'Content shooting', 'Content editing', 'Reels and shorts', 'Performance analysis' ),
		'open'    => false,
	),
	array(
		'num'     => '04',
		'name'    => 'Thought Leadership',
		'for'     => 'For those ready to make a big, lasting impact.',
		'outcome' => 'Be chosen for what comes next.',
		'tags'    => array( 'Podcast', 'Videocast', 'YouTube channel', 'Long form content', 'Production', 'Post-production', 'Keynote writing' ),
		'open'    => false,
	),
);

$stage_modules = array();
foreach ( $stages as $stage ) {
	$tags = '';
	foreach ( $stage['tags'] as $tag ) {
		$tags .= '<li>' . $tag . '</li>';
	}

	$id       = 'svc-' . $stage['num'];
	$is_open  = $stage['open'];
	$expanded = $is_open ? 'true' : 'false';

	$stage_modules[] = r_code(
		'<div class="system-item' . ( $is_open ? ' is-open' : '' ) . '">
			<b class="system-num">' . $stage['num'] . '</b>
			<div class="system-body">
				<button class="system-toggle" type="button" aria-expanded="' . $expanded . '" aria-controls="' . $id . '">
					<h3 class="system-name">' . $stage['name'] . '</h3>
					<span class="system-symbol" aria-hidden="true"></span>
				</button>
				<div class="system-panel" id="' . $id . '" role="region">
					<div><div class="system-detail">
						<p class="system-for">' . $stage['for'] . '</p>
						<div class="system-outcome"><span>Stage outcome</span><p>' . $stage['outcome'] . '</p></div>
						<ul class="system-tags">' . $tags . '</ul>
					</div></div>
				</div>
			</div>
		</div>',
		'Stage ' . $stage['num'] . ' — ' . html_entity_decode( $stage['name'], ENT_QUOTES, 'UTF-8' )
	);
}

$sections[] = r_section(
	array(
		r_grid(
			array(
				r_text( '<h2 class="system-title display" id="system-title"><span class="alt">We can grow your brand on</span> four levels</h2>', 'Section Heading' ),
				r_text( '<p class="system-meta">Programs<span class="sep" aria-hidden="true"></span>We are based in Vienna, Austria and we operate across Europe.</p>', 'Section Meta' ),
			),
			'system-head',
			'Section Head',
			array( 'data-reveal' => '' )
		),
		r_grid( $stage_modules, 'system-list', 'Stage List' ),
	),
	'system',
	'Four Levels',
	array(
		'id'              => 'system',
		'aria-labelledby' => 'system-title',
	)
);


/* --- 5. Selected work ------------------------------------------- */

/* Work panels are raw markup inside ONE Code module per row, not Image modules
   and not one module per panel.
 *
 * Image module is out because each <img> carries an inline --pos custom property
 * for its focal point, one panel carries a <video> instead of an image, and the
 * whole panel is a single <a>. An Image module expresses none of the three.
 *
 * One module per PANEL is out for a subtler reason, and it had to be measured:
 * base.css positions this gallery with child combinators —
 * `.work-row--a > :nth-child(1) { margin-top: clamp(28px,4vw,76px) }` and
 * `.work-row--b > :nth-child(2) .shot { aspect-ratio: 4/5 }`, fifteen rules in
 * all. They are what make three rows of three read as a hand-set gallery rather
 * than a repeated template.
 *
 * A child combinator needs a real DOM parent. With one module per panel the
 * panels' DOM parent is a Divi module wrapper, not .work-row — display:contents
 * dissolves a box for LAYOUT but does not change the DOM tree, so `>` stops
 * matching and every offset and aspect-ratio override silently disappears. The
 * grid still rendered three across; the three panels just sat flush in a line.
 *
 * Emitting the container div inside one module restores the source's exact box
 * tree, so all fifteen rules match again with no adapter CSS at all. */
function r_work_item( $inner, $href ) {
	$open = $href ? '<a class="work-item" href="' . $href . '">' : '<a class="work-item">';

	return $open . $inner . '</a>';
}

/** The markup for one work row: its container div and three panels. */
function r_work_row( $items, $variant ) {
	return '<div class="work-row work-row--' . $variant . '" data-stagger>' . implode( '', $items ) . '</div>';
}

/**
 * One Code module holding ALL the rows of a gallery, as siblings.
 *
 * Both rows go in a single module because base.css ends the gallery with
 * `.work-row:last-of-type { margin-bottom: 0 }`. One module per row would make
 * each row the only .work-row in its own wrapper, so BOTH would match
 * :last-of-type and both would lose their margin.
 *
 * Measured: the Selected Work section came out 79px short at 1440 — exactly the
 * `clamp(40px, 5.5vw, 96px)` gap that belongs between the two rows. Every panel
 * inside measured correct to the pixel, so the loss looked like section padding
 * rather than a structural selector that had stopped matching.
 *
 * Same root cause as the `>` combinators in r_work_item(): a positional
 * selector needs the source's real sibling order, and display:contents does not
 * provide it.
 */
function r_work_gallery( $rows, $label ) {
	return r_code( implode( '', $rows ), $label );
}

$work_a = array(
	/* TODO(link): case study page does not exist yet */
	r_work_item(
		'<span class="shot"><img style="--pos:center center" src="' . rysing_asset_url( 'work-01-opsdetox.webp' ) . '" alt="OPS Detox tote bag, branded merchandise" loading="lazy" decoding="async" /></span>
		<span class="shot-title">OPS Detox — Operational detox for startups</span>
		<span class="shot-meta label">01<span class="sep" aria-hidden="true"></span>From strategy to social media</span>
		<span class="shot-more">Learn more →</span>',
		'',
	),
	/* 7.8s, silent, 224KB. Recompressed from a 15.8MB master. */
	/* TODO(link): case study page does not exist yet */
	/* Raw markup like its siblings — r_work_item() only prepends the opening
	   <a>, and this panel's anchor carries an extra class. */
	'<a class="work-item work-item--film">
			<span class="shot">
				<video class="work-video" muted loop playsinline preload="metadata" poster="' . rysing_asset_url( 'work-02-finer-things-poster.webp' ) . '" aria-label="Luxury design studio for the finest hotels in the world">
					<source src="' . rysing_asset_url( 'work-02-finer-things.mp4' ) . '" type="video/mp4" />
				</video>
			</span>
			<span class="shot-title">Luxury design studio for the finest hotels in the world</span>
			<span class="shot-meta label">02<span class="sep" aria-hidden="true"></span>Communication and website</span>
			<span class="shot-more">Learn more →</span>
		</a>',
	/* TODO(link): temporary client-site destination */
	r_work_item(
		'<span class="shot"><img style="--pos:center 40%" src="' . rysing_asset_url( 'work-03-clemens.webp' ) . '" alt="Clemens Doppler speaking on stage" loading="lazy" decoding="async" /></span>
		<span class="shot-title">Keynote Speaker and Business Coach</span>
		<span class="shot-meta label">03<span class="sep" aria-hidden="true"></span>From strategy to social media</span>
		<span class="shot-more">Learn more →</span>',
		'https://clemensdoppler.com/',
	),
);

$work_b = array(
	/* TODO(link): temporary client-site destination */
	r_work_item(
		'<span class="shot"><img style="--pos:center 30%" src="' . rysing_asset_url( 'project-05-djongow.webp' ) . '" alt="Jennifer Djongow speaking on stage" loading="lazy" decoding="async" /></span>
		<span class="shot-title">Wealth Manager and Keynote Speaker</span>
		<span class="shot-meta label">04<span class="sep" aria-hidden="true"></span>From strategy to social media</span>
		<span class="shot-more">Learn more →</span>',
		'https://jenniferdjongow.com/',
	),
	/* TODO(link): temporary client-site destination */
	r_work_item(
		'<span class="shot"><img style="--pos:center 50%" src="' . rysing_asset_url( 'project-04-futurfai.webp' ) . '" alt="FuturfAI brand identity on a display" loading="lazy" decoding="async" /></span>
		<span class="shot-title">AI and Law Consultancy</span>
		<span class="shot-meta label">05<span class="sep" aria-hidden="true"></span>Positioning and website</span>
		<span class="shot-more">Learn more →</span>',
		'https://futurfai.com/',
	),
	/* TODO(asset): source is only 640x434. See note in ASSET-SPEC.md. */
	/* TODO(link): temporary client-site destination */
	r_work_item(
		'<span class="shot"><img style="--pos:center 30%" src="' . rysing_asset_url( 'work-06-knowle-victory.webp' ) . '" alt="Julian Knowle lifting the US Open doubles trophy" loading="lazy" decoding="async" /></span>
		<span class="shot-title">Keynote Speaker and Elite Tennis Coach</span>
		<span class="shot-meta label">06<span class="sep" aria-hidden="true"></span>From strategy to social media</span>
		<span class="shot-more">Learn more →</span>',
		'https://julianknowle.com/',
	),
);

$sections[] = r_section(
	array(
		r_grid(
			array(
				r_text( '<h2 class="display" id="work-title"><span class="alt">Selected</span> work</h2>', 'Section Heading' ),
				r_button( 'Learn more', '#work', 'Section CTA' ),
			),
			'band-head',
			'Section Head',
			array( 'data-reveal' => '' )
		),
		r_plain(
			array(
				r_work_gallery(
					array( r_work_row( $work_a, 'a' ), r_work_row( $work_b, 'b' ) ),
					'Work Gallery — Panels 01-06'
				),
			),
			'Work Gallery'
		),
	),
	'band',
	'Selected Work',
	array(
		'id'              => 'work',
		'aria-labelledby' => 'work-title',
	)
);


/* --- 6. Who we work with (manifesto) ---------------------------- */

$sections[] = r_section(
	array(
		r_plain(
			array(
				r_text( '<p class="eyebrow label">Who we work with</p>', 'Eyebrow', '', array( 'data-reveal' => '' ) ),
				r_text(
					'<h2 class="display" id="approach-title">
						<span class="alt">For</span> courageous brands <span class="alt">and ambitious founders who want to build a</span>
						<span class="ring">legacy<svg viewBox="0 0 400 130" preserveAspectRatio="none" aria-hidden="true"><path d="M24 74 C 18 28, 190 8, 330 20 C 430 30, 410 104, 300 116 C 190 128, 30 118, 14 78 C 6 52, 110 22, 250 16" stroke="#F04222" stroke-width="2.2" fill="none" stroke-linecap="round" /></svg></span>
						<span class="alt">and create a lasting</span> impact
					</h2>',
					'Manifesto Heading',
					'',
					array( 'data-reveal' => '' )
				),
				r_button( 'Apply to work with us', '#contact', 'Manifesto CTA' ),
			),
			'Manifesto'
		),
	),
	'band manifesto',
	'Who We Work With',
	array(
		'id'              => 'approach',
		'aria-labelledby' => 'approach-title',
	)
);


/* --- 7. Spotlight (for keynote speakers) ------------------------ */

/* .spot is a grid of the photograph against .spot-copy, so the row carries
   .spot and the copy becomes a real column (.rysing-box) holding its own
   modules — which is what lets the CTA stay a native Button module inside it. */
$sections[] = r_section(
	array(
		r_row(
			array(
				r_column(
					r_image( rysing_asset_url( 'Gerd-Hero-Section-image.webp' ), 'Speaker on stage, mid-gesture, wearing a headset microphone', 'Spotlight Photograph' ),
					'Photograph Column'
				),
				r_column(
					r_text( '<p class="label">For keynote speakers</p>', 'Spotlight Eyebrow' ) .
					r_text( '<h2 class="display" id="spotlight-title"><span class="alt">We bring company founders into the</span> <mark>spotlight</mark></h2>', 'Spotlight Heading' ) .
					r_text( '<p>Build your speaker brand and rise into thought leadership.</p>', 'Spotlight Lead' ) .
					/* TODO(link): not the keynote landing page the section arguably
					   wants — one client's case study stands in for a service. */
					r_button( 'Learn more', '/case-gerd-bommer/', 'Spotlight CTA' ),
					'Copy Column',
					'spot-copy',
					true
				),
			),
			'Spotlight',
			'spot',
			true,
			array( 'data-reveal' => '' )
		),
	),
	'band',
	'Spotlight — Keynote Speakers',
	array(
		'id'              => 'spotlight',
		'aria-labelledby' => 'spotlight-title',
	)
);


/* --- 8. Behind the work (team) ---------------------------------- */

/* The rail stays ONE module. Its structure is .team-rail > .team-view >
   .team-track > figures with .treel-foot as a sibling of .team-view — four
   levels with a control bar hanging off the middle one. Divi's row/column tree
   is two levels and cannot express that, and each figure's --drop offset is an
   inline custom property bound to the person (not to nth-child, because the
   rail loops by cloning and an nth-child pattern inverts at the seam).
   Splitting it would trade a working rail for nominal editability. */
$sections[] = r_section(
	array(
		r_grid(
			array(
				r_text( '<h2 class="display" id="team-title"><span class="alt">Behind the</span> work.</h2>', 'Section Heading' ),
				r_text( '<p class="band-note">Brand strategy, design, web and content come together in one close team. No account managers or handoffs to people you\'ve never met. You speak directly with the people doing the work.</p>', 'Section Note' ),
			),
			'band-head',
			'Section Head',
			array( 'data-reveal' => '' )
		),
		r_grid(
			array(
				r_code(
					'<figure class="team-lead">
						<span class="team-lead-shot"><img src="' . rysing_asset_url( 'anzhelika-red-suit.webp' ) . '" alt="Anzhelika, founder of Rysing" loading="lazy" decoding="async" /></span>
						<figcaption><h3>Anzhelika</h3><p>Founder · The mind behind it all</p></figcaption>
					</figure>',
					'Founder Card — Anzhelika'
				),
				r_code(
						'<div class="team-rail" data-treel>
							<div class="team-view" data-treel-view>
								<div class="team-track" data-treel-track>
									<figure class="team-item" style="--drop:0px">
										<span class="shot"><img style="--pos:center 18%" src="' . rysing_asset_url( 'kristina-verbitskaia.webp' ) . '" alt="Portrait of Kristina Verbitskaia" loading="lazy" decoding="async" /></span>
										<figcaption><h3>Kristina</h3><p>Photographer, videographer and content creator</p></figcaption>
									</figure>
									<figure class="team-item" style="--drop:46px">
										<span class="shot"><img style="--pos:center 16%" src="' . rysing_asset_url( 'marc-babin.webp' ) . '" alt="Portrait of Marc Babin" loading="lazy" decoding="async" /></span>
										<figcaption><h3>Marc</h3><p>Partner and producer</p></figcaption>
									</figure>
									<figure class="team-item" style="--drop:14px">
										<span class="shot"><img style="--pos:center 32%" src="' . rysing_asset_url( 'kim-brand-designer.webp' ) . '" alt="Portrait of Kim" loading="lazy" decoding="async" /></span>
										<figcaption><h3>Kim</h3><p>Brand identity, design systems, and everything you see</p></figcaption>
									</figure>
									<figure class="team-item" style="--drop:62px">
										<span class="shot"><img style="--pos:center 28%" src="' . rysing_asset_url( 'abdessamad-pic.webp' ) . '" alt="Portrait of Ben" loading="lazy" decoding="async" /></span>
										<figcaption><h3>Ben</h3><p>Web development, SEO, and everything web-side</p></figcaption>
									</figure>
								</div>
							</div>
							<div class="treel-foot">
								<button class="treel-step" type="button" data-treel-step="-1" aria-label="Previous team members"></button>
								<button class="treel-step" type="button" data-treel-step="1" aria-label="Next team members"></button>
							</div>
						</div>',
						'Team Rail — 4 Members'
				),
			),
			'team',
			'Team',
			array( 'data-stagger' => '' )
		),
	),
	'band',
	'Behind The Work',
	array(
		'id'              => 'team',
		'aria-labelledby' => 'team-title',
	)
);


/* --- 9. Founder --------------------------------------------------- */

/* .duo is a two-column grid. The first child is a plain <div> in the source,
   so its column needs .rysing-box with no class to stay a real box. */
$sections[] = r_section(
	array(
		r_row(
			array(
				r_column(
					r_text( '<h2 class="founder-title display" id="founder-title"><span class="alt">The studio exists to give</span> voices <span class="alt">to people who want to make a</span> real impact.</h2>', 'Founder Heading' ),
					'Heading Column',
					'',
					true
				),
				r_column(
					r_text( '<p>A courageous brand refuses to conform. It belongs to someone who would rather be disliked than ignored. Who says the thing their industry is not ready to hear, and says it anyway. Who left the safe path, took the unpopular position, built what nobody asked for and who is building something meant to outlast them.</p>', 'Founder Paragraph 1' ) .
					r_text( '<p>Most people carry a version of this inside them and never let it out, because they are afraid of repelling somebody. Courage is staying true to what you believe while you are still scared.</p>', 'Founder Paragraph 2' ) .
					r_text( '<p>Led by Anzhelika and delivered by an interdisciplinary team, Rysing Studio translates a founder\'s courage and ambition into a differentiated, visible brand.</p>', 'Founder Paragraph 3' ) .
					/* TODO(link): About page destination pending */
					r_button( 'Learn more', '#', 'Founder CTA' ),
					'Body Column',
					'founder-body',
					true
				),
			),
			'Founder Duo',
			'duo',
			true,
			array( 'data-reveal' => '' )
		),
	),
	'band',
	'Founder',
	array(
		'id'              => 'founder',
		'aria-labelledby' => 'founder-title',
	)
);


/* --- 10. Recognition (logo marquee) ----------------------------- */

/* Two identical tracks: main.js loops the marquee by translating a duplicate,
   the way the testimonial rail clones its items. The second track is
   aria-hidden with empty alt text so the logos are announced once.
   Each --f is that mark's optical scale, measured per logo. */
$logos = array(
	array( 'logo-clemensdoppler.webp', 'Clemens Doppler', '0.2', false ),
	array( 'logo-gerdbommer.webp', 'Gerd Bommer', '0.25', false ),
	array( 'logo-jenniferdjongow.webp', 'Jennifer Djongow', '0.317', false ),
	array( 'logo-julianknowle.webp', 'Julian Knowle', '0.283', false ),
	array( 'logo-futurfai.webp', 'FuturfAI', '0.217', false ),
	array( 'logo-u4success.webp', 'U4Success', '0.475', false ),
	array( 'logo-wise-up.webp', 'Wise Up', '0.25', false ),
	array( 'logo-digitalworld.webp', 'Digital World', '0.45', true ),
	array( 'logo-digitfinance.webp', 'Digit Finance', '0.158', false ),
	array( 'logo-volkshilfe.webp', 'Volkshilfe', '0.167', false ),
	array( 'logo-mam.webp', 'MAM', '0.8', true ),
	array( 'logo-dsp.webp', 'Der Schulter Physio', '0.233', false ),
	array( 'logo-rb.webp', 'RB Real Beauty', '0.533', false ),
);

$build_track = static function ( $logos, $live ) {
	$out = '';
	foreach ( $logos as $logo ) {
		list( $file, $name, $scale, $is_light ) = $logo;

		$out .= '<figure><img' . ( $is_light ? ' data-light' : '' ) .
			' style="--f:' . $scale . '" src="' . rysing_asset_url( $file ) .
			'" alt="' . ( $live ? $name : '' ) . '" loading="lazy" decoding="async" /></figure>' .
			'<i aria-hidden="true"></i>';
	}

	return $out;
};

$sections[] = r_section(
	array(
		r_plain(
			array(
				r_text( '<p class="eyebrow label" id="recognition-title">Trusted by founders, speakers and teams across Europe</p>', 'Recognition Eyebrow' ),
				r_code(
					'<div class="marquee" aria-label="Client logos" data-reveal>
						<div class="marquee-track">' . $build_track( $logos, true ) . '</div>
						<div class="marquee-track" aria-hidden="true">' . $build_track( $logos, false ) . '</div>
					</div>',
					'Client Logo Marquee'
				),
			),
			'Recognition'
		),
	),
	'band',
	'Recognition',
	array(
		'id'              => 'recognition',
		'aria-labelledby' => 'recognition-title',
	)
);


/* --- 11. Testimonials ------------------------------------------- */

/* TODO(copy): testimonials, review totals and award claims require final
   approval. PLACEHOLDER: all six squares share one stand-in portrait so the
   bloom can be judged before the real photographs exist — they are not six
   different people yet. Each is replaced on its own.
   One module, for the same nesting reason as the team rail. */
$quotes = array(
	array( '“Within three months my LinkedIn went from invisible to inbound. They rebuilt my positioning and the leads followed.”', 'Marcus H.', 'Founder, B2B SaaS' ),
	array( '“They turned my scattered ideas into a clear brand and a keynote I\'m genuinely proud to walk on stage with.”', 'Elena V.', 'Keynote speaker' ),
	array( '“The content system they built runs without me. My audience grew while I stayed focused on the business.”', 'Tobias R.', 'Agency owner' ),
	array( '“Finally a brand that actually sounds like me, and converts. Best investment I\'ve made this year.”', 'Sophie L.', 'Consultant' ),
	array( '“From messy to magnetic. Our website and identity finally match the level of the work we do.”', 'Daniel K.', 'Co-founder, DTC brand' ),
	array( '“Professional, fast and genuinely strategic. The five stars are not an exaggeration.”', 'Nadia S.', 'Executive coach' ),
);

$quote_html = '';
foreach ( $quotes as $quote ) {
	$quote_html .= '<figure class="tquote treel-item">
		<blockquote>' . $quote[0] . '</blockquote>
		<figcaption class="tattrib">
			<span class="tthumb"><img src="' . rysing_asset_url( 'anzhelika-chair.webp' ) . '" alt="" loading="lazy" decoding="async" /></span>
			<span class="stars" aria-hidden="true">★★★★★</span>
			<strong>' . $quote[1] . '</strong>
			<small>' . $quote[2] . '</small>
		</figcaption>
	</figure>';
}

$sections[] = r_section(
	array(
		r_plain(
			array(
				r_text( '<h2 class="display proof-title" id="proof-title"><span class="alt">In their</span> words</h2>', 'Section Heading', '', array( 'data-reveal' => '' ) ),
				r_code(
					'<div class="treel-wrap" data-treel data-reveal>
						<div class="treel" data-treel-view>
							<div class="treel-track" data-treel-track>' . $quote_html . '</div>
						</div>
						<div class="treel-foot">
							<button class="treel-step" type="button" data-treel-step="-1" aria-label="Previous testimonials"></button>
							<button class="treel-step" type="button" data-treel-step="1" aria-label="Next testimonials"></button>
						</div>
					</div>',
					'Testimonial Rail — 6 Quotes'
				),
				/* TODO(copy): review total requires final verification */
				r_code( '<div class="proof-foot"><a class="btn-pill" href="#proof">Read all 49 reviews <span class="arrow" aria-hidden="true"></span></a></div>', 'Reviews CTA' ),
			),
			'Testimonials'
		),
	),
	'band',
	'Testimonials',
	array(
		'id'              => 'proof',
		'aria-labelledby' => 'proof-title',
	)
);


/* --- 12. Belong ------------------------------------------------- */

$sections[] = r_section(
	array(
		r_plain(
			array(
				r_code( '<div class="belong-glow" aria-hidden="true"></div>', 'Belong Glow' ),
				r_code( '<span class="belong-mark" aria-hidden="true"></span>', 'Belong Mark', '', array( 'data-reveal' => '' ) ),
				r_text(
					'<h2 class="display" id="belong-title">
						<span class="alt">If you feel like you and your brand are meant for</span> something bigger,
						<span class="alt">Rysing is the place that</span> gets you.
					</h2>',
					'Belong Heading',
					'',
					array( 'data-reveal' => '' )
				),
			),
			'Belong'
		),
	),
	'belong',
	'Belong',
	array(
		'id'              => 'belong',
		'aria-labelledby' => 'belong-title',
	)
);


/* --- 13. Keynote speaker case studies --------------------------- */

/* Selected Work's rows end at 06 and this row carries the last three. It
   stands without a head: the eyebrow, headline, lead and pill that used to sit
   above it went back onto the photograph in the spotlight section. */
$work_c = array(
	r_work_item(
		'<span class="shot"><img style="--pos:center 32%" src="' . rysing_asset_url( 'Gerd-Hero-Section-image.webp' ) . '" alt="Gerd Bommer speaking on stage, wearing a headset microphone" loading="lazy" decoding="async" /></span>
		<span class="shot-title"><b class="name">Gerd Bommer</b> Keynote Speaker and Founder-First Investor</span>
		<span class="shot-more is-standing">Learn more →</span>',
		'/case-gerd-bommer/',
	),
	/* TODO(link): case study page does not exist yet */
	r_work_item(
		'<span class="shot"><img style="--pos:center 40%" src="' . rysing_asset_url( 'work-08-u4success.webp' ) . '" alt="U4Success branded shirt" loading="lazy" decoding="async" /></span>
		<span class="shot-title"><b class="name">U4Success</b> Tutoring Academy</span>
		<span class="shot-more is-standing">Learn more →</span>',
		'',
	),
	/* TODO(link): case study page does not exist yet */
	r_work_item(
		'<span class="shot"><img style="--pos:center center" src="' . rysing_asset_url( 'work-09-digitfinance.webp' ) . '" alt="Digit Finance brand application" loading="lazy" decoding="async" /></span>
		<span class="shot-title"><b class="name">Finance</b> Consultancy</span>
		<span class="shot-more is-standing">Learn more →</span>',
		'',
	),
);

$sections[] = r_section(
	array(
		r_plain(
			array( r_work_gallery( array( r_work_row( $work_c, 'c' ) ), 'Case Studies 07-09' ) ),
			'Case Study Row'
		),
	),
	'band',
	'Keynote Case Studies',
	array( 'aria-label' => 'Keynote speaker case studies' )
);


/* --- 14. Sunday Fudge (newsletter) ------------------------------ */

/* The glow is a sibling of .fudge-copy inside the section, so it lives in its
   own passthrough column while .fudge-copy is a real one. */
$sections[] = r_section(
	array(
		r_row(
			array(
				r_column( r_code( '<div class="fudge-glow" aria-hidden="true"></div>', 'Fudge Glow' ), 'Glow Column' ),
				r_column(
					r_text( '<p class="label">Newsletter — Sunday Fudge</p>', 'Newsletter Eyebrow', '', array( 'data-reveal' => '' ) ) .
					/* The hyphen is a legal break point; holding the compound
					   together stops the line ending on a stranded "mini-". */
					r_text( '<h2 class="display" id="fudge-title"><span class="alt">Get free access to my</span> business and marketing <span class="alt" style="white-space:nowrap">mini-courses</span></h2>', 'Newsletter Heading', '', array( 'data-reveal' => '' ) ) .
					/* TODO(copy): audience figure requires final verification */
					r_text( '<p>Join 2,000 founders and experts reading Sunday Fudge and learn how to acquire clients, build your online business and grow your following on LinkedIn and Instagram.</p>', 'Newsletter Lead', '', array( 'data-reveal' => '' ) ) .
					r_code( '<ul class="fudge-points"><li>Sharp perspective</li><li>Useful prompts</li><li>Sunday delivery</li></ul>', 'Newsletter Points', '', array( 'data-reveal' => '' ) ) .
					r_code(
						'<form id="fudge-form">
							<div class="fudge-field">
								<label class="vh" for="fudge-email">Email</label>
								<input id="fudge-email" name="email" type="email" autocomplete="email" placeholder="Your email" required aria-describedby="fudge-status" />
								<button type="submit">Subscribe to Sunday Fudge <span aria-hidden="true">→</span></button>
							</div>
							<p class="fudge-note" id="fudge-status" role="status" aria-live="polite">No spam. Unsubscribe anytime.</p>
						</form>',
						'Newsletter Form',
						'',
						array( 'data-reveal' => '' )
					),
					'Copy Column',
					'fudge-copy',
					true
				),
			),
			'Sunday Fudge',
			'',
			false
		),
	),
	'band fudge',
	'Sunday Fudge Newsletter',
	array(
		'id'              => 'sunday-fudge',
		'aria-labelledby' => 'fudge-title',
	)
);


/* --- 15. Closing ------------------------------------------------ */

/* "Ready to build a legacy?" answers the manifesto's "build a legacy" at the
   other end of the page. */
$sections[] = r_section(
	array(
		r_plain(
			array(
				r_code( '<div class="closing-glow" aria-hidden="true"></div>', 'Closing Glow' ),
				r_text( '<h2 class="display" id="contact-title"><span class="alt">Ready to build a</span> legacy?</h2>', 'Closing Heading', '', array( 'data-reveal' => '' ) ),
				r_button( 'Apply to work with us', 'mailto:hello@rysing.agency', 'Closing CTA', 'btn-pill', array( 'data-reveal' => '' ) ),
			),
			'Closing'
		),
	),
	'band closing',
	'Closing CTA',
	array(
		'id'              => 'contact',
		'aria-labelledby' => 'contact-title',
	)
);


/* ==================================================================
 * Save
 * ================================================================== */

$content = implode( '', $sections );

/* Find by meta, not by title or slug: the client may rename either. */
$existing = get_posts(
	array(
		'post_type'        => 'page',
		'post_status'      => 'any',
		'numberposts'      => 1,
		'fields'           => 'ids',
		'meta_key'         => RYSING_META,
		'meta_value'       => RYSING_ROLE,
		'suppress_filters' => false,
	)
);

$page_id = $existing ? (int) $existing[0] : 0;

/* post_title is ALWAYS passed. wp_insert_post() fills omitted keys from its own
   defaults, which are empty strings — passing it only on create means every
   update silently empties the title. The existing value is carried forward
   rather than hardcoded, so a rename in wp-admin survives a re-run. */
$title = $page_id ? get_post_field( 'post_title', $page_id ) : '';
$title = $title ? $title : 'Home';

$postarr = array(
	'post_type'    => 'page',
	'post_status'  => 'publish',
	'post_title'   => $title,
	/* Without wp_slash() WordPress strips the JSON escaping inside the block
	   comments. The block wrappers survive, so the page still renders — but
	   with empty classes and empty Text module content. */
	'post_content' => wp_slash( $content ),
);

if ( $page_id ) {
	$postarr['ID'] = $page_id;
	$result        = wp_update_post( $postarr, true );
} else {
	$postarr['post_name'] = 'home';
	$result               = wp_insert_post( $postarr, true );
}

if ( is_wp_error( $result ) ) {
	WP_CLI::error( $result->get_error_message() );
}

$page_id = (int) $result;

update_post_meta( $page_id, RYSING_META, RYSING_ROLE );
update_post_meta( $page_id, '_et_pb_use_builder', 'on' );
update_post_meta( $page_id, '_et_pb_page_layout', 'et_full_width_page' );

/* NOT page-template-blank.php, even though that is the obvious choice for a
 * page that supplies all its own chrome.
 *
 * Divi's own functions.php registers
 * et_divi_disable_theme_builder_header_footer_on_blank_template() on the
 * et_theme_builder_template_layouts filter. On the blank template it forcibly
 * sets the header and footer layout ids to 0 and their override flags to
 * false — so the blank template and Theme Builder chrome are mutually
 * exclusive by design.
 *
 * The symptom is brutal to diagnose: the template resolves, the layout posts
 * are published and correct, every piece of meta reads back exactly right, and
 * the .et-l--header / .et-l--footer wrappers simply never appear in the DOM.
 * Nothing points at the page template.
 *
 * The default template is correct here: Divi's page.php calls get_header() and
 * get_footer(), which is where Theme Builder hooks in, and _et_pb_page_layout
 * above already suppresses the sidebar and content width. */
update_post_meta( $page_id, '_wp_page_template', 'default' );
update_post_meta( $page_id, '_et_pb_show_title', 'off' );

/* Verify the block comments actually survived the insert. Reading the stored
   value back is the only check that catches KSES encoding — the generator's own
   output always looks correct. */
$stored = get_post_field( 'post_content', $page_id );
$blocks = substr_count( $stored, '<!-- wp:divi/' );

if ( substr_count( $stored, '&lt;!-- wp:divi/' ) > 0 ) {
	WP_CLI::error( 'Block comments were entity-encoded by KSES. The page would render blank.' );
}

if ( $blocks < 1 ) {
	WP_CLI::error( 'No Divi block comments found in the stored content.' );
}

WP_CLI::success(
	sprintf(
		'%s page %d ("%s"): %d sections, %d block comments, %s stored.',
		$existing ? 'Updated' : 'Created',
		$page_id,
		$title,
		count( $sections ),
		$blocks,
		size_format( strlen( $stored ) )
	)
);
WP_CLI::log( 'URL: ' . get_permalink( $page_id ) );

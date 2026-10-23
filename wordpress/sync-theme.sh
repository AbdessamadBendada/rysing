#!/bin/sh
# Package the Rysing Divi child theme into the Local site.
#
# The skill's rule is "edit the Git source, then copy to the live theme" — never
# edit the live theme directly. This script is that copy step, and it is the only
# supported way the live theme gets updated.
#
# base.css, main.js and the asset folder are NOT stored in Git under the theme.
# They are derived here from the single source of truth at the repository root
# (shared.css, shared.js, rysing-assets/), which is already tracked. Duplicating
# them would be 23MB of second copies that drift the first time someone edits the
# wrong one — and it would break the diff that tells us what Divi actually cost:
# base.css stays byte-identical to shared.css except for one path rewrite.
#
# Usage: wordpress/sync-theme.sh

set -eu

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO/wordpress/rysing-divi-child"
DEST="/Users/mac/Local Sites/rysing/app/public/wp-content/themes/rysing-divi-child"

[ -d "$REPO/rysing-assets" ] || { echo "missing $REPO/rysing-assets" >&2; exit 1; }
[ -f "$REPO/shared.css" ]    || { echo "missing $REPO/shared.css" >&2; exit 1; }

mkdir -p "$DEST/assets/css" "$DEST/assets/js" "$DEST/assets/rysing-assets"

# Hand-authored sources: the theme header, the enqueues, and the adapter CSS.
cp "$SRC/style.css"     "$DEST/style.css"
cp "$SRC/functions.php" "$DEST/functions.php"
cp "$SRC/assets/css/divi.css"      "$DEST/assets/css/divi.css"
cp "$SRC/assets/css/divi-home.css" "$DEST/assets/css/divi-home.css"

# Derived: the design system, verbatim but for the asset path.
#
# shared.css resolves url("rysing-assets/…") relative to ITSELF, and at the
# repository root that is a sibling folder. Under the theme the stylesheet sits
# one level deeper, at assets/css/, so the same seven references (five woff2
# faces and two pattern images) need one hop up. Nothing else is touched — if
# this sed ever matches more than seven lines, the source moved and the diff
# below will say so.
sed 's|url("rysing-assets/|url("../rysing-assets/|g' "$REPO/shared.css" > "$DEST/assets/css/base.css"
cp "$REPO/shared.js" "$DEST/assets/js/main.js"

# Derived: the assets the site actually loads. _originals is camera source and
# designer working files — it is never requested by a page, so it stays out.
rsync -a --delete --exclude '_originals' "$REPO/rysing-assets/" "$DEST/assets/rysing-assets/"

# Verify the rewrite moved every reference and invented none. Counting
# references rather than diff lines: pattern-blue.webp alone appears six times,
# so line counts do not equal reference counts and a line-based check reports a
# false mismatch.
BEFORE=$(grep -o 'url("rysing-assets/'      "$REPO/shared.css"            | wc -l | tr -d ' ')
AFTER=$( grep -o 'url("\.\./rysing-assets/' "$DEST/assets/css/base.css"   | wc -l | tr -d ' ')
LEFT=$(  grep -c 'url("rysing-assets/'      "$DEST/assets/css/base.css"                 || true)

echo "theme  -> $DEST"
echo "base.css url() refs: $BEFORE in, $AFTER rewritten, $LEFT unrewritten"

if [ "$BEFORE" != "$AFTER" ] || [ "$LEFT" != "0" ]; then
	echo "ERROR: asset path rewrite is incomplete — fonts and patterns will 404." >&2
	exit 1
fi

# Everything else must be byte-identical. If this reports anything, shared.css
# grew a construct the rewrite does not understand and base.css is no longer a
# faithful copy of the design system.
OTHER=$(diff "$REPO/shared.css" "$DEST/assets/css/base.css" \
	| grep '^[<>]' | sed 's|\.\./rysing-assets/|rysing-assets/|' \
	| sed 's/^< //;s/^> //' | sort | uniq -u | wc -l | tr -d ' ')

if [ "$OTHER" != "0" ]; then
	echo "ERROR: base.css differs from shared.css beyond the asset path ($OTHER lines)." >&2
	exit 1
fi
echo "assets: $(find "$DEST/assets/rysing-assets" -type f | wc -l | tr -d ' ') files, $(du -sh "$DEST/assets/rysing-assets" | cut -f1)"

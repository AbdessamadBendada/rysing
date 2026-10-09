#!/usr/bin/env node
/*
  Rysing static build.

  Stitches each `src/<name>.html` into a flat `<name>.html` at the repository
  root, wrapping it in `src/_layout.html` with the shared header and footer.
  No dependencies, no install step: `node build.js`.

  Why a build step rather than fetching the header at runtime: the output is
  plain HTML that needs no JavaScript to render its copy or its navigation,
  which is the rule HANDOFF.md §2 sets for this page, and it keeps working from
  file:// and on any host. A runtime include would also hand Divi a page whose
  chrome only exists after a fetch.

  Page sources start with an HTML comment of `key: value` lines. Every key
  becomes a `{{key}}` token available to that page; `title` and `description`
  are required. Tokens used by the shared chrome:

    home   prefix for anchors that live on the homepage. Empty on index.html so
           `#work` stays a same-page scroll; `index.html` on every sub-page so
           the same link navigates home and then scrolls.
    skip   target of the skip-link, which has to be a real id on this page.

  Unresolved `{{token}}` or a missing required key is a hard failure. A page
  that silently ships `{{home}}#work` in an href is worse than one that fails
  to build.
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const srcDir = path.join(root, 'src');

const read = (p) => fs.readFileSync(p, 'utf8');

/* `{{cssv}}` / `{{jsv}}`: a content hash appended to the stylesheet and script
   URLs so a browser holding an old copy is forced to fetch the new one.

   This is not housekeeping. The pages are flat files served with whatever
   cache headers the host happens to default to, and shared.css reaches all
   three of them — so a CSS-only change ships new HTML against a stale
   stylesheet and the page renders as a half-built version of itself. That
   happened: the about hero went out with its markup updated and its layout
   rules cached away, and the photograph rendered at natural size with the
   headline flowing out underneath it.

   The query string is deliberate rather than renaming the file. shared.css
   must stay at the repository root under its own name, because its five
   @font-face rules resolve `rysing-assets/…` relative to the stylesheet
   (HANDOFF §12) — a fingerprinted filename would be one more thing that can
   silently break those paths. */
const assetVersion = (file) =>
  crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').slice(0, 8);

/* Keys a page may leave out. Everything else still has to be declared, so a
   typo in a token remains a build failure rather than an empty attribute. */
const OPTIONAL = { pagescripts: '' };

/* Pulls the leading `key: value` comment off a page source and returns it
   alongside the remaining markup. A value may be empty (`home:`). */
function parseFrontMatter(text, file) {
  const m = text.match(/^<!--\n([\s\S]*?)\n-->\n?/);
  if (!m) throw new Error(`${file}: no front-matter comment at the top of the file`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const kv = line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.*?)\s*$/);
    if (!kv) throw new Error(`${file}: cannot parse front-matter line: ${line.trim()}`);
    meta[kv[1]] = kv[2];
  }
  return { meta, body: text.slice(m[0].length) };
}

/* Indents a partial so the generated HTML reads like hand-written markup.
   Blank lines stay blank rather than becoming trailing whitespace. */
const indent = (text, pad) =>
  text.replace(/\s+$/, '').split('\n').map((l) => (l.trim() ? pad + l : l)).join('\n');

/* Expands `{{> name}}` into `src/_name.html`, so a block of markup that appears
   on more than one page is written once. The testimonial quotes are the reason
   this exists: HANDOFF §7 requires the six to have exactly one home, and a page
   that copies them is a page that will drift from them. */
function expandIncludes(text, file, depth = 0) {
  if (depth > 5) throw new Error(`${file}: include nesting too deep (cycle?)`);
  return text.replace(/^([ \t]*)\{\{>\s*([\w-]+)\s*\}\}[ \t]*$/gm, (_, pad, name) => {
    const p = path.join(srcDir, `_${name}.html`);
    if (!fs.existsSync(p)) throw new Error(`${file}: no partial src/_${name}.html for {{> ${name}}}`);
    const body = expandIncludes(read(p), `_${name}.html`, depth + 1).replace(/\s+$/, '');
    return pad ? indent(body, pad) : body;
  });
}

function fill(template, values, file) {
  const out = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`${file}: no value for {{${key}}}`);
    return values[key];
  });
  const leftover = out.match(/\{\{\w+\}\}/);
  if (leftover) throw new Error(`${file}: unresolved token ${leftover[0]}`);
  return out;
}

const VERSIONS = { cssv: assetVersion('shared.css'), jsv: assetVersion('shared.js') };

const layout = read(path.join(srcDir, '_layout.html'));
const header = read(path.join(srcDir, '_header.html'));
const footer = read(path.join(srcDir, '_footer.html'));

const pages = fs
  .readdirSync(srcDir)
  .filter((f) => f.endsWith('.html') && !f.startsWith('_'))
  .sort();

if (!pages.length) throw new Error('src/ contains no page sources');

for (const file of pages) {
  const { meta, body } = parseFrontMatter(read(path.join(srcDir, file)), file);

  for (const key of ['title', 'description']) {
    if (!meta[key]) throw new Error(`${file}: front matter is missing ${key}`);
  }
  if (meta.home === undefined) throw new Error(`${file}: front matter is missing home`);
  if (!meta.skip) throw new Error(`${file}: front matter is missing skip`);

  /* Marks the nav link that points at this very page, so the current section
     is indicated without each page having to hand-edit a copy of the nav.
     Done after the chrome is filled, because the href only resolves then. */
  const markCurrent = (html) =>
    html.replace(
      new RegExp(`href="${file.replace('.', '\\.')}"`, 'g'),
      `href="${file}" aria-current="page"`,
    );

  /* The chrome is filled first, so its own {{home}}/{{skip}} resolve against
     this page before it is dropped into the layout. */
  const chrome = { ...meta };
  const page = fill(
    layout,
    {
      ...OPTIONAL,
      ...VERSIONS,
      ...meta,
      header: indent(markCurrent(fill(header, chrome, '_header.html')), '  '),
      footer: indent(markCurrent(fill(footer, chrome, '_footer.html')), '  '),
      main: indent(expandIncludes(body, file), ''),
    },
    file,
  );

  const target = path.join(root, file);
  const previous = fs.existsSync(target) ? read(target) : null;
  fs.writeFileSync(target, page);
  console.log(`${previous === page ? 'unchanged' : 'wrote    '}  ${file}`);
}

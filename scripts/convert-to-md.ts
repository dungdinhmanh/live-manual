import TurndownService from 'turndown';
import { Glob } from 'glob';
import { writeFileSync, mkdirSync } from 'fs';
import { basename, dirname, join } from 'path';

const SOURCE_DIR = '/home/kazukisatou/Documents/Codespace/live-manual-html-extracted/manual/html/live-manual';
const OUT_DIR = join(dirname(process.argv[1] ?? import.meta.filename), '..', 'docs', 'chapters');

function slugFromFilename(filename: string): string {
  return basename(filename, '.en.html');
}

function rewriteLinks(html: string): string {
  // Only rewrite same-directory references (no scheme, no slashes) — leave
  // absolute URLs like https://www.debian.org/.../ch04s05.en.html alone.
  return html.replace(/href="([^"\/\s]+)\.en\.html([^"]*)"/g, (_m, path, anchor) => {
    const slug = slugFromFilename(path);
    return `href="/chapters/${slug}${anchor}"`;
  });
}

/**
 * Strip SiSU navigation / chrome and pre-shape the body so Turndown
 * produces clean Markdown:
 *  - Remove <label class="ocn">…</label> footnote refs (turns into stray
 *    `[N](#N)` otherwise).
 *  - Drop duplicate "Debian Live Manual" + section-title <h1 class="tiny">.
 *  - Drop redundant "N. Title" <h1 class="norm">.
 *  - Promote "N.M Title" / "N.M.K Title" paragraphs (class="bold") to <h2>/<h3>.
 *  - Wrap <p class="code">…</p> as <pre><code> so Turndown emits fenced blocks.
 *  - Strip various other SiSU table/form/footer cruft.
 */
function stripSisuCruft(html: string): string {
  return (
    html
      // SiSU nav tables
      .replace(/<table summary="table of contents segment navigation band"[^>]*>[\s\S]*?<\/table>\s*<p>\s*/gm, '')
      .replace(/<table summary="segment navigation available documents types:[^>]*>[\s\S]*?<\/table>/gm, '')
      .replace(/<table summary="segment instrument cover band[^>]*>[\s\S]*?<\/table>/gm, '')
      .replace(/<table summary="home button[^>]*>[\s\S]*?<\/table>/gm, '')
      // OCN footnote ref labels (<label class="ocn"><a href="#N" class="lnkocn">N</a></label>)
      .replace(/<label class="ocn">[\s\S]*?<\/label>/g, '')
      // Internal anchor placeholders
      .replace(/<a name="\d+"[^>]*><\/a>/g, '')
      .replace(/<a name="[^"]*"\s*id="[^"]*"><\/a>/g, '')
      .replace(/<a name="[^"]*"[^>]*><\/a>/g, '')
      .replace(/<a id="h?[^"]*"[^>]*><\/a>/g, '')
      // Duplicate top-of-file <h1 class="tiny"> blocks (book title + section title)
      .replace(/<h1 class="tiny">[\s\S]*?<\/h1>/g, '')
      // Redundant "N. Section title" big H1
      .replace(/<h1 class="norm"[^>]*>[\s\S]*?<\/h1>/g, '')
      // Section sub-heading paragraphs: <p class="bold" id="N">N.M.K Title</p>
      // Use indentation hint (number of dots) to choose h2/h3.
      .replace(
        /<p class="bold"[^>]*>\s*((?:\d+\.)+\d+)\s+([^<]+?)\s*<\/p>/g,
        (_m, num: string, title: string) => {
          const depth = (num.match(/\./g) ?? []).length; // 1 → h2, 2 → h3, …
          const tag = depth >= 2 ? 'h3' : 'h2';
          return `<${tag}>${num} ${title.trim()}</${tag}>`;
        },
      )
      // Code paragraphs: <p class="code" id="N">…<br>…</p> → <pre><code>…</code></pre>
      .replace(/<p class="code"[^>]*>([\s\S]*?)<\/p>/g, (_m, inner: string) => {
        const body = inner
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/<[^>]+>/g, '') // drop any stray inline tags
          // Collapse the literal HTML-source newlines that surround <br>s but
          // keep meaningful blank-line separation only when authored.
          .split('\n')
          .map(l => l.replace(/\s+$/, ''))
          .filter((l, i, arr) => !(l.trim() === '' && (i === 0 || i === arr.length - 1)))
          .join('\n')
          // collapse runs of blank lines inside the block
          .replace(/\n{2,}/g, '\n')
          .replace(/^\s+|\s+$/g, '');
        return `<pre><code class="language-shell">${body
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</code></pre>`;
      })
      // SiSU search + tiny page-nav links + arrow image links
      .replace(/<p class="tiny_left"><a[^>]*>[^<]*<\/a><\/p>/g, '')
      .replace(/<!-- SiSU Search -->[\s\S]*?<!-- SiSU Search -->/g, '')
      .replace(/<form method="get"[^>]*>[\s\S]*?<\/form>/g, '')
      // Anchor tags wrapping the SiSU TOC / next / prev arrow images
      .replace(/<a[^>]*>\s*<img[^>]*_sisu\/image_sys\/[^>]*>\s*<\/a>/g, '')
      .replace(/<img[^>]*_sisu\/image_sys\/[^>]*>/g, '')
      // Wrapper divs / empty paragraphs
      .replace(/<div class="main_column">/g, '')
      .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/body>\s*<\/html>/g, '\n</body></html>')
      .replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/g, '')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<p>&nbsp;<\/p>/g, '')
      .replace(/<a name="(top|bottom|end)"[^>]*><\/a>/g, '')
      .replace(/<\/?font[^>]*>/g, '')
      .trim()
  );
}

/**
 * Cleanup pass on the Markdown produced by Turndown:
 *  - Belt-and-braces strip of any `[N](#N)` footnote refs that survived.
 *  - Unescape `\_` / `\#` / `\*` that Turndown overzealously inserts in prose
 *    (code fences are skipped — we only touch text outside ``` blocks).
 *  - Collapse runs of 3+ blank lines into 2.
 */
function tidyMarkdown(md: string): string {
  // Strip footnote ref residue: `[12](#12)`, optionally surrounded by whitespace.
  let out = md.replace(/\s*\[\d+\]\(#\d+\)\s*/g, '\n\n');

  // Unescape outside fenced code blocks.
  const parts = out.split(/(```[\s\S]*?```)/g);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      parts[i] = parts[i]
        .replace(/\\_/g, '_')
        .replace(/\\#/g, '#')
        .replace(/\\\*/g, '*')
        .replace(/\\\[/g, '[')
        .replace(/\\\]/g, ']')
        .replace(/\\--/g, '--')
        .replace(/\\-/g, '-');
    }
  }
  out = parts.join('');

  // Collapse 3+ blank lines.
  out = out.replace(/\n{3,}/g, '\n\n');

  return out.trim() + '\n';
}

function extractTitle(html: string): string {
  const match = html.match(/<title>\s*([\s\S]*?)\s*<\/title>/);
  if (!match) return 'Untitled';
  const full = match[1].trim();
  const parts = full.split(/\s*-\s*Debian Live Manual\s*/i);
  const title = parts[0].trim();
  if (!title || title.toLowerCase() === 'untitled') return 'Untitled';
  return title;
}

/**
 * The HTML's <h1 class="tiny"> section title (e.g. "About this manual") is
 * the canonical page heading; <title> may be a slugged ASCII fallback. Prefer
 * the section <h1> if we can find one before we strip the <h1>s.
 */
function extractSectionH1(html: string): string | null {
  // Match the second <h1 class="tiny"> (first is "Debian Live Manual").
  const all = [...html.matchAll(/<h1 class="tiny">\s*([\s\S]*?)\s*<\/h1>/g)];
  if (all.length < 2) return null;
  const raw = all[1][1].trim();
  if (!raw || raw.toLowerCase() === 'debian live manual') return null;
  return raw;
}

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  tableEdgeSpaces: false,
  tables: true,
});

async function convertAll() {
  mkdirSync(OUT_DIR, { recursive: true });

  const g = new Glob('*.en.html', { cwd: SOURCE_DIR, absolute: true });
  const files = Array.from(g);
  const chapterFiles = files.filter(f => !f.includes('/index.') && !f.includes('/toc.'));

  for (const file of chapterFiles) {
    const slug = slugFromFilename(file);
    const raw = await Bun.file(file).text();

    const sectionH1 = extractSectionH1(raw);
    const title = sectionH1 ?? extractTitle(raw);

    const cleaned = stripSisuCruft(raw);
    const linked = rewriteLinks(cleaned);

    const bodyMatch = linked.match(/<body[^>]*>([\s\S]*)<\/body>/);
    if (!bodyMatch) continue;

    const markdown = td.turndown(bodyMatch[1]);
    const tidied = tidyMarkdown(markdown);

    const frontmatter = ['---', `title: ${title}`, `slug: ${slug}`, '---', '', ''].join('\n');

    // Inject a single canonical H1 at the top so every page has consistent
    // structure regardless of whether the source contained one.
    const hasLeadingH1 = /^#\s+\S/.test(tidied);
    const body = hasLeadingH1 ? tidied : `# ${title}\n\n${tidied}`;

    const outPath = join(OUT_DIR, `${slug}.md`);
    writeFileSync(outPath, frontmatter + body);
    console.log(`✓ ${slug}.md`);
  }

  const homeContent = `---
layout: home
title: Debian Live Manual
hero:
  name: Debian Live Manual
  text: The official guide to Debian Live systems
  tagline: Build and customize Debian-based live systems with live-build, live-boot, and live-config
  actions:
    - theme: brand
      text: Get Started
      link: /chapters/about-manual
    - theme: alt
      text: View on Salsa
      link: https://salsa.debian.org/live-team/live-manual
features:
  - title: Installation
    details: Install live-build from Debian repositories or build from source.
  - title: The Basics
    details: Download prebuilt images, create ISO hybrids, and boot live systems.
  - title: Customization
    details: Customize packages, contents, run-time behaviours, and binary images.
  - title: Examples
    details: Step-by-step tutorials from default images to VNC kiosks.
  - title: Contributing
    details: Help translate and improve the Debian Live Manual.
  - title: Coding Style
    details: Guidelines for contributing code to the Debian Live Project.
---
`;
  writeFileSync(join(OUT_DIR, '..', 'index.md'), homeContent);
  console.log('✓ docs/index.md (home page)');
}

convertAll().catch(console.error);

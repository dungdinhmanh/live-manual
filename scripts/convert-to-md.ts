import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { Glob } from 'glob';
import { writeFileSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { basename, dirname, join } from 'path';

// Source HTML directory. CI sets SOURCE_DIR to the freshly built `*.en.html`
// output; falls back to a positional arg, then the local extracted snapshot.
const DEFAULT_SOURCE_DIR =
  '/home/kazukisatou/Documents/Codespace/live-manual-html-extracted/manual/html/live-manual';
const SOURCE_DIR = process.env.SOURCE_DIR ?? process.argv[2] ?? DEFAULT_SOURCE_DIR;
const OUT_DIR = join(dirname(process.argv[1] ?? import.meta.filename), '..', 'docs', 'chapters');

export function slugFromFilename(filename: string): string {
  return basename(filename, '.en.html');
}

export function rewriteLinks(html: string): string {
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
export function stripSisuCruft(html: string): string {
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
      // Title may contain inline tags (<tt>, <a>, …) and span multiple lines
      // with leading anchors — strip anchors first, then match.
      .replace(
        /<p class="bold"[^>]*>([\s\S]*?)<\/p>/g,
        (whole, inner: string) => {
          // Strip inline anchor tags (no useful content) before number match.
          const cleaned = inner.replace(/<a[^>]*><\/a>/g, '').trim();
          const numMatch = cleaned.match(/^((?:\d+\.)+\d+)\s+([\s\S]+)$/);
          if (!numMatch) return whole;
          const num = numMatch[1];
          const title = numMatch[2]
            // Strip remaining inline tags so the heading is plain text.
            .replace(/<\/?(?:tt|code|b|i|em|strong|a)[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          const depth = (num.match(/\./g) ?? []).length; // 1 → h2, 2 → h3, …
          const tag = depth >= 2 ? 'h3' : 'h2';
          return `<${tag}>${num} ${title}</${tag}>`;
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

        // A "command" block has lines that start with a shell prompt ($ or #).
        // Strip the prompt so commands are copy-paste clean and `#` lines are not
        // syntax-highlighted as comments. Blocks with no prompt (e.g. ASCII
        // directory trees, file listings) are tagged `text` so they render as
        // plain monospace instead of being mis-highlighted as shell.
        const lines = body.split('\n');
        const nonEmpty = lines.filter(l => l.trim() !== '');
        // `$` is an unambiguous user prompt. `#` is ambiguous — a root prompt in
        // a command block, but also a comment line in a config-file listing. So
        // only treat the block as shell when there is a `$` prompt, or when every
        // non-empty line is a prompt (a pure command block). A mixed listing with
        // `#` comments stays `text` and keeps its `#` verbatim instead of having
        // it stripped as if it were a prompt.
        const hasDollar = nonEmpty.some(l => /^\s*\$\s+/.test(l));
        const allPrompt = nonEmpty.length > 0 && nonEmpty.every(l => /^\s*[$#]\s+/.test(l));
        const hasPrompt = hasDollar || allPrompt;
        const lang = hasPrompt ? 'shell' : 'text';
        const stripped = hasPrompt
          ? lines.map(l => l.replace(/^\s*[$#]\s+/, '')).join('\n')
          : body;

        return `<pre><code class="language-${lang}">${stripped
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
 * Promote leading "**Note:**" / "**Important:**" / "**Warning:**" paragraphs to
 * VitePress custom containers so they get proper visual styling.
 */
export function promoteAdmonitions(md: string): string {
  return md.replace(
    /^\*\*(Note|Important|Warning|Tip):\*\*\s+([^\n]+)$/gm,
    (_m, kind: string, body: string) => {
      const container =
        kind === 'Warning' ? 'warning' : kind === 'Important' ? 'info' : kind === 'Tip' ? 'tip' : 'tip';
      const title = kind;
      return `::: ${container} ${title}\n${body.trim()}\n:::`;
    },
  );
}

/**
 * SiSU wraps inline links in guillemets: ‹https://…›, ‹someone@host›. Turndown
 * leaves the guillemets as literal text around the (already-linkified) URL.
 * Convert each to a clean Markdown link and drop the guillemets entirely.
 * Plain bare URLs inside guillemets that Turndown did NOT linkify also get
 * wrapped. A stray zero-width space (U+200B) sometimes trails the closing ›.
 */
export function linkifyGuillemets(text: string): string {
  return (
    text
      // ‹[label](url)›  → [label](url)   (Turndown already made the link)
      .replace(/‹(\[[^\]]*\]\([^)]*\))›​?/g, '$1')
      // ‹mailto:…› or ‹user@host› bare → mailto link
      .replace(/‹([\w.+-]+@[\w.-]+\.[a-z]{2,})›​?/gi, '[$1](mailto:$1)')
      // ‹https://…› / ‹http://…› bare URL → autolink
      .replace(/‹(https?:\/\/[^\s›]+)›​?/g, '[$1]($1)')
      // Any remaining guillemet pair: drop the markers, keep inner text.
      .replace(/‹([^›]*)›​?/g, '$1')
  );
}

/**
 * Turn `name(N)` manpage references into links to manpages.debian.org
 * (canonical form: https://manpages.debian.org/name.N). Names may be wrapped
 * in Markdown emphasis from the source (e.g. _live-boot_(7)); the emphasis is
 * unwrapped into the link text. Skips matches already inside a Markdown link.
 */
export function linkifyManpages(text: string): string {
  // Optional surrounding _…_ emphasis, then name(section).
  return text.replace(
    /(_?)([a-z][a-z0-9_.+-]*?)\1\((\d)\)/gi,
    (whole, _emph: string, name: string, section: string, offset: number, src: string) => {
      // Don't rewrite if this sits inside an existing link — either as the URL
      // target (preceded by `](` or a `/` path char) or as the link TEXT
      // (immediately followed by `](`, e.g. `[live-boot(7)](…)`). Without the
      // trailing check the ref in link text gets double-linked.
      const before = src.slice(Math.max(0, offset - 2), offset);
      const after = src.slice(offset + whole.length, offset + whole.length + 2);
      if (before.endsWith('](') || before.endsWith('/') || after === '](') return whole;
      // manpages.debian.org paths are lowercase.
      const url = `${name.toLowerCase()}.${section}`;
      return `[${name}(${section})](https://manpages.debian.org/${url})`;
    },
  );
}

/**
 * Cleanup pass on the Markdown produced by Turndown:
 *  - Belt-and-braces strip of any `[N](#N)` footnote refs that survived.
 *  - Unescape `\_` / `\#` / `\*` that Turndown overzealously inserts in prose
 *    (code fences are skipped — we only touch text outside ``` blocks).
 *  - Collapse runs of 3+ blank lines into 2.
 */
export function tidyMarkdown(md: string): string {
  // Strip footnote ref residue: `[12](#12)`, optionally surrounded by whitespace.
  let out = md.replace(/\s*\[\d+\]\(#\d+\)\s*/g, '\n\n');

  // Drop the empty SiSU navigation-band tables that Turndown passes through as
  // raw HTML at the top and bottom of every chapter. They carry no content and
  // would otherwise render as empty bordered boxes. Each is one line in the MD.
  out = out.replace(/^<table summary="segment navigation[^\n]*<\/table>\s*$/gm, '');

  // Unescape + linkify outside code. Protect BOTH fenced blocks (```…```) and
  // inline spans (`…`): a manpage ref or guillemet URL inside inline code (e.g.
  // `tar(1)`) must stay verbatim, not get linkified into a broken code span.
  const parts = out.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
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
      parts[i] = linkifyGuillemets(parts[i]);
      parts[i] = linkifyManpages(parts[i]);
    }
  }
  out = parts.join('');

  out = promoteAdmonitions(out);

  out = stripVolatileMetadata(out);

  // Collapse 3+ blank lines.
  out = out.replace(/\n{3,}/g, '\n\n');

  return out.trim() + '\n';
}

/**
 * Drop build-environment fields from the metadata page. SiSU stamps the Ruby
 * interpreter version and a generation timestamp into the document; both change
 * on every build (and differ between the local snapshot and the CI runner), so
 * keeping them makes the generated Markdown non-deterministic and the golden
 * drift gate fail forever. They carry no value for a web reader. The stable
 * "Generated by: SiSU <version>" line is kept — it identifies the toolchain.
 * No-op on every other chapter (those lines only appear on metadata.en.html).
 */
export function stripVolatileMetadata(md: string): string {
  return md
    .replace(/^\*\*Ruby version\*\*:.*$\n?/gm, '')
    .replace(/^\*\*Document \(ao\) last generated\*\*:.*$\n?/gm, '');
}

// Chapters above this line count get a [[toc]] under the H1.
const TOC_MIN_LINES = 200;

// Sidebar grouping. Slugs are placed under these section headings in this order;
// within a group, items follow the upstream `toc.en.html` editorial order. Any
// converted chapter not listed here falls into a trailing "More" group so new
// upstream chapters still appear in the nav instead of becoming orphans.
const SIDEBAR_GROUPS: { title: string; slugs: string[] }[] = [
  { title: 'About', slugs: ['about-manual', 'about-project'] },
  { title: 'User', slugs: ['installation', 'the-basics', 'overview-of-tools', 'managing-a-configuration'] },
  {
    title: 'Customization',
    slugs: [
      'customization-overview',
      'customizing-package-installation',
      'customizing-contents',
      'customizing-run-time-behaviours',
      'customizing-binary',
      'customizing-installer',
    ],
  },
  { title: 'Project', slugs: ['contributing-to-project', 'bugs', 'coding-style'] },
  { title: 'Examples', slugs: ['examples'] },
  { title: 'Appendix', slugs: ['style-guide', 'metadata'] },
];

const SIDEBAR_TITLE_OVERRIDES = new Map<string, string>([
  ['customization-overview', 'Customization overview'],
]);

/**
 * Extract the upstream chapter order from `toc.en.html` (the SiSU table of
 * contents). Returns slugs in first-appearance order, excluding toc/index.
 * Returns [] if the file is missing or unparseable — callers fall back to the
 * SIDEBAR_GROUPS declaration order.
 */
export function parseTocOrder(html: string): string[] {
  const slugs: string[] = [];
  const seen = new Set<string>();
  const re = /href="([a-z][a-z0-9-]+)\.en\.html"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const slug = m[1];
    if (slug === 'toc' || slug === 'index' || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

/**
 * Build the VitePress sidebar tree from the converted chapters, grouped by
 * SIDEBAR_GROUPS and ordered within each group by the upstream TOC.
 */
type SidebarGroup = { text: string; collapsed: false; items: { text: string; link: string }[] };

export function buildSidebar(titles: Map<string, string>, tocOrder: string[]): SidebarGroup[] {
  const tocIndex = (slug: string) => {
    const i = tocOrder.indexOf(slug);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const link = (slug: string) => ({
    text: SIDEBAR_TITLE_OVERRIDES.get(slug) ?? titles.get(slug) ?? slug,
    link: `/chapters/${slug}`,
  });

  const grouped = new Set<string>();
  const sidebar: SidebarGroup[] = SIDEBAR_GROUPS.map(group => {
    const items = group.slugs
      .filter(slug => titles.has(slug))
      .sort((a, b) => tocIndex(a) - tocIndex(b));
    items.forEach(slug => grouped.add(slug));
    return { text: group.title, collapsed: false as const, items: items.map(link) };
  }).filter(g => g.items.length > 0);

  // Any converted chapter not assigned to a declared group (e.g. a brand-new
  // upstream chapter) lands in "More", ordered by the TOC.
  const leftovers = [...titles.keys()]
    .filter(slug => !grouped.has(slug))
    .sort((a, b) => tocIndex(a) - tocIndex(b));
  if (leftovers.length > 0) {
    sidebar.push({ text: 'More', collapsed: false as const, items: leftovers.map(link) });
  }

  return sidebar;
}

export function extractTitle(html: string): string {
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
export function extractSectionH1(html: string): string | null {
  // Pages carry a "Debian Live Manual" banner <h1 class="tiny"> plus the section
  // title in another. Drop the banner and take the last remaining one. Most pages
  // have two (banner + title); the metadata page has only the title, so requiring
  // two would wrongly fall back to the lowercased <title> slug.
  const titles = [...html.matchAll(/<h1 class="tiny">\s*([\s\S]*?)\s*<\/h1>/g)]
    .map(m => m[1].trim())
    .filter(t => t && t.toLowerCase() !== 'debian live manual');
  return titles.length ? titles[titles.length - 1] : null;
}

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});
// GFM plugin gives us real Markdown tables (the manual has a config-files matrix
// in "Customizing package installation" that otherwise flattens to a wall of text).
td.use(gfm);

/**
 * Convert one source HTML chapter into its final Markdown file contents
 * (frontmatter + H1 + body + optional TOC). Pure: no filesystem access, so it
 * can be golden-tested directly. Returns the resolved `title` always (used for
 * the sidebar) and `content` = the full `.md` payload, or null when the page
 * has no usable <body> (the chapter is then skipped by the writer).
 */
export function renderChapter(raw: string, slug: string): { title: string; content: string | null } {
  const sectionH1 = extractSectionH1(raw);
  const title = sectionH1 ?? extractTitle(raw);

  const cleaned = stripSisuCruft(raw);
  const linked = rewriteLinks(cleaned);

  // Prefer the well-formed `<body>…</body>` span; fall back to capturing to EOF
  // for pages that ship without a closing tag (the metadata page is malformed
  // upstream — it ends at a stray `</div>` with no `</body></html>`).
  const bodyMatch =
    linked.match(/<body[^>]*>([\s\S]*)<\/body>/) ?? linked.match(/<body[^>]*>([\s\S]*)$/);
  if (!bodyMatch) return { title, content: null };

  const markdown = td.turndown(bodyMatch[1]);
  const tidied = tidyMarkdown(markdown);

  const frontmatter = ['---', `title: ${title}`, `slug: ${slug}`, '---', '', ''].join('\n');

  // Inject a single canonical H1 at the top so every page has consistent
  // structure regardless of whether the source contained one.
  const hasLeadingH1 = /^#\s+\S/.test(tidied);
  let body = hasLeadingH1 ? tidied : `# ${title}\n\n${tidied}`;

  // Long chapters get an auto-TOC right after the H1.
  if (body.split('\n').length >= TOC_MIN_LINES) {
    body = body.replace(/^(#\s+[^\n]+\n)/, `$1\n[[toc]]\n`);
  }

  return { title, content: frontmatter + body };
}

async function convertAll() {
  mkdirSync(OUT_DIR, { recursive: true });

  // Prune stale chapter Markdown so renamed/removed upstream chapters don't leave
  // orphan files behind. OUT_DIR holds only generated `*.md` — safe to wipe.
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith('.md')) rmSync(join(OUT_DIR, f));
  }

  const g = new Glob('*.en.html', { cwd: SOURCE_DIR, absolute: true });
  const files = Array.from(g);
  const chapterFiles = files.filter(f => !f.includes('/index.') && !f.includes('/toc.'));

  const titles = new Map<string, string>();

  for (const file of chapterFiles) {
    const slug = slugFromFilename(file);
    const raw = await Bun.file(file).text();

    const { title, content } = renderChapter(raw, slug);
    titles.set(slug, title);
    if (content === null) continue;

    const outPath = join(OUT_DIR, `${slug}.md`);
    writeFileSync(outPath, content);
    console.log(`✓ ${slug}.md`);
  }

  // Generate the sidebar from the upstream TOC order so new/renamed chapters are
  // reflected in the nav without hand-editing config.ts.
  const tocFile = Bun.file(join(SOURCE_DIR, 'toc.en.html'));
  const tocOrder = (await tocFile.exists()) ? parseTocOrder(await tocFile.text()) : [];
  const sidebar = buildSidebar(titles, tocOrder);
  const sidebarPath = join(OUT_DIR, '..', '.vitepress', 'sidebar.generated.json');
  writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2) + '\n');
  console.log('✓ docs/.vitepress/sidebar.generated.json');

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
    link: /chapters/installation
  - title: The Basics
    details: Download prebuilt images, create ISO hybrids, and boot live systems.
    link: /chapters/the-basics
  - title: Customization
    details: Customize packages, contents, run-time behaviours, and binary images.
    link: /chapters/customization-overview
  - title: Examples
    details: Step-by-step tutorials from default images to VNC kiosks.
    link: /chapters/examples
  - title: Contributing
    details: Help translate and improve the Debian Live Manual.
    link: /chapters/contributing-to-project
  - title: Coding Style
    details: Guidelines for contributing code to the Debian Live Project.
    link: /chapters/coding-style
---

## Common tasks

- [Install live-build](/chapters/installation)
- [Create an ISO hybrid image](/chapters/the-basics)
- [Customize package installation](/chapters/customizing-package-installation)
- [Add files to the live system](/chapters/customizing-contents)
- [Report a documentation issue](/chapters/bugs)
`;
  writeFileSync(join(OUT_DIR, '..', 'index.md'), homeContent);
  console.log('✓ docs/index.md (home page)');
}

if (import.meta.main) {
  convertAll().catch(console.error);
}

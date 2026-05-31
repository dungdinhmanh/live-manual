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
  return html
    .replace(/href="([^"]*)\.en\.html([^"]*)"/g, (_m, path, anchor) => {
      const slug = slugFromFilename(path);
      return `href="/chapters/${slug}${anchor}"`;
    })
    .replace(/name="([^"]+)"/g, 'id="$1"')
    .replace(/id="([^"]+)"/g, (_m, id) => `id="${id}"`);
}

function stripSisuCruft(html: string): string {
  return html
    .replace(/<table summary="table of contents segment navigation band"[^>]*>[\s\S]*?<\/table>\s*<p>\s*/gm, '')
    .replace(/<table summary="segment navigation available documents types:[^>]*>[\s\S]*?<\/table>/gm, '')
    .replace(/<table summary="segment instrument cover band[^>]*>[\s\S]*?<\/table>/gm, '')
    .replace(/<table summary="home button[^>]*>[\s\S]*?<\/table>/gm, '')
    .replace(/<p class="tiny_left"><a[^>]*>[^<]*<\/a><\/p>/g, '')
    .replace(/<!-- SiSU Search -->[\s\S]*?<!-- SiSU Search -->/g, '')
    .replace(/<form method="get"[^>]*>[\s\S]*?<\/form>/g, '')
    .replace(/<a href="[^"]*\.en\.html"[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<a name="\d+"><\/a>/g, '')
    .replace(/<a name="[^"]*"\s*id="[^"]*"><\/a>/g, '')
    .replace(/<a name="[^"]*"><\/a>/g, '')
    .replace(/\[(\d+)\]\(#\s*\d+\s*\)/g, '')  // strip leftover footnote anchors like [4](#4)
    .replace(/<div class="main_column">/g, '')
    .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/body>\s*<\/html>/g, '\n</body></html>')
    .replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>&nbsp;<\/p>/g, '')
    .replace(/<a name="(top|bottom|end)"[^>]*><\/a>/g, '')
    .replace(/<\/?font[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugToTitleCase(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function extractTitle(html: string): string {
  const match = html.match(/<title>\s*([\s\S]*?)\s*<\/title>/);
  if (!match) return 'Untitled';
  const full = match[1].trim();
  const parts = full.split(/\s*-\s*Debian Live Manual\s*/i);
  const title = parts[0].trim();
  if (!title || title.toLowerCase() === 'untitled') return 'Untitled';
  // If title looks like a raw slug (all lowercase, contains hyphens but no spaces),
  // convert to title case
  if (title === title.toLowerCase() && title.includes('-')) return slugToTitleCase(title);
  return title;
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

  const slugToTitle: Record<string, string> = {};

  for (const file of chapterFiles) {
    const slug = slugFromFilename(file);
    const raw = await Bun.file(file).text();

    const cleaned = stripSisuCruft(raw);
    const linked = rewriteLinks(cleaned);

    const bodyMatch = linked.match(/<body[^>]*>([\s\S]*)<\/body>/);
    if (!bodyMatch) continue;

    const bodyContent = bodyMatch[1].replace(/<h1[^>]*>\s*Debian Live Manual\s*<\/h1>/i, '');
    const markdown = td.turndown(bodyContent);
    const title = extractTitle(raw);

    slugToTitle[slug] = title;

    const frontmatter = [
      '---',
      `title: ${title}`,
      `slug: ${slug}`,
      '---',
      '',
    ].join('\n');

    const outPath = join(OUT_DIR, `${slug}.md`);
    writeFileSync(outPath, frontmatter + markdown + '\n');
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
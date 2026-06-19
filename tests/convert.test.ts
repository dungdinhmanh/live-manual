/**
 * Converter regression tests. Two layers:
 *
 *  1. Golden end-to-end — each tests/fixtures/<slug>.en.html is run through the
 *     real pipeline (renderChapter) and compared byte-for-byte to the committed
 *     tests/golden/<slug>.md. These fixtures are self-contained (no external
 *     source HTML), so they run anywhere, including CI.
 *
 *     To (re)bless the golden after an intended converter change:
 *         UPDATE_GOLDEN=1 bun test
 *     then review the git diff of tests/golden/ and commit it.
 *
 *  2. Focused unit assertions — pin the behaviour of individual prose transforms
 *     so a regression points at the exact function, not just "some file changed".
 */
import { test, expect } from 'bun:test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Glob } from 'glob';
import {
  renderChapter,
  linkifyManpages,
  linkifyGuillemets,
  promoteAdmonitions,
  tidyMarkdown,
  rewriteLinks,
  buildSidebar,
} from '../scripts/convert-to-md';

const FIXTURES = join(import.meta.dir, 'fixtures');
const GOLDEN = join(import.meta.dir, 'golden');
const UPDATE = !!process.env.UPDATE_GOLDEN;

// ---- Layer 1: golden end-to-end ----
mkdirSync(GOLDEN, { recursive: true });
const fixtures = [...new Glob('*.en.html', { cwd: FIXTURES })];

for (const file of fixtures) {
  const slug = file.replace(/\.en\.html$/, '');
  test(`golden: ${slug}`, () => {
    const raw = readFileSync(join(FIXTURES, file), 'utf8');
    const { content } = renderChapter(raw, slug);
    expect(content).not.toBeNull();

    const goldenPath = join(GOLDEN, `${slug}.md`);
    if (UPDATE) {
      writeFileSync(goldenPath, content!);
      return;
    }
    expect(content).toBe(readFileSync(goldenPath, 'utf8'));
  });
}

// ---- Layer 2: focused transform units ----
test('linkifyManpages: links a manpage ref', () => {
  expect(linkifyManpages('see live-boot(7) now')).toBe(
    'see [live-boot(7)](https://manpages.debian.org/live-boot.7) now',
  );
});

// Pins the guard that actually works: a ref sitting in a URL target (preceded
// by `/`) is left alone. NOTE: the guard does NOT protect a ref inside link
// *text* (e.g. `[tar(1)](…)`) — that is a known limitation of the current
// converter, not asserted here. See harness notes.
test('linkifyManpages: leaves a ref inside a URL target alone', () => {
  const s = '[x](https://example.org/tar(1))';
  expect(linkifyManpages(s)).toBe(s);
});

test('linkifyGuillemets: wraps a bare URL and drops markers', () => {
  expect(linkifyGuillemets('‹https://example.org›')).toBe(
    '[https://example.org](https://example.org)',
  );
});

test('promoteAdmonitions: Note becomes a tip container', () => {
  expect(promoteAdmonitions('**Note:** be careful')).toBe('::: tip Note\nbe careful\n:::');
});

test('rewriteLinks: same-dir chapter ref becomes an absolute /chapters path', () => {
  expect(rewriteLinks('<a href="the-basics.en.html#foo">x</a>')).toBe(
    '<a href="/chapters/the-basics#foo">x</a>',
  );
});

test('rewriteLinks: leaves absolute external URLs alone', () => {
  const s = '<a href="https://www.debian.org/x/ch04s05.en.html">x</a>';
  expect(rewriteLinks(s)).toBe(s);
});

test('tidyMarkdown: unescapes prose but never touches code fences', () => {
  const out = tidyMarkdown('```shell\na\\_b\n```\n\ntext a\\_b\n');
  expect(out).toContain('a\\_b\n```'); // inside the fence: backslash preserved
  expect(out).toContain('text a_b'); // outside the fence: unescaped
});

test('buildSidebar: declared groups keep order, unknown chapter lands in More', () => {
  const titles = new Map([
    ['about-manual', 'About'],
    ['installation', 'Install'],
    ['novel-chapter', 'Novel'],
  ]);
  const sb = buildSidebar(titles, ['about-manual', 'installation', 'novel-chapter']);
  expect(sb.find(g => g.text === 'More')?.items[0]?.link).toBe('/chapters/novel-chapter');
});

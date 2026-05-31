# CLAUDE.md

Guidance for agents working in this repo.

## Purpose

Web reader for the **Debian Live Manual**, built with **VitePress**. The canonical
manual is authored in SiSU and published as HTML on Debian infrastructure; this
project converts that HTML into clean Markdown and serves it as a fast, themed
static site with Debian branding, local search, and light/dark modes.

This repo is **derived content**: chapter Markdown is generated, not hand-written.
The upstream project lives on Salsa (`https://salsa.debian.org/live-team/live-manual`);
these `.md` files do **not** exist there, so there is no "edit this page" link.

## Critical files

| Path | Role |
|------|------|
| `scripts/convert-to-md.ts` | **The converter.** HTML → Markdown via Turndown (+ `turndown-plugin-gfm` for tables). Strips SiSU cruft, fences shell commands, links guillemets + manpage refs, injects TOC + admonition containers, generates `docs/index.md`. |
| `docs/.vitepress/config.ts` | Site config — nav, sidebar tree, local search, branding, `markdown.lineNumbers: true`. |
| `docs/.vitepress/theme/custom.css` | All visual overrides. Conforms to `DESIGN.md`. |
| `docs/.vitepress/theme/index.ts` | Theme entry (extends default). |
| `docs/index.md` | Home page (`layout: home`); **generated** by the converter. |
| `docs/chapters/*.md` | 18 chapters; **all generated** — edit the converter, not these. |
| `DESIGN.md` | Locked design system (8-pt grid, tokens, components). |

Source HTML (input, not in repo):
`/home/kazukisatou/Documents/Codespace/live-manual-html-extracted/manual/html/live-manual/*.en.html`
(set as `SOURCE_DIR` in the converter).

## Commands (Bun)

```bash
bun install
bun run dev      # dev server, http://localhost:5173
bun run build    # production build (vitepress build docs)
bun run preview  # preview built site
bun run convert  # regenerate chapters + index.md from source HTML
```

## How the conversion pipeline works

`convert-to-md.ts`, per source file:
1. `stripSisuCruft` — remove SiSU nav tables, OCN footnote labels, anchor
   placeholders, search forms, image chrome; promote `<p class="bold">` numbered
   section titles to `<h2>`/`<h3>`; turn `<p class="code">` into fenced blocks
   (strips `$`/`#` prompts; tags command blocks `shell`, tree/listing dumps
   `text`); unwrap tables from their `<p class="norm">` wrapper.
2. `rewriteLinks` — same-dir `*.en.html` refs → `/chapters/<slug>`.
3. Turndown (`gfm` plugin) → Markdown.
4. `tidyMarkdown` — drop residual footnote refs and empty nav tables; unescape
   over-escaped prose **outside** code fences; `linkifyGuillemets`
   (`‹url›`/`‹email›` → links); `linkifyManpages` (`name(N)` →
   `manpages.debian.org/name.N`, URL lowercased); `promoteAdmonitions`
   (`**Note:**` etc → `::: tip|info|warning`); collapse blank lines.
5. Inject canonical `# H1`; add `[[toc]]` to chapters ≥ `TOC_MIN_LINES` (200).

The converter is **idempotent** — re-running on regenerated output is a no-op.

## Working rules

- **Never hand-edit `docs/chapters/*.md` or `docs/index.md`.** Change the
  converter and re-run `bun run convert`. Verify idempotency (a second run yields
  no diff).
- **All visual work follows `DESIGN.md`** — 8-point spacing grid (4px half-step),
  `4`/`8`px radius scale, the three font faces, the brand color pairs. Update
  `DESIGN.md` before deviating.
- Every custom color needs a light **and** a `.dark` value; verify both themes.
- Transforms that touch prose in the converter must skip fenced code blocks (use
  the existing `split(/(```[\s\S]*?```)/g)` pattern).
- After converter or CSS changes: `bun run build` must pass; spot-check in the
  browser (Playwright MCP is available).
- This is documentation tooling for Debian — keep copy faithful to the upstream
  manual; nothing invented.

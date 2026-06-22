# Design System — Debian Live Manual (Web)

Locked design for the VitePress reader. Source of truth for every visual choice.
All values live in `docs/.vitepress/theme/custom.css`; this file documents and
freezes them. **Do not introduce off-grid spacing, off-scale radii, or new
colors without updating this file first.**

The product is a **documentation reader**, not a marketing site. Visual identity
= official Debian red on a clean serif body, with a sans heading/UI face and a
monospace code face. Restraint over decoration.

---

## 1. Spacing — strict 8-point grid

Base unit **8px**. **4px** is the only permitted half-step. Every `padding`,
`margin`, `gap`, and layout offset must be one of:

| Token | px   | rem    | Use |
|-------|------|--------|-----|
| `½`   | 4    | 0.25   | tight inset (heading underline gap) |
| `1`   | 8    | 0.5    | cell padding (vertical), h1 underline gap |
| `2`   | 16   | 1      | cell padding (horizontal), blockquote vertical |
| `3`   | 24   | 1.5    | blockquote horizontal |
| `4`   | 32   | 2      | h2 top margin, section rhythm |
| `6`   | 48   | 3      | block separation |
| `8`   | 64   | 4      | major section gap |

**Off-grid is a bug.** Values like `0.6rem` (9.6px), `1.25rem` (20px), `12px`
were removed. Hover lift is `4px` (half-step), not `2px`.

Exempt from the grid (not layout spacing): border **widths** (1px, 2px, 4px
accents), micro-transitions, font sizes (see §3).

## 2. Radius

Two-step scale only: `--ldm-radius-sm: 4px`, `--ldm-radius-md: 8px`.

- `8px` — code blocks, tables, blockquote outer corners, search button.
- `4px` — scrollbar thumb.

No `6px`, no `12px`.

## 3. Type

| Face | Stack | Role |
|------|-------|------|
| **Body** | `'Source Serif 4', Georgia, serif` | prose, paragraphs |
| **UI / Headings** | `'DM Sans', sans-serif` | h1–h6, nav, sidebar, table headers |
| **Mono** | `'JetBrains Mono', 'Fira Code', monospace` | code, inline code |

Sizes in use:
- h1 `2rem` / 700, brand bottom border `2px`, gap `0.5rem`.
- h2 `1.5rem` / 600, **no top border**, top margin `2rem`, brand bottom border
  `1px` (30% alpha), gap `0.25rem`.
- h3–h6 DM Sans, inherit VitePress sizes.
- Sidebar item `0.875rem` (14px).

Fonts loaded via Google Fonts `@import` at top of `custom.css`.

## 4. Color

Brand = Debian red. Light/dark pairs:

| Token | Light | Dark |
|-------|-------|------|
| `--vp-c-brand-1` (primary) | `#d70a53` | `#ef5777` |
| `--vp-c-brand-2` | `#c0094a` | `#d70a53` |
| `--vp-c-brand-3` | `#a00840` | `#b5083f` |
| `--vp-c-brand-soft` | `rgba(215,10,83,.08)` | `rgba(239,87,119,.12)` |
| `--vp-code-bg` | `#f5f5f5` | `#1e1e1e` |
| `--vp-code-color` | `#d70a53` | `#ef5777` |
| sidebar bg | `var(--vp-c-bg-alt)` | `#1c1917` |
| scrollbar track | `var(--vp-c-bg-soft)` | `#1c1917` |
| scrollbar thumb | `#d6d3d1` | `#44403c` |

Hero name uses a `135deg` gradient `#d70a53 → #ef5777` (clipped to text).
Accent borders use brand red at low alpha (`.08`–`.30`). Favicon/theme-color
`#d70a53`. Logo = official `debian.org/Pics/debian.png`.

Both themes are first-class — every custom color has a `.dark` override. Verify
both on any change.

## 5. Components

- **Code block** — `8px` radius, `1px` brand-alpha border (`.15` light / `.20`
  dark, `#0f0f0f` dark bg). Line-number gutter **hidden for single-line blocks**
  (`:has` rule), shown for multi-line. Prompts (`$`/`#`) are stripped at convert
  time; non-command/tree dumps get the `text` language so they render plain.
- **Table** — full width, `8px` radius, header row brand-soft bg + brand text,
  cell padding `8px 16px`, row hover brand-soft. (Real Markdown tables only —
  the converter uses `turndown-plugin-gfm`.)
- **Blockquote** — `4px` brand left bar, brand-soft bg, padding `16px 24px`,
  right corners `8px`.
- **Admonitions** — VitePress containers (`::: tip|info|warning`), produced by
  the converter from `**Note:** / **Important:** / **Warning:** / **Tip:**`.
- **Links (content)** — brand color, no underline at rest, brand bottom-border
  on hover (`0.2s`).
- **Home feature box** — links to a chapter; rest state uses a low-alpha brand
  border on the card body, hover = brand border + `4px` lift + `0 8px 16px`
  brand-soft shadow. Home page is `user-select: none`.
- **Home common tasks** — short functional link cards after the feature grid.
  No icons or decorative media; use the existing brand-soft surface, `8px`
  radius, `16px` gap, and `16px` padding.
- **Nav / sidebar / footer** — brand-tinted `1px` separators; active + hover
  items brand-colored; sidebar rows may use brand-soft background with `4px`
  radius; DM Sans labels.

## 6. Rules of engagement

1. Spacing on the §1 grid, radius on the §2 scale — no exceptions.
2. No new color outside §4; add a light **and** dark value together.
3. Headings/UI = DM Sans, body = Source Serif, code = JetBrains Mono.
4. Verify light **and** dark after any CSS change.
5. This file leads; `custom.css` follows. Update here first.

# Debian Live Manual (Web)

VitePress-powered web reader for the [Debian Live Manual](https://live-team.pages.debian.net/live-manual/html/live-manual/index.en.html).

## Setup

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # production build
bun run preview  # preview build
bun run convert  # re-run HTML → MD converter
```

## Structure

```
docs/
  index.md              home page (layout: home)
  chapters/             one .md per chapter (18 files)
  .vitepress/
    config.ts           nav, sidebar, search, Debian branding
    theme/
      index.ts          theme entry
      custom.css        CSS overrides (dark sidebar, Debian red)
scripts/
  convert-to-md.ts      Turndown converter (strip sisu cruft → .md)
```

# Changelog tiến độ

Append-only. Mỗi commit lớn → 1 entry.

---

## [0bd4786] Phase 1 — setup

- Tạo `.progress/STATE.md` + `.progress/CHANGELOG.md`
- Mở rộng `.gitignore`: thêm `.agents/`, `.claude/`, `skills-lock.json`, `**/.vitepress/cache/`
- Commit xóa React leftover (`index.html`, `src/*`, `tsconfig.json`, `vite.config.ts`)

## [4a596fc] Phase 2 — Salsa migration

- `docs/index.md`: hero action "View on GitHub" → "View on Salsa"
- `docs/.vitepress/config.ts`: nav text + editLink pattern (`/-/edit/master/`) + socialLinks (custom GitLab SVG icon)
- `scripts/convert-to-md.ts`: cập nhật home-template để regenerate sau không sai

## [pending] Phase 3 — CSS theme fix

- `docs/.vitepress/theme/custom.css`:
  - Tách `--vp-sidebar-bg-color` light (`var(--vp-c-bg-alt)`) vs dark (`#1c1917`)
  - Bỏ hardcode `.VPNav` / `.VPNavBar { background: #1c1917 !important }`
  - Bỏ hardcode color sidebar text + nav title — để VitePress default
  - Scrollbar track + thumb đi theo biến `--ldm-scrollbar-*` (light/dark)
  - Bỏ `!important` không cần thiết
- Build pass (`bun run build`, 7.18s).

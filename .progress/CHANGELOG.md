# Changelog tiến độ

Append-only. Mỗi commit lớn → 1 entry.

---

## [0bd4786] Phase 1 — setup

- Tạo `.progress/STATE.md` + `.progress/CHANGELOG.md`
- Mở rộng `.gitignore`: thêm `.agents/`, `.claude/`, `skills-lock.json`, `**/.vitepress/cache/`
- Commit xóa React leftover (`index.html`, `src/*`, `tsconfig.json`, `vite.config.ts`)

## [pending] Phase 2 — Salsa migration

- `docs/index.md`: hero action "View on GitHub" → "View on Salsa"
- `docs/.vitepress/config.ts`: nav text + editLink pattern (`/-/edit/master/`) + socialLinks (custom GitLab SVG icon)
- `scripts/convert-to-md.ts`: cập nhật home-template để regenerate sau không sai

# Changelog tiến độ

Append-only. Mỗi commit lớn → 1 entry.

---

## [pending] Phase 1 — setup

- Tạo `.progress/STATE.md` + `.progress/CHANGELOG.md`
- Mở rộng `.gitignore`: thêm `.agents/`, `.claude/`, `skills-lock.json`, `**/.vitepress/cache/`
- Commit xóa React leftover (`index.html`, `src/*`, `tsconfig.json`, `vite.config.ts`)

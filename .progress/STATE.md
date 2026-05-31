# Tiến độ sửa live-manual-web

```yaml
phase: 1
phase_name: "setup tracker + clean + gitignore"
current_batch: setup
files_done: []
files_pending:
  - .gitignore
  - .progress/STATE.md
  - .progress/CHANGELOG.md
  - "git rm staged: index.html, src/*, tsconfig.json, vite.config.ts"
last_commit_sha: ""
notes: |
  Phase 1: tạo tracker, mở rộng .gitignore, commit dọn React leftover.
  Tiếp theo: đợt 2 đổi link GitHub→Salsa.
```

## Phase map

| # | Tên                                    | Trạng thái |
|---|----------------------------------------|------------|
| 1 | setup tracker + clean + gitignore      | doing      |
| 2 | migrate GitHub→Salsa links             | todo       |
| 3 | fix CSS sidebar/nav light↔dark         | todo       |
| 4 | fix converter scripts/convert-to-md.ts | todo       |
| 5 | manual cleanup MD chapters (3 batch)   | todo       |
| 6 | polish (TOC, containers) + verify      | todo       |

## File then chốt

- `scripts/convert-to-md.ts` — chỉ sửa ở đợt 4, regenerate xong mới sửa tay đợt 5
- `docs/.vitepress/config.ts` — đợt 2 (link) + đợt 6 (polish)
- `docs/.vitepress/theme/custom.css` — đợt 3
- `docs/chapters/*.md` (18 file) — đợt 5
- `docs/index.md` — đợt 2 (link) + đợt 6 (polish)

## Quy tắc

- Sửa converter TRƯỚC khi sửa tay MD
- Mỗi commit kèm cập nhật STATE.md + append CHANGELOG.md
- Conventional commits
- Không đụng `live-manual-html-extracted/`

# Tiến độ sửa live-manual-web

```yaml
phase: 3
phase_name: "fix CSS sidebar/nav light↔dark"
current_batch: css
files_done:
  - docs/.vitepress/theme/custom.css
files_pending: []
last_commit_sha: "4a596fc"
notes: |
  Phase 3: refactor custom.css. Bỏ hardcode #1c1917 ngoài :root.
  Sidebar bg, scrollbar track giờ theo biến --vp-c-bg-alt (light) / #1c1917 (dark).
  Bỏ !important không cần. Build pass (bun run build).
  Tiếp theo: đợt 4 sửa converter.
```

## Phase map

| # | Tên                                    | Trạng thái |
|---|----------------------------------------|------------|
| 1 | setup tracker + clean + gitignore      | done       |
| 2 | migrate GitHub→Salsa links             | done       |
| 3 | fix CSS sidebar/nav light↔dark         | doing      |
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

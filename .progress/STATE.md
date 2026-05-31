# Tiến độ sửa live-manual-web

```yaml
phase: 2
phase_name: "migrate GitHub→Salsa links"
current_batch: links
files_done:
  - .gitignore
  - .progress/STATE.md
  - .progress/CHANGELOG.md
  - docs/index.md (hero action)
  - docs/.vitepress/config.ts (nav, editLink, socialLinks)
  - scripts/convert-to-md.ts (home template)
files_pending: []
last_commit_sha: "0bd4786"
notes: |
  Phase 1 done. Phase 2: đổi 5 chỗ link sang Salsa. SocialLinks icon dùng SVG GitLab tanuki.
  Tiếp theo: đợt 3 fix CSS sidebar/nav light↔dark.
```

## Phase map

| # | Tên                                    | Trạng thái |
|---|----------------------------------------|------------|
| 1 | setup tracker + clean + gitignore      | done       |
| 2 | migrate GitHub→Salsa links             | doing      |
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

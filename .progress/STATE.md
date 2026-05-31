# Tiến độ sửa live-manual-web

```yaml
phase: 5
phase_name: "post-converter cleanup (mostly handled by phase 4 + 2 follow-ups)"
current_batch: cleanup
files_done:
  - scripts/convert-to-md.ts (2 follow-up fixes)
  - docs/chapters/*.md (regenerated again)
files_pending: []
last_commit_sha: "c86435d"
verify_grep_zeros:
  - "[N](#N) footnotes: 0"
  - "plain N.M heading: 0"
  - "\\# \\_ \\* escape rác: 0"
  - "sisu image arrows: 0"
  - "github.com/debian-live: 0"
notes: |
  Phase 5 cleanup — 2 follow-up fixes vào converter:
  1. Unescape \-- → -- và \- → - (option như --distribution)
  2. Collapse blank line trong code fence (do <NL> ngoài <br> trong HTML gốc)
  Hậu kiểm grep: bare shell line 0, HTML entity 0, suspicious heading 0.
  Build pass 7.48s.
  Tiếp theo: đợt 6 polish (TOC, ::: containers) + verify mắt.
```

## Phase map

| # | Tên                                    | Trạng thái |
|---|----------------------------------------|------------|
| 1 | setup tracker + clean + gitignore      | done       |
| 2 | migrate GitHub→Salsa links             | done       |
| 3 | fix CSS sidebar/nav light↔dark         | done       |
| 4 | fix converter scripts/convert-to-md.ts | done       |
| 5 | manual cleanup MD chapters (3 batch)   | doing      |
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

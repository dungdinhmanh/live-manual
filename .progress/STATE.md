# Tiến độ sửa live-manual-web

```yaml
phase: 6
phase_name: "polish (TOC + admonition containers)"
current_batch: done
files_done:
  - scripts/convert-to-md.ts (promoteAdmonitions + auto-TOC ≥200 lines)
  - docs/chapters/*.md (regenerated với TOC + ::: tip containers)
files_pending: []
last_commit_sha: "0b81618"
verify:
  - "build pass 8.80s"
  - "the-basics.md có [[toc]] + ::: tip Note containers"
  - "admonitions Note/Important/Warning/Tip → tip/info/warning"
notes: |
  Phase 6 polish:
  1. promoteAdmonitions: **Note:** / **Important:** / **Warning:** / **Tip:**
     paragraph đầu dòng → VitePress container (::: tip / ::: info / ::: warning).
  2. TOC_MIN_LINES = 200: chapter dài chèn [[toc]] dưới H1.
  Tiếp theo: verify mắt screenshot light+dark, có thể đợt 7 nếu cần thêm fix.
```

## Phase map

| # | Tên                                    | Trạng thái |
|---|----------------------------------------|------------|
| 1 | setup tracker + clean + gitignore      | done       |
| 2 | migrate GitHub→Salsa links             | done       |
| 3 | fix CSS sidebar/nav light↔dark         | done       |
| 4 | fix converter scripts/convert-to-md.ts | done       |
| 5 | manual cleanup MD chapters (3 batch)   | done       |
| 6 | polish (TOC, containers) + verify      | done       |

## File then chốt

- `scripts/convert-to-md.ts` — đợt 4 rewrite + đợt 5 follow-up + đợt 6 polish
- `docs/.vitepress/config.ts` — đợt 2 (link)
- `docs/.vitepress/theme/custom.css` — đợt 3
- `docs/chapters/*.md` (18 file) — regenerated qua đợt 4→6
- `docs/index.md` — đợt 2 (link)

## Quy tắc

- Sửa converter TRƯỚC khi sửa tay MD
- Mỗi commit kèm cập nhật STATE.md + append CHANGELOG.md
- Conventional commits
- Không đụng `live-manual-html-extracted/`

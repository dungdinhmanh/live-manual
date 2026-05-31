# Tiến độ sửa live-manual-web

```yaml
phase: 4
phase_name: "fix converter scripts/convert-to-md.ts"
current_batch: converter
files_done:
  - scripts/convert-to-md.ts (rewrite)
  - docs/chapters/*.md (18 file, regenerated)
  - docs/index.md (regenerated)
files_pending: []
last_commit_sha: "dab8b0b"
verify_grep_zeros:
  - "[N](#N) footnotes: 0"
  - "plain N.M heading: 0"
  - "\\# \\_ \\* escape rác: 0"
  - "sisu image arrows: 0"
  - "github.com/debian-live: 0"
notes: |
  Converter giờ:
  - strip <label class="ocn"> (footnote)
  - drop dup <h1 class="tiny"> + <h1 class="norm">
  - promote <p class="bold">N.M Title → <h2>/<h3> theo độ sâu dấu chấm
  - <p class="code"> → <pre><code lang=shell> bao code fence
  - tidy pass unescape \_ \# \* ngoài fenced block, collapse blank line
  - rewriteLinks giờ chỉ đụng same-dir .en.html, không phá link external
  - dùng <h1 class="tiny"> làm canonical title (đẹp hơn slug-case)
  Build pass 7.73s.
  Tiếp theo: đợt 5 hậu kiểm + sửa tay (nhưng đợt 4 đã giải quyết hầu hết).
```

## Phase map

| # | Tên                                    | Trạng thái |
|---|----------------------------------------|------------|
| 1 | setup tracker + clean + gitignore      | done       |
| 2 | migrate GitHub→Salsa links             | done       |
| 3 | fix CSS sidebar/nav light↔dark         | done       |
| 4 | fix converter scripts/convert-to-md.ts | doing      |
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

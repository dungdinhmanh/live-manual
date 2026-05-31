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

## [dab8b0b] Phase 3 — CSS theme fix

- `docs/.vitepress/theme/custom.css`:
  - Tách `--vp-sidebar-bg-color` light (`var(--vp-c-bg-alt)`) vs dark (`#1c1917`)
  - Bỏ hardcode `.VPNav` / `.VPNavBar { background: #1c1917 !important }`
  - Bỏ hardcode color sidebar text + nav title — để VitePress default
  - Scrollbar track + thumb đi theo biến `--ldm-scrollbar-*` (light/dark)
  - Bỏ `!important` không cần thiết
- Build pass (`bun run build`, 7.18s).

## [c86435d] Phase 4 — converter rewrite + regenerate

- `scripts/convert-to-md.ts`: viết lại từ đầu để fix tận gốc các lỗi format:
  - Strip `<label class="ocn">` → diệt `[N](#N)` footnote rác
  - Drop dup `<h1 class="tiny">` + `<h1 class="norm">`
  - Promote `<p class="bold">N.M.K Title</p>` → `<h2>` / `<h3>` theo độ sâu
  - Convert `<p class="code">…<br>…</p>` → `<pre><code class="language-shell">`
  - Tidy pass: unescape `\_` `\#` `\*` ngoài fenced code, collapse 3+ blank lines
  - Strip arrow image `_sisu/image_sys/arrow_*_red.png` SiSU nav
  - `rewriteLinks`: chỉ đụng same-dir `.en.html`, giữ nguyên link external
    (vd `https://www.debian.org/.../ch04s05.en.html` không bị wrap `/chapters/`)
  - Title canonical lấy từ `<h1 class="tiny">` section title (đẹp hơn slug)
- Regenerate 18 MD chapter + `docs/index.md` từ HTML SiSU gốc.
- Verify: 0 footnote rác, 0 plain heading, 0 escape rác, 0 sisu image, 0 github link.
- Build pass (`bun run build`, 7.73s).

## [pending] Phase 5 — converter follow-up

- Unescape `\--` → `--` (Turndown đẹp escape long-option như `--distribution`)
- Strip nested newlines + collapse blank line trong fenced code block (do HTML gốc đặt
  `<NL>` quanh `<br>` trong `<p class="code">`)
- Regenerate. Build pass 7.48s.

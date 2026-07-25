# Design System

## Color tokens

**Base (locked from the original brief, unchanged):**

| Token | Hex | Role |
|---|---|---|
| Background | `#0D1117` | Page / canvas base |
| Surface | `#111827` | Cards, glass panels |
| Primary | `#2563EB` | Key accent, strokes |
| Secondary | `#38BDF8` | Glow, gradients |
| Text | `#FFFFFF` | Headings |
| Muted Text | `#94A3B8` | Secondary copy |
| Border | `#1E293B` | Hairlines |

**v1.1 extension** (added this pass, in response to the color-scheme feedback — additive, nothing above was removed or changed):

| Token | Hex | Role |
|---|---|---|
| Accent Deep | `#1E3A8A` | Gradient depth anchor — the flat 2-stop Primary→Secondary border read a little thin; this adds a darker indigo anchor so borders/glows have a visible near→far gradient instead of a single blend |
| Accent Bright | `#22D3EE` | Highlight — used for CTA text/arrows and the icon-chip glow, so interactive elements read as a shade brighter than static ones |

Applied so far to: all 5 project cards, the stats card. Not yet applied to the hero banner, badges, or effect layers — those still use the original 2-stop gradient. Say the word if you want the v1.1 gradient rolled out system-wide; it's a bounded change (one gradient definition per file) rather than a rebuild.

## Spacing

Every glass card in the system now shares one spacing rhythm: **22px inner padding**, **16px** between unrelated blocks (icon → title, tags → CTA), **10–14px** between related lines (title → description, description → tags). The project cards previously had ad hoc gaps hand-picked per element; this pass replaced that with a single generator (`/home/claude` build scripts) so every card's vertical rhythm is computed the same way instead of eyeballed per file.

## Accessibility

- Every SVG has a `<title>` and `<desc>`, and the root element carries `role="img" aria-labelledby="title desc"`.
- Every `<img>` in `README.md` has real, specific `alt` text — none are empty or generic ("image", "svg").
- Contrast: body text is `#94A3B8` on backgrounds at or near `#0D1117`/`#111827`, which sits comfortably above WCAG AA (4.5:1) for normal text; headings are `#FFFFFF` on the same backgrounds, far above AA. Nothing in the system relies on color alone to convey information (tech tags and stats also carry text labels).
- Decorative-only images (the two `divider.svg` uses between sections) use `alt=""` deliberately, so screen readers skip them instead of reading a meaningless label.

## SVG size

18 files, **140KB total** — for context, that's smaller than a single unoptimized photo. The two largest are `banner.svg` (13KB, the animated hero) and `particles.svg` (11.6KB, 30 independently-animated particles); both are already at 1-decimal coordinate precision with no redundant nodes. Nothing here needed shrinking enough to justify a rewrite — the badges and cards average 1.5–7KB each.

## Animation performance

Everything animates via native SMIL (`<animate>` / `<animateTransform>`), which is GPU/compositor-friendly in every current browser and requires zero JavaScript. Filters are the one thing that costs real render time — `feGaussianBlur` and `feTurbulence` are more expensive than plain shape animation — so the system deliberately: uses blur only on glow/ambient layers (never on the 30-particle field, which is why those particles are plain filter-free circles), and keeps grain/noise opacity at 3-6% so it can stay cheap and low-resolution without looking flat.

## Duplication

Within a single file, shared values (colors, filters, text styles) are defined once in `<defs>`/`<style>` and referenced by `url(#id)` or class — there's no repeated gradient or filter markup inside any one file. *Across* files, the same gradient/filter recipes are intentionally copy-pasted rather than shared live: an SVG referencing another file (`<use href="other.svg#id">`) doesn't reliably resolve once the parent is loaded via `<img>` on GitHub, so cross-file duplication here is the price of every asset working standalone. Documented in `docs/README-INTEGRATION.md` rather than "fixed," since fixing it would mean breaking GitHub compatibility.

## GitHub-compatibility checklist

- [x] No inline `<svg>` in `README.md` — everything is a file, referenced via `<img>`
- [x] No inline `style="..."` attributes anywhere in `README.md` (GitHub strips them) — layout uses `align`, `width`, `height` only
- [x] No external font loads (`@font-face` / Google Fonts) — system font stack only, for consistent rendering
- [x] No client-side JavaScript anywhere — animation is SMIL, stats refresh is server-side (GitHub Actions), not browser JS
- [x] No third-party badge/generator services (shields.io, readme-stats, etc.) — every visual is hand-built
- [x] Case-correct, repo-relative asset paths throughout

## Folder structure

```
github-profile/
├── assets/
│   ├── core/           banner.svg, logo.svg
│   ├── effects/        background.svg, particles.svg, glow.svg
│   ├── components/     divider.svg, wave.svg, profile-frame.svg
│   ├── badges/         github/linkedin/email/portfolio-badge.svg
│   ├── cards/           5 project cards
│   └── stats/           stats-card.svg (auto-updated)
├── .github/workflows/   update-stats.yml
├── scripts/             generate-stats-card.js
├── docs/                this file, INSTALLATION.md, README-INTEGRATION.md
├── README.md
└── LICENSE
```

`.github/` and `scripts/` weren't in the folder sketch you gave, but the live-updating stats card you asked for needs somewhere to run from — they're the minimum required for that to actually work, not scope creep for its own sake.

## Still open

- `profile-frame.svg` exists but isn't used in `README.md` — no confirmed profile photo yet.
- Portfolio, Weather App, and Currency Converter tech tags are inferred from your general stack, not confirmed per-project.

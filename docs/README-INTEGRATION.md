# README Integration

How the pieces are wired into `README.md`, and how to reuse them elsewhere.

## The core pattern

Every custom visual (banner, logo, badges, project cards) is a standalone `.svg` file. GitHub's markdown sanitizer strips raw `<svg>` markup typed directly into a README, so nothing here is ever inlined — everything is referenced with a plain `<img>`, optionally wrapped in `<a>` for click-through:

```html
<img src="assets/core/banner.svg" width="100%" alt="..." />

<a href="https://github.com/DaniyalAsif7778">
  <img src="assets/badges/github-badge.svg" height="40" alt="GitHub" />
</a>
```

This is also why the animations keep running on GitHub: they're native SMIL (`<animate>`, `<animateTransform>`) baked into each file, not JavaScript — GitHub would strip a `<script>` tag, but it renders the SVG's own animation exactly as authored.

The GitHub Stats section works differently on purpose — see "Live stats" below.

## Live stats

By request, stats are **not** custom SVG — they're standard `<img>` tags pointing at third-party rendering services, the same ones used across most GitHub profile READMEs:

- `github-readme-stats.vercel.app` — stats card + top languages
- `streak-stats.demolab.com` — commit streak
- `github-readme-activity-graph.vercel.app` — contribution activity graph

Each service takes your username and a handful of hex color params in the URL query string and renders a fresh SVG server-side on every page load — that's what makes them "live" without any workflow or token on your side. The color params (`bg_color`, `title_color`, `text_color`, etc.) are set to this project's palette so they sit reasonably close to the custom sections, though these services only expose flat colors, not glassmorphism/gradients — a visual step down from the hand-built cards, which is the trade-off for zero maintenance.

## Centering & layout

GitHub's HTML sanitizer allows `<div align="center">`, `<img width/height/alt>`, and `<a href>` — but strips inline `style="..."` attributes. That's why every layout choice here uses `align`, `width`, and plain block flow instead of CSS.

**Project cards are single-column (`width="100%"`), stacked**, not a side-by-side grid. A 2-up grid using `width="47%"` looks fine on desktop but shrinks each content-dense card to roughly 180px wide on a phone — too small to read the description and tags. A `<table>`-based grid would keep native card width and let mobile scroll horizontally instead, but GitHub renders default borders/stripes on tables that can't be turned off without `style=` (which is stripped), and that clashes with the glass-card look. Single column was the option that stays legible everywhere without introducing visual chrome that doesn't match the rest of the system.

## Adding a new project card

1. Follow the layout in `docs/DESIGN-SYSTEM.md` (canvas size, padding, gradient, tag-row pattern).
2. Add it to the Featured Projects block in `README.md` as another `<a href="..."><img width="100%" .../></a>` pair, separated by `<br/><br/>`.

## Swapping a link later

Every clickable element's URL lives in `README.md`, not in the SVG (SVGs loaded via `<img>` can't carry working links themselves). To change where a badge or card points, edit the `href` in `README.md` only — the asset file doesn't need to change.

## Reusing components in another project

Cross-file SVG references (`<use href="other.svg#id">`) don't reliably resolve once a parent SVG is loaded via `<img>` on GitHub, so there's no live import between files. To reuse a gradient, filter, or pattern from this system elsewhere, copy the relevant block from that file's own `<defs>` — every id in this project is written to be copy-paste portable for exactly this reason.

## Troubleshooting

- **Image shows as a broken icon:** check the path is relative to the repo root and case-correct (`assets/core/banner.svg`, not `Assets/Core/Banner.svg` — GitHub's file hosting is case-sensitive even if your local filesystem isn't).
- **Animation isn't playing:** confirm you're viewing the actual GitHub-rendered page, not a raw file preview — some raw/CDN preview modes don't execute SMIL.
- **A stats image is broken:** that's the third-party service, not this repo — check `githubstatus.com`-style status pages for the relevant service, or just reload; these are free public services and occasionally have hiccups.
- **Banner text still looks small:** confirm you're looking at the *rendered* README on `github.com/<username>`, not a locally embedded preview at a fixed small width — the SVG is designed to stay legible down to ~375px container width, but an even narrower embed (e.g. a tiny iframe) will still shrink it further, same as any image would.

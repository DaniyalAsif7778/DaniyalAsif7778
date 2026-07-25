# README Integration

How the pieces are wired into `README.md`, and how to reuse them elsewhere.

## The core pattern

Every visual in this system is a standalone `.svg` file. GitHub's markdown sanitizer strips raw `<svg>` markup typed directly into a README, so nothing here is ever inlined — everything is referenced with a plain `<img>`, optionally wrapped in `<a>` for click-through:

```html
<img src="assets/core/banner.svg" width="100%" alt="..." />

<a href="https://github.com/DaniyalAsif7778">
  <img src="assets/badges/github-badge.svg" height="40" alt="GitHub" />
</a>
```

This is also why the animations keep running on GitHub: they're native SMIL (`<animate>`, `<animateTransform>`) baked into each file, not JavaScript — GitHub would strip a `<script>` tag, but it renders the SVG's own animation exactly as authored.

## Centering & layout

GitHub's HTML sanitizer allows `<div align="center">`, `<img width/height/alt>`, and `<a href>` — but strips inline `style="..."` attributes. That's why every layout choice here uses `align`, `width`, and plain block flow instead of CSS. Multi-card rows use `width="47%"` side by side with `&nbsp;` as a spacer, which wraps naturally on narrow viewports (GitHub mobile) without needing flexbox/grid.

## Adding a new project card

1. Duplicate the pattern in `assets/cards/` (see `docs/DESIGN-SYSTEM.md` for the token set).
2. Add it to the Featured Projects block in `README.md`, following the existing `<a href="..."><img .../></a>` pairs.
3. If you're re-running the generator script style used for the current 5 cards, keep all cards on the same canvas height so the grid stays visually even — see the layout logic notes in `docs/DESIGN-SYSTEM.md`.

## Swapping a link later

Every clickable element's URL lives in `README.md`, not in the SVG (SVGs loaded via `<img>` can't carry working links themselves). To change where a badge or card points, edit the `href` in `README.md` only — the asset file doesn't need to change.

## Reusing components in another project

Cross-file SVG references (`<use href="other.svg#id">`) don't reliably resolve once a parent SVG is loaded via `<img>` on GitHub, so there's no live import between files. To reuse a gradient, filter, or pattern from this system elsewhere, copy the relevant block from that file's own `<defs>` — every id in this project is written to be copy-paste portable for exactly this reason.

## Troubleshooting

- **Image shows as a broken icon:** check the path is relative to the repo root and case-correct (`assets/core/banner.svg`, not `Assets/Core/Banner.svg` — GitHub's file hosting is case-sensitive even if your local filesystem isn't).
- **Animation isn't playing:** confirm you're viewing the actual GitHub-rendered page, not a raw file preview — some raw/CDN preview modes don't execute SMIL.
- **Stats card looks stale:** the Action runs daily; trigger it manually from the Actions tab if you need it sooner (see `docs/INSTALLATION.md`).

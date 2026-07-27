# Installation

## 1. Create the special profile repository

GitHub only renders a profile README from a repo named **exactly** after your username:

```
DaniyalAsif7778/DaniyalAsif7778
```

If it doesn't exist yet, create it on GitHub as a **public** repo with that exact name.

## 2. Push this folder's contents to it

```bash
git clone https://github.com/DaniyalAsif7778/DaniyalAsif7778.git
cd DaniyalAsif7778
# copy everything from this github-profile/ folder in here, then:
git add .
git commit -m "Add premium SVG design system profile"
git push
```

The repo root should end up looking like:

```
DaniyalAsif7778/
├── assets/
├── README.md
├── LICENSE
└── docs/
```

## 3. Stats — nothing to configure

GitHub Stats, Top Languages, Streak, and the Activity Graph are all pulled live from third-party rendering services (`github-readme-stats`, `github-readme-streak-stats`, `github-readme-activity-graph`) directly in `README.md`. There's no workflow, token, or build step — the images are just URLs, and each service regenerates the SVG on every request using your live public GitHub data. As soon as the README is pushed, they work.

If any of them ever go down (they're free, community-run services, so occasional downtime happens), the `<img>` just fails to load — nothing else in the README breaks, and reloading later resolves it.

## 4. Verify

Visit `https://github.com/DaniyalAsif7778` — the hero banner, badges, stats, and project cards should all render. If an image shows as a broken icon instead, see the troubleshooting note in `docs/README-INTEGRATION.md`.

## Requirements

None. Every local asset is a plain `.svg` file, and the live stats are external image URLs — there's no build step, no dependencies, and nothing to install to use this repo as-is.

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

## 3. Generate the stats cards (one-time)

Stats now come from a GitHub Action that runs inside this repo — not a public third-party service — because the public `github-readme-stats` / streak / activity-graph instances turned out to be unreliable (a widely-reported, ongoing problem with those free shared deployments, confirmed across dozens of open issues on their repos).

Once you've pushed this repo:

1. Go to the **Actions** tab → **GitHub Profile Summary Cards** → **Run workflow**.
2. Wait for it to finish (usually under a minute) — it commits SVGs into `profile-summary-card-output/github_dark_dimmed/`.
3. Refresh your profile page. `README.md` already points at those paths.

It also re-runs automatically once a day, so the numbers stay current without you doing anything after this first run.

**If a filename doesn't match:** the action's exact output filenames can shift between versions. If an image shows broken after the first run, open `profile-summary-card-output/github_dark_dimmed/` in the repo, check the actual filenames there, and adjust the three `<img src="profile-summary-card-output/...">` paths in `README.md` to match — should only ever be a path tweak, not a redesign.

## 4. Verify

Visit `https://github.com/DaniyalAsif7778` — the hero banner, badges, stats, and project cards should all render. If an image shows as a broken icon instead, see the troubleshooting note in `docs/README-INTEGRATION.md`.

## Requirements

No local build step — every visual asset is a plain `.svg` file. The one thing that needs a manual trigger is the stats workflow's first run (step 3 above); after that it's fully automatic.

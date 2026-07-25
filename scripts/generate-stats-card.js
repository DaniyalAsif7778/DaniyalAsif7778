/**
 * generate-stats-card.js
 *
 * Fetches live public stats for GITHUB_USERNAME from the GitHub REST API
 * and renders assets/stats/stats-card.svg in the same glass/gradient style
 * as the rest of the design system. Run by .github/workflows/update-stats.yml
 * on a schedule, so the committed SVG always reflects real numbers — no
 * client-side JS runs in the README itself, GitHub would strip it anyway.
 *
 * Usage: node scripts/generate-stats-card.js
 * Env:   GITHUB_USERNAME (required), GITHUB_TOKEN (optional but recommended
 *        — raises the API rate limit from 60/hr to 5,000/hr)
 */

const fs = require("fs");
const path = require("path");

const USERNAME = process.env.GITHUB_USERNAME || "DaniyalAsif7778";
const TOKEN = process.env.GITHUB_TOKEN || "";
const OUT_PATH = path.join(__dirname, "..", "assets", "stats", "stats-card.svg");

async function fetchUser() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`, {
    headers: {
      "Accept": "application/vnd.github+json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function renderCard({ public_repos, followers, following }) {
  const stats = [
    { value: public_repos, label: "REPOSITORIES" },
    { value: followers, label: "FOLLOWERS" },
    { value: following, label: "FOLLOWING" },
  ];

  const colW = 680 / 3;
  const columns = stats
    .map((s, i) => {
      const cx = Math.round((60 + colW * i + colW / 2) * 10) / 10;
      return `
  <text x="${cx}" y="118" text-anchor="middle" class="stat-value">${s.value}</text>
  <text x="${cx}" y="146" text-anchor="middle" class="stat-label">${s.label}</text>`;
    })
    .join("");

  const dividers = [1, 2]
    .map((i) => {
      const x = Math.round((60 + colW * i) * 10) / 10;
      return `<line x1="${x}" y1="70" x2="${x}" y2="150" stroke="#1E293B" stroke-width="1" opacity="0.6"/>`;
    })
    .join("\n  ");

  return `<svg width="800" height="220" viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">GitHub Stats — ${USERNAME}</title>
  <desc id="desc">Live public GitHub stats for ${USERNAME}: ${public_repos} repositories, ${followers} followers, ${following} following. Auto-updated by a scheduled GitHub Action.</desc>

  <defs>
    <clipPath id="cardClip"><rect x="20" y="20" width="760" height="180" rx="20"/></clipPath>
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="55%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dotTexture" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#94A3B8"/>
    </pattern>
    <filter id="cardGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <style>
      .stat-value { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 40px; fill: #FFFFFF; }
      .stat-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; fill: #94A3B8; }
      .card-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 2px; fill: #64748B; }
    </style>
  </defs>

  <rect x="20" y="20" width="760" height="180" rx="20" fill="none" stroke="#2563EB" stroke-opacity="0.3" stroke-width="2" filter="url(#cardGlow)"/>
  <rect x="20" y="20" width="760" height="180" rx="20" fill="#111827" fill-opacity="0.55" stroke="url(#cardBorder)" stroke-width="1.5"/>
  <rect x="20" y="20" width="760" height="180" fill="url(#dotTexture)" opacity="0.05" clip-path="url(#cardClip)"/>
  <rect x="20" y="20" width="760" height="70" fill="url(#sheen)" clip-path="url(#cardClip)"/>

  <text x="42" y="46" class="card-label">GITHUB STATS · LIVE</text>

  ${dividers}
  ${columns}
</svg>
`;
}

async function main() {
  const user = await fetchUser();
  const svg = renderCard(user);
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, svg);
  console.log(
    `Wrote ${OUT_PATH} — repos=${user.public_repos} followers=${user.followers} following=${user.following}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

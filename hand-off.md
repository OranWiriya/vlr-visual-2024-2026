# Hand-off — The Meta Never Sleeps

_Last updated: November 10, 2026_

## Status

The site is complete: the production build passes and the linter reports zero findings.

```bash
npm run build   # tsc -b && vite build
npm run lint    # oxlint — clean
```

Latest verified build output: `dist/index.html` plus hashed assets in `dist/assets/`.

A dev server was used for visual verification at desktop (`1440px`) and mobile (`390px`) widths. It may still be running on port `5199`; stop it when done.

---

## What the story is

**Title:** The Meta Never Sleeps  
**Subtitle:** Three patches. Three dead agents. One constant.  
**Thesis:** The biggest swings in the professional Valorant agent meta did not happen gradually. They arrived on patch day — and the teams that adapted fastest won.

### Seven chapters

1. **Cold open — Santiago, March 2026.** Yoru and Viper tie at 62%. Two days after the event, Patch 12.05 lands. Yoru falls to 1% in Stage 1 while Neon rises from 45% to 79%.
2. **Tejo — Patch 10.09.** 56% at Masters Bangkok 2025 → 4% at Masters Toronto 2025.
3. **Yoru — Patch 12.05.** 8–11% in 2024 → 46% Bangkok → 53% Champions 2025 → 62% Santiago → 1% at Stage 1 and London.
4. **Neon — Stage 1 2026.** 78% Americas, 80% China, 83% EMEA, 76% Pacific; 79% average across 442 maps.
5. **London — Patch 12.09.** Neon 32%; Jett 44%, Raze 38%, Phoenix 33%; Waylay 15%.
6. **The constants.** Omen 54–82%, Viper 35–78%, Sova 25–53% across the eight international events.
7. **Patch 13.00.** Released June 23, 2026, two days after London. Sentinel buffs and Initiator cooldown cuts. It sits outside the dataset; the chapter is framed as “after the data,” not a forecast.

### Key numbers

| Event | Tejo | Yoru | Neon | Omen | Viper | Sova |
|---|---:|---:|---:|---:|---:|---:|
| Masters Madrid 2024 | 0% | 11% | 4% | 68% | 78% | 33% |
| Masters Shanghai 2024 | 0% | 9% | 0% | 64% | 66% | 38% |
| Champions 2024 | 0% | 8% | 22% | 62% | 50% | 52% |
| Masters Bangkok 2025 | 56% | 46% | 8% | 54% | 36% | 25% |
| Masters Toronto 2025 | 4% | 31% | 25% | 82% | 64% | 53% |
| Champions 2025 | 9% | 53% | 22% | 80% | 43% | 53% |
| Masters Santiago 2026 | 8% | 62% | 45% | 56% | 62% | 50% |
| Stage 1 2026 (regional) | 7% | 1% | 79% | 52% | 44% | 31% |
| Masters London 2026 | 4% | 1% | 32% | 63% | 35% | 37% |

---

## Architecture

### App shell

- `src/main.tsx` — React root and self-hosted font imports.
- `src/App.tsx` — composes the header, hero, three-cliff band, seven chapters, and footer.
- `src/index.css` — Tailwind v4 theme, paper/ink palette, Newsreader + Inter font stacks, focus styles, reduced-motion overrides.
- `index.html` — title, description, theme color, favicon.
- `public/favicon.svg` — custom red line-chart mark on paper.

### Layout and editorial components

- `src/components/Header.tsx` — sticky header, section links, scroll-progress bar.
- `src/components/Hero.tsx` — title, deck, full-width overview line chart.
- `src/components/StatCards.tsx` — the three cliffs: Tejo, Yoru, Neon.
- `src/components/Chapter.tsx` — shared chapter layout; supports `reverse` and `stacked`.
- `src/components/PullQuote.tsx` — editorial pull quote.
- `src/components/Reveal.tsx` — IntersectionObserver reveal wrapper.
- `src/components/Footer.tsx` — methodology, limits, full data table, sources, colophon, disclaimer.
- `src/components/PatchTimeline.tsx` — 10.09, 12.05, 12.09, 13.00 patch cards.

### Charts

- `src/components/charts/LineChart.tsx` — multi-line time series with patch markers, callouts, regional snapshot marker, end labels, optional area fill.
- `src/components/charts/SlopeChart.tsx` — before/after slope chart; used for the cold open, Tejo, and the London duelist pool.
- `src/components/charts/DuelistShiftChart.tsx` — wrapper using `duelistShift` data.
- `src/components/charts/RegionalBars.tsx` — Neon pick rate by region in Stage 1 2026.
- `src/components/charts/ConstantsChart.tsx` — Omen/Viper/Sova range plot across eight events.

### Data and hooks

- `src/lib/story.ts` — typed data, agent colors, patches, timeline, `duelistShift`, `stage1Regions`, `constants`.
- `src/lib/useInView.ts` — `useInView` and `useReducedMotion`.
- `src/data/story.json` — generated payload consumed by the app.
- `data/processed/story-data.json` — generated analysis output.

---

## Data pipeline

### Locations

- `data/zips/` — source archives (`vct_2024.zip`, `vct_2025.zip`, `vct_2026.zip`). ~9.1 MB total.
- `data/raw/vct_2024/`, `data/raw/vct_2025/`, `data/raw/vct_2026/` — extracted CSVs. ~134 MB total. Git-ignored.
- `data/processed/story-data.json` — analysis output.
- `src/data/story.json` — app-facing payload.

### Commands

```bash
npm run data:process   # node scripts/story-stats.mjs
```

The script writes both JSON files.

### Important note about the original zips

The zips were originally dropped in `dist/vct-datas/`. Because `dist/` is Vite's build output and `vite build` empties it, they were removed by a production build. They were reconstructed from `data/raw/` into `data/zips/` and are now safe there. Do not put source data back in `dist/`.

### Pipeline scripts

- `scripts/inspect-data.mjs` — raw data tree/profile.
- `scripts/explore.mjs` — tournament and pick-rate exploration.
- `scripts/eda.mjs` — event overview, HHI, top-agent trajectories.
- `scripts/eda-yoru.mjs` — Yoru/agent win-rate analysis.
- `scripts/eda-quality.mjs` — event integrity checks and 2026 Stage 1 inspection.
- `scripts/eda-2026.mjs` — 2026 chronology and regional breakdown.
- `scripts/reconstruct.mjs` — reconstructs London agent rates from `overview.csv`.
- `scripts/story-stats.mjs` — final aggregation and JSON output.

`scripts/shot.mjs` is a local Chrome DevTools screenshot helper used for visual verification. It is not part of the site and can be deleted, along with `.shots/`.

---

## Method and caveats

### Pick-rate definition

`pick rate = picks ÷ (2 × maps)`

This is the share of team slots an agent occupied. The source's `Pick Rate` column uses the same definition; values sum to roughly 500% per event because each map has ten player slots.

### Events

Eight international events:

- Masters Madrid 2024
- Masters Shanghai 2024
- Champions 2024
- Masters Bangkok 2025
- Masters Toronto 2025
- Champions 2025
- Masters Santiago 2026
- Masters London 2026

Plus the **2026 Stage 1** regional snapshot, a map-weighted average of Americas, China, EMEA, and Pacific (442 maps). It is explicitly labeled as a regional aggregate, not an international event.

### London reconstruction

Masters London has no event-level agent aggregate in the bundle. Its rates are reconstructed from per-player `Agents` rows in `matches/overview.csv`. The same reconstruction applied to Santiago reproduced the official aggregate within about one point. London values are labeled as reconstructed throughout.

### 2026 chronology

Kickoff → Masters Santiago → Stage 1 → Masters London. The 2026 bundle ends at Masters London; Stage 2 and Champions 2026 are not included.

### Patch 13.00

Patch 13.00 released on **June 23, 2026**, two days after Masters London ended. It included Sentinel buffs (Cypher, Killjoy, Veto, Sage, Deadlock), Initiator signature cooldowns cut from 60s to 50s (Sova, Fade, Skye, Breach, KAY/O), and the new map Summit. Its competitive effect is outside the dataset, so the final chapter is framed as “after the data,” not a prediction.

### Limits

- Patch dates are release dates; the dataset has no match-level patch tag. Before/after comparisons are event-to-event and other meta changes may contribute.
- Pick rate measures popularity, not effectiveness.
- Event samples range from 43 to 88 maps; one map is worth roughly 1–2 percentage points.
- The 2026 bundle ends at London.

---

## Design decisions

- Light editorial palette: paper `#f7f5ef`, ink `#141311`, muted `#6f6a60`, accent red `#d7263d`.
- Serif display type: Newsreader Variable. Sans body/UI: Inter Variable. Both self-hosted via Fontsource.
- No illustrations; charts, typography, rules, and whitespace only.
- Agent colors are defined in `src/lib/story.ts` and reused across charts and stat cards.
- Charts are inline SVG via D3 scales/paths. No chart library.
- Reveal animations use IntersectionObserver and are disabled by `prefers-reduced-motion`.
- Charts have `role="img"` and descriptive `aria-label`s. The footer contains the full data table as an accessible alternative.
- Wide charts scroll horizontally inside their own containers; mobile-only swipe hints were added.
- `min-w-0` is applied to grid items and chart wrappers to prevent horizontal page overflow on mobile.

---

## Verification performed

- `npm run build` passes (TypeScript + Vite).
- `npm run lint` passes with no warnings (Oxlint).
- Desktop visual checks at 1440px: hero, chapters 1–7, stat cards, methodology, sources, full table.
- Mobile visual checks at 390px: hero, chapter 5, footer. `document.documentElement.scrollWidth === clientWidth` (no page-level horizontal overflow).
- Reduced-motion behavior: `useReducedMotion` initializes from `matchMedia` and the CSS override disables transitions.
- Keyboard access: skip link, sticky nav links, stat-card links, source links, table.
- Data table and chart aria-labels provide non-visual access to the numbers.
- Patch notes for 10.09, 12.05, 12.09, and 13.00 were checked against Riot's pages.
- Riot dev video quote source verified: “Inside the patch: Neon and shotguns explained” (May 7, 2026).

---

## Recommended next steps

1. Decide whether to keep `scripts/shot.mjs` and `.shots/` (both are verification-only; `.shots/` is git-ignored). They are currently kept for repeat visual checks.
2. Add Open Graph/Twitter card metadata and a social preview image if deploying.
3. Deploy `dist/` to a static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
4. If the story is updated, re-run `npm run data:process` and re-check the generated numbers in `src/data/story.json`.
5. Optionally add a small “download the processed data” link to `data/processed/story-data.json` if the host serves it.

---

## Commands

```bash
npm install
npm run dev          # local dev server
npm run build        # tsc -b && vite build
npm run preview      # preview production build
npm run data:process # regenerate story JSON from data/raw
npm run lint         # oxlint
```

---

## Sources

- VLR.gg match data, accessed through the VCT dataset compiled by Ryan Luong on Kaggle (MIT License)
- Riot Games patch notes: 10.09, 12.05, 12.09, 13.00
- Riot Games, “Inside the patch: Neon and shotguns explained” (May 7, 2026)
- Liquipedia, Patch 12.09
- Hotspawn, “How Patch 12.09 Rewrote The Meta At The Swiss Stage” (June 12, 2026)
- TheSpike, “Tejo's rise and fall” (June 26, 2025)

## Disclaimer

This is an independent, non-commercial data story. It is not affiliated with, endorsed by, or sponsored by Riot Games. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc.

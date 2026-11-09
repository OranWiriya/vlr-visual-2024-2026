# vlr-visual-2024-2026 — The Meta Never Sleeps

Three patches. Three dead agents. One constant.

A scrollytelling data story about how Valorant balance patches reshaped the professional agent meta from 2024 to 2026.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- D3 for chart scales and paths
- Self-hosted Newsreader and Inter via Fontsource

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Data pipeline

The yearly VCT bundles live in `data/zips/`. Extract them into `data/raw/` before processing:

```bash
mkdir -p data/raw/vct_2024 data/raw/vct_2025 data/raw/vct_2026
unzip data/zips/vct_2024.zip -d data/raw/vct_2024
unzip data/zips/vct_2025.zip -d data/raw/vct_2025
unzip data/zips/vct_2026.zip -d data/raw/vct_2026
npm run data:process
```

`npm run data:process` reads the raw CSVs and writes:

- `data/processed/story-data.json` — the analysis output
- `src/data/story.json` — the typed payload consumed by the app

Raw CSVs and the zip bundles are not part of the deployed site.

> `dist/` is Vite's build output. Do not place source data there; a production build empties the folder.

## Method

- Pick rate is the share of team slots an agent occupied: picks ÷ (2 × maps). A value of 100% means the agent was picked by both teams on every map.
- Eight international events are included: Masters Madrid 2024, Masters Shanghai 2024, Champions 2024, Masters Bangkok 2025, Masters Toronto 2025, Champions 2025, Masters Santiago 2026, and Masters London 2026.
- The 2026 Stage 1 figure is a map-weighted average of the four regional leagues (Americas, China, EMEA, Pacific), not an international event.
- Masters London has no event-level agent aggregate in the bundle, so its rates are reconstructed from per-player rows in `matches/overview.csv`. The same reconstruction reproduces Santiago's official aggregate within about one point.
- Patch dates come from Riot's patch notes. The 2026 bundle ends at London; Stage 2, Champions 2026, and the competitive effect of Patch 13.00 are outside the dataset.

## Sources

- VLR.gg match data, accessed through the VCT dataset compiled by Ryan Luong on Kaggle (MIT License)
- Riot Games patch notes: 10.09, 12.05, 12.09, 13.00
- Riot Games, “Inside the patch: Neon and shotguns explained” (May 7, 2026)
- Liquipedia, Patch 12.09
- Hotspawn, “How Patch 12.09 Rewrote The Meta At The Swiss Stage” (June 12, 2026)
- TheSpike, “Tejo's rise and fall” (June 26, 2025)

## Disclaimer

This is an independent, non-commercial data story. It is not affiliated with, endorsed by, or sponsored by Riot Games. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc.

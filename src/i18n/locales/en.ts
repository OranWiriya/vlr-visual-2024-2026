import type { Translations } from '../types'

export const en: Translations = {
  meta: {
    title: 'The Meta Never Sleeps — A Valorant Data Story',
    description:
      'Three patches. Three dead agents. One constant. A data story about how balance patches reshaped the professional Valorant agent meta from 2024 to 2026.',
  },
  nav: {
    skipToStory: 'Skip to story',
    siteTitle: 'The Meta Never Sleeps',
    cliffs: 'The cliffs',
    constants: 'The constants',
    methodology: 'Methodology',
    langSwitchLabel: 'Switch language',
  },
  hero: {
    eyebrow: 'A VALORANT esports data story · 2024–2026',
    titlePart1: 'The Meta',
    titlePart2: 'Never Sleeps',
    subtitle: 'Three patches. Three dead agents. One constant.',
    description:
      'Between Masters Madrid 2024 and Masters London 2026, professional Valorant played through eight international events and dozens of balance patches. The biggest shifts in who gets picked did not come from slow tactical evolution. They arrived on patch day.',
    cta: 'Start with the three cliffs',
    chartCaption:
      'Pick rate is the share of team slots an agent occupies: picks ÷ (2 × maps). Red lines mark the three balance patches in the story. The hollow dot is the 2026 Stage 1 regional snapshot, not an international event.',
    chartAria:
      'Line chart of Tejo, Yoru, Neon, and Omen pick rates across eight international Valorant events from 2024 to 2026, plus the 2026 Stage 1 regional snapshot. Tejo peaks at 56 percent in Bangkok 2025 and falls to 4 percent after patch 10.09. Yoru peaks at 62 percent in Santiago 2026 and falls to 1 percent after patch 12.05. Neon peaks at 79 percent in Stage 1 2026 and falls to 32 percent at London after patch 12.09. Omen stays between 54 and 82 percent throughout.',
  },
  statCards: {
    eyebrow: 'The three cliffs',
    sub: 'Pick rate · share of team slots',
    patchPrefix: 'Patch',
    readChapterAria: (agent, before, from, after, to) =>
      `Read the ${agent} chapter: ${before} percent at ${from} to ${after} percent at ${to}`,
  },
  chapters: {
    c1: {
      kicker: 'Santiago · March 2026',
      title: 'The best agent in the world was on borrowed time.',
      p1: 'Santiago was Yoru’s tournament. The duelist occupied 62% of team slots, level with Viper at the top of the table. Omen sat at 56%. The meta looked settled.',
      p2: 'Two days after the event ended, Riot shipped Patch 12.05. By the time Stage 1 was underway in April, Yoru was at 1%. Not because teams had solved him. Because the patch had.',
      p3: 'A meta can look permanent right up until it isn’t. The 2024–2026 record shows the same pattern three times: one agent rises to dominance, one patch answers, and the pick rate falls off a cliff.',
      leftLabel: 'Masters Santiago 2026',
      rightLabel: 'Stage 1 2026',
      leftSub: 'Official aggregate · 59 maps',
      rightSub: 'Four-region aggregate · 442 maps',
      patchTitle: 'Yoru nerf',
      patchDate: 'Mar 17, 2026',
      caption:
        'Pick rate as a share of team slots. Patch 12.05 shipped on March 17, 2026, between Santiago and Stage 1. Stage 1 is a four-region aggregate, not an international event.',
      aria: (yoruBefore, yoruAfter, neonBefore, neonAfter) =>
        `Yoru fell from ${yoruBefore} percent at Masters Santiago 2026 to ${yoruAfter} percent in the 2026 Stage 1 regional snapshot, while Neon rose from ${neonBefore} percent to ${neonAfter} percent.`,
    },
    c2: {
      kicker: 'Patch 10.09 · May 13, 2025',
      title: 'Tejo was a warning.',
      p1: 'Tejo arrived in January 2025 and broke the initiator market almost immediately. At Masters Bangkok in March, he was the most-picked agent in the world: 56% of team slots, ahead of Omen, Yoru, and Viper. The defining composition — Breach, Omen, Viper, Yoru, Tejo — was run seven times and won six of them.',
      p2: 'Riot’s answer was Patch 10.09: Guided Salvo lost its cooldown and picked up a charge system, the drone cost more, and Armageddon moved to nine points. The intent was to make Tejo cost something.',
      p3: 'By Masters Toronto in June, he was at 4%.',
      quote: '“Only 1 map he’s still viable on... Farewell Tejo.”',
      attribution: 'Boaster, FNATIC',
      leftLabel: 'Masters Bangkok 2025',
      rightLabel: 'Masters Toronto 2025',
      leftSub: '43 maps',
      rightSub: '59 maps',
      patchTitle: 'Tejo nerf',
      patchDate: 'May 13, 2025',
      caption:
        "Tejo's pick rate before and after Patch 10.09. Bangkok was his international debut; Toronto was the first Masters after the nerf.",
      aria: (before, after) =>
        `Tejo fell from ${before} percent at Masters Bangkok 2025 to ${after} percent at Masters Toronto 2025 after patch 10.09.`,
    },
    c3: {
      kicker: 'Patch 12.05 · March 17, 2026',
      title: 'Yoru was next.',
      p1: 'Yoru’s rise was slower, and that made it feel more permanent. He sat between 8% and 11% through 2024 — a niche pick, useful on a handful of maps. Then the ladder started: 46% at Bangkok 2025, 53% at Champions 2025, 62% at Santiago 2026.',
      p2: 'Patch 12.05 cut Blindside from two charges to one and halved Gatecrash’s duration from 30 seconds to 15. It did not remove Yoru’s kit. It removed the redundancy that made him safe.',
      p3: 'At Stage 1 he fell to 1%. At London he was still there — 1%, a rounding error with a teleport.',
      caption:
        "Yoru's pick rate across every international event and the 2026 Stage 1 regional snapshot. The hollow dot is the regional aggregate; Patch 12.05 is the red line between Santiago and Stage 1.",
      aria:
        "Line chart of Yoru's pick rate across eight international events and the 2026 Stage 1 regional snapshot. Yoru sits between 8 and 11 percent in 2024, rises to 46 percent at Bangkok 2025, 53 percent at Champions 2025, and 62 percent at Santiago 2026, then falls to 1 percent in Stage 1 and 1 percent at London after patch 12.05.",
    },
    c4: {
      kicker: 'Stage 1 · April–May 2026',
      title: 'One agent. Every region.',
      p1: 'The Yoru nerf did not create a balanced meta. It created a vacancy, and Neon filled it faster than any agent in the dataset. Across the four regional Stage 1 leagues, Neon averaged 79% of team slots over 442 maps.',
      p2: 'The consistency is the striking part. Americas: 78%. China: 80%. EMEA: 83%. Pacific: 76%. Four different metas, four different coaching cultures, one conclusion: Neon was the correct pick.',
      p3: 'Patch 12.05 had been designed to clip a duelist’s utility. What it produced was a duelist arms race, and Neon had the best movement in the game.',
      chartEyebrow: 'Neon · Stage 1 2026 · pick rate',
      chartTitle: 'Four leagues. One answer.',
      chartMapsUnit: 'maps',
      chartAvgFootnote: (maps, avg) => `Average across ${maps} maps: ${avg}%`,
      chartSlotFootnote: 'Pick rate = share of team slots',
      chartAria: (regionsText) => `Neon pick rate by region during VCT 2026 Stage 1: ${regionsText}`,
    },
    c5: {
      kicker: 'Patch 12.09 · May 12, 2026',
      title: 'London got a different game.',
      p1: 'Patch 12.09 removed Neon’s airborne speed bonus, limited her kill-based fuel regeneration, and made every shotgun less accurate while moving. Riot said her movement and evasiveness were “breaking our design philosophies around what combat should be.” Neon and the shotguns were simply first.',
      p2: 'At Masters London, Neon fell to 32%. The slot did not go to another single oppressor. It spread: Jett climbed from 16% to 44%, Raze from 22% to 38%, Phoenix from 20% to 33%. Waylay, the other movement duelist, fell from 24% to 15%.',
      quote:
        '“Every team at Masters London arrives with a toolkit built for a different version of the game.”',
      attribution: 'Hotspawn, June 2026',
      p3: 'The teams that adapted fastest were the ones still playing in June.',
      leftLabel: 'Stage 1 2026',
      rightLabel: 'Masters London 2026',
      leftSub: 'Four-region aggregate · 442 maps',
      rightSub: 'Reconstructed · 65 maps',
      patchTitle: 'Neon + shotgun nerf',
      patchDate: 'May 12, 2026',
      caption:
        'Duelist pick rates before and after Patch 12.09. London values are reconstructed from per-player agent rows and validated against Santiago’s official aggregates within about one point.',
      aria: (shiftSummary) => `Duelist pick rates before and after patch 12.09: ${shiftSummary}.`,
      shiftItem: (agent, before, after) => `${agent} ${before} percent in Stage 1 to ${after} percent in London`,
    },
    c6: {
      kicker: 'Eight events · 2024–2026',
      title: 'Everything changes. Three things don’t.',
      p1: 'Across eight international events, the top of the pick-rate table churned constantly. Tejo appeared, peaked, and vanished. Yoru rose for two years and disappeared in six weeks. Neon went from 4% to 79% and back to 32%.',
      p2: 'Underneath the noise, three agents stayed in the conversation: Omen between 54% and 82%, Viper between 35% and 78%, Sova between 25% and 53%. None of them ever won a patch. None of them ever needed to.',
      p3: 'The pattern is not that patches don’t matter. It’s that patches move the ceiling while roles set the floor. Smoke, vision, and recon survive every balance pass because every composition needs them. The meta never sleeps; the job description doesn’t change.',
      chartEyebrow: 'Eight international events · 2024–2026',
      chartSub: 'Each dot is one event',
      avgLabel: (avg) => `avg ${avg}%`,
      chartAria: (summary) => `Pick rate ranges across eight international events: ${summary}`,
      chartRangeCaption:
        'Minimum and maximum pick rate across Masters Madrid 2024 through Masters London 2026. The vertical tick is the average.',
      swipeRange: 'Swipe to see the full range →',
    },
    c7: {
      kicker: 'Patch 13.00 · June 23, 2026',
      title: 'The next cliff is already here.',
      p1: 'Patch 13.00 landed two days after Masters London ended. It did what Riot had signalled in the 12.09 notes: Sentinel buffs for Cypher, Killjoy, Veto, Sage, and Deadlock, and a cut to Initiator signature cooldowns from 60 seconds to 50 for Sova, Fade, Skye, Breach, and KAY/O. A new map, Summit, entered the pool.',
      p2: 'The changes answer two structural problems named in 12.09 — weak Sentinels and long Initiator cooldowns. If the pattern in this story holds, the next international event will not look like London. The agent that ends one cycle is usually the reason for the next patch.',
      p3: 'The dataset ends at London, so the competitive effect of 13.00 sits outside this story. That is the point: by the time a meta is legible, the patch that ends it is already in the queue.',
      p4: 'Every number on this page comes from the same public match record. The method, the caveats, and the full table are below.',
      patches: {
        p1009: {
          date: 'May 13, 2025',
          title: 'Tejo nerf',
          detail:
            'Guided Salvo lost its cooldown, gained a charge system, and lost 10m of targeting range; Stealth Drone cost 300 → 400; Armageddon 8 → 9 points.',
          effect: 'Tejo 56% → 4%',
        },
        p1205: {
          date: 'Mar 17, 2026',
          title: 'Yoru nerf',
          detail:
            'Blindside cut from two charges to one; Gatecrash duration cut from 30 seconds to 15.',
          effect: 'Yoru 62% → 1%',
        },
        p1209: {
          date: 'May 12, 2026',
          title: 'Neon + shotgun nerf',
          detail:
            'No airborne speed bonus; kill-based fuel regen only during her ultimate; every shotgun less accurate while moving.',
          effect: 'Neon 79% → 32%',
        },
        p1300: {
          date: 'June 23, 2026',
          title: 'Sentinel + Initiator changes',
          detail:
            'Sentinel buffs for Cypher, Killjoy, Veto, Sage, and Deadlock; Initiator signature cooldowns cut from 60s to 50s; new map Summit enters the pool.',
          effect: 'After the dataset',
          badge: 'After the data',
        },
      },
    },
  },
  footer: {
    methodologyEyebrow: 'Methodology',
    methodologyTitle: 'How the numbers were made.',
    methodologyP1:
      'Every pick rate in this story is the share of team slots an agent occupied, not the share of maps on which they appeared. A match with M maps has 2M team slots, so an agent’s rate is picks ÷ (2M). The source’s Pick Rate column uses the same definition; the values sum to roughly 500% at every event because each map has ten player slots.',
    methodologyP2:
      'The eight international events are Masters Madrid 2024, Masters Shanghai 2024, Champions 2024, Masters Bangkok 2025, Masters Toronto 2025, Champions 2025, Masters Santiago 2026, and Masters London 2026. The 2026 Stage 1 row is a map-weighted average of the four regional leagues — Americas, China, EMEA, and Pacific — and is not an international event.',
    methodologyP3:
      'Masters London has no published event-level agent aggregate in the bundle, so its rates were reconstructed from the per-player agent field in overview.csv. The same reconstruction applied to Santiago reproduced the official aggregate within about one percentage point.',
    limitsEyebrow: 'Limits',
    limits: [
      {
        title: 'Dates are release dates, not match-level patch tags.',
        text: 'The dataset does not record which patch each map was played on. The before/after comparisons are event-to-event, and other meta changes may contribute to the swings shown.',
      },
      {
        title: 'The 2026 bundle ends at Masters London.',
        text: 'Stage 2, Champions 2026, and the competitive effect of Patch 13.00 are not included. The final chapter describes changes outside the dataset, not their results.',
      },
      {
        title: 'Pick rate measures popularity, not effectiveness.',
        text: 'A high pick rate means teams believed an agent was correct. It does not by itself prove the agent was winning.',
      },
      {
        title: 'Small samples move fast.',
        text: 'Events range from 43 to 88 maps. A single map is worth about 1–2 percentage points of pick rate at these sizes.',
      },
    ],
    tableTitle: 'The full table',
    tableSub: 'Pick rate by event · share of team slots',
    tableCaption:
      'Agent pick rates by international event and the 2026 Stage 1 regional snapshot. Values are percentages of team slots.',
    colEvent: 'Event',
    colDate: 'Date',
    colMaps: 'Maps',
    tableScrollHint: 'Scroll the table horizontally →',
    tableFootnote:
      '† Reconstructed from per-player rows. ‡ Four-region aggregate, not an international event. Percentages are rounded to the nearest whole number.',
    sourcesEyebrow: 'Sources',
    sources: [
      {
        label: 'VLR.gg — match and agent statistics',
        href: 'https://www.vlr.gg',
        note: 'Primary match record. Accessed through the VCT dataset compiled by Ryan Luong on Kaggle (MIT License).',
      },
      {
        label: 'Riot Games — Patch 10.09 notes',
        href: 'https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-10-09/',
        note: 'Tejo changes, released May 13, 2025.',
      },
      {
        label: 'Riot Games — Patch 12.05 notes',
        href: 'https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-12-05/',
        note: 'Yoru changes, released March 17, 2026.',
      },
      {
        label: 'Riot Games — Patch 12.09 notes',
        href: 'https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-12-09/',
        note: 'Neon and shotgun changes, released May 12, 2026.',
      },
      {
        label: 'Riot Games — Patch 13.00 notes',
        href: 'https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-00/',
        note: 'Sentinel buffs and Initiator cooldown changes, released June 23, 2026.',
      },
      {
        label: 'Riot Games — “Inside the patch: Neon and shotguns explained”',
        href: 'https://www.youtube.com/watch?v=nSDKbl-q808',
        note: 'Live-balance dev video, May 7, 2026. Source of the “design philosophies” quote.',
      },
      {
        label: 'Liquipedia — Patch 12.09',
        href: 'https://liquipedia.net/valorant/Patch_12.09',
        note: 'Patch summary and release date cross-check.',
      },
      {
        label: 'Hotspawn — “How Patch 12.09 Rewrote The Meta At The Swiss Stage”',
        href: 'https://www.hotspawn.com/valorant/news/valorant-masters-london-swiss-meta',
        note: 'Masters London 2026 Swiss-stage reporting, June 12, 2026.',
      },
      {
        label: 'TheSpike — “Tejo’s rise and fall”',
        href: 'https://www.thespike.gg/valorant/news/tejo-s-rise-and-fall-analyzing-the-agent-s-pick-rate-from-bangkok-to-toronto/6364',
        note: 'Bangkok-to-Toronto pick-rate analysis, June 26, 2025.',
      },
    ],
    builtLabel: (date) => `Data built ${date}`,
    disclaimer:
      'This is an independent, non-commercial data story. It is not affiliated with, endorsed by, or sponsored by Riot Games. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc. Match data is attributed to VLR.gg and the Kaggle dataset compiled by Ryan Luong. Built with Vite, React, TypeScript, Tailwind CSS, and D3. Set in Newsreader and Inter.',
  },
  charts: {
    stage1Regional: 'Stage 1 · regional',
    regionalStage1Snapshot: 'Regional Stage 1 snapshot',
    swipeTimeline: 'Swipe the chart to see the full timeline →',
    swipeCompare: 'Swipe to compare both ends →',
    months: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
}

export type Locale = 'en' | 'th'

export type Translations = {
  meta: {
    title: string
    description: string
  }
  nav: {
    skipToStory: string
    siteTitle: string
    cliffs: string
    constants: string
    methodology: string
    langSwitchLabel: string
  }
  hero: {
    eyebrow: string
    titlePart1: string
    titlePart2: string
    subtitle: string
    description: string
    cta: string
    chartCaption: string
    chartAria: string
  }
  statCards: {
    eyebrow: string
    sub: string
    patchPrefix: string
    readChapterAria: (agent: string, before: string, from: string, after: string, to: string) => string
  }
  chapters: {
    c1: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      leftLabel: string
      rightLabel: string
      leftSub: string
      rightSub: string
      patchTitle: string
      patchDate: string
      caption: string
      aria: (yoruBefore: string, yoruAfter: string, neonBefore: string, neonAfter: string) => string
    }
    c2: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      quote: string
      attribution: string
      leftLabel: string
      rightLabel: string
      leftSub: string
      rightSub: string
      patchTitle: string
      patchDate: string
      caption: string
      aria: (before: string, after: string) => string
    }
    c3: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      caption: string
      aria: string
    }
    c4: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      chartEyebrow: string
      chartTitle: string
      chartMapsUnit: string
      chartAvgFootnote: (maps: number, avg: string) => string
      chartSlotFootnote: string
      chartAria: (regionsText: string) => string
    }
    c5: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      quote: string
      attribution: string
      leftLabel: string
      rightLabel: string
      leftSub: string
      rightSub: string
      patchTitle: string
      patchDate: string
      caption: string
      aria: (shiftSummary: string) => string
      shiftItem: (agent: string, before: string, after: string) => string
    }
    c6: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      chartEyebrow: string
      chartSub: string
      avgLabel: (avg: string) => string
      chartAria: (summary: string) => string
      chartRangeCaption: string
      swipeRange: string
    }
    c7: {
      kicker: string
      title: string
      p1: string
      p2: string
      p3: string
      p4: string
      patches: {
        p1009: {
          date: string
          title: string
          detail: string
          effect: string
        }
        p1205: {
          date: string
          title: string
          detail: string
          effect: string
        }
        p1209: {
          date: string
          title: string
          detail: string
          effect: string
        }
        p1300: {
          date: string
          title: string
          detail: string
          effect: string
          badge: string
        }
      }
    }
  }
  footer: {
    methodologyEyebrow: string
    methodologyTitle: string
    methodologyP1: string
    methodologyP2: string
    methodologyP3: string
    limitsEyebrow: string
    limits: Array<{
      title: string
      text: string
    }>
    tableTitle: string
    tableSub: string
    tableCaption: string
    colEvent: string
    colDate: string
    colMaps: string
    tableScrollHint: string
    tableFootnote: string
    sourcesEyebrow: string
    sources: Array<{
      label: string
      href: string
      note: string
    }>
    builtLabel: (date: string) => string
    disclaimer: string
  }
  charts: {
    stage1Regional: string
    regionalStage1Snapshot: string
    swipeTimeline: string
    swipeCompare: string
    months: string[]
  }
}

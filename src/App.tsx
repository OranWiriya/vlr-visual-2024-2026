import { Chapter } from './components/Chapter'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PatchTimeline } from './components/PatchTimeline'
import { PullQuote } from './components/PullQuote'
import { StatCards } from './components/StatCards'
import { ConstantsChart } from './components/charts/ConstantsChart'
import { DuelistShiftChart } from './components/charts/DuelistShiftChart'
import { LineChart } from './components/charts/LineChart'
import { RegionalBars } from './components/charts/RegionalBars'
import { SlopeChart, type SlopeEntry } from './components/charts/SlopeChart'
import { useI18n } from './i18n'
import { AGENTS, PATCHES, rate, story, timeline } from './lib/story'

const santiago = story.events.find((event) => event.id === 'santiago-2026')!
const stage1 = story.snapshots.stage1_2026
const bangkok = story.events.find((event) => event.id === 'bangkok-2025')!
const toronto = story.events.find((event) => event.id === 'toronto-2025')!

const coldOpenEntries: SlopeEntry[] = [
  {
    key: 'yoru',
    label: 'Yoru',
    color: AGENTS.yoru.color,
    before: rate(santiago.rates, 'yoru'),
    after: rate(stage1.rates, 'yoru'),
  },
  {
    key: 'neon',
    label: 'Neon',
    color: AGENTS.neon.color,
    before: rate(santiago.rates, 'neon'),
    after: rate(stage1.rates, 'neon'),
  },
]

const tejoEntries: SlopeEntry[] = [
  {
    key: 'tejo',
    label: 'Tejo',
    color: AGENTS.tejo.color,
    before: rate(bangkok.rates, 'tejo'),
    after: rate(toronto.rates, 'tejo'),
  },
]

function App() {
  const { t } = useI18n()

  const yoruPatch = {
    ...PATCHES[1],
    title: t.chapters.c7.patches.p1205.title,
    label: t.chapters.c7.patches.p1205.date,
  }

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        {t.nav.skipToStory}
      </a>

      <Header />
      <main>
        <Hero />
        <StatCards />

        <Chapter
          id="cold-open"
          number="01"
          kicker={t.chapters.c1.kicker}
          title={t.chapters.c1.title}
          chart={
            <SlopeChart
              entries={coldOpenEntries}
              leftLabel={t.chapters.c1.leftLabel}
              rightLabel={t.chapters.c1.rightLabel}
              leftSub={t.chapters.c1.leftSub}
              rightSub={t.chapters.c1.rightSub}
              patch={{
                version: '12.05',
                date: t.chapters.c1.patchDate,
                title: t.chapters.c1.patchTitle,
              }}
              ariaLabel={t.chapters.c1.aria(
                rate(santiago.rates, 'yoru').toFixed(0),
                rate(stage1.rates, 'yoru').toFixed(0),
                rate(santiago.rates, 'neon').toFixed(0),
                rate(stage1.rates, 'neon').toFixed(0),
              )}
              caption={t.chapters.c1.caption}
            />
          }
        >
          <p>{t.chapters.c1.p1}</p>
          <p>{t.chapters.c1.p2}</p>
          <p>{t.chapters.c1.p3}</p>
        </Chapter>

        <Chapter
          id="tejo"
          number="02"
          kicker={t.chapters.c2.kicker}
          title={t.chapters.c2.title}
          reverse
          chart={
            <SlopeChart
              entries={tejoEntries}
              leftLabel={t.chapters.c2.leftLabel}
              rightLabel={t.chapters.c2.rightLabel}
              leftSub={t.chapters.c2.leftSub}
              rightSub={t.chapters.c2.rightSub}
              patch={{
                version: '10.09',
                date: t.chapters.c2.patchDate,
                title: t.chapters.c2.patchTitle,
              }}
              big
              ariaLabel={t.chapters.c2.aria(
                rate(bangkok.rates, 'tejo').toFixed(0),
                rate(toronto.rates, 'tejo').toFixed(0),
              )}
              caption={t.chapters.c2.caption}
            />
          }
        >
          <p>{t.chapters.c2.p1}</p>
          <p>{t.chapters.c2.p2}</p>
          <p>{t.chapters.c2.p3}</p>

          <PullQuote attribution={t.chapters.c2.attribution}>
            {t.chapters.c2.quote}
          </PullQuote>
        </Chapter>

        <Chapter
          id="yoru"
          number="03"
          kicker={t.chapters.c3.kicker}
          title={t.chapters.c3.title}
          chart={
            <LineChart
              points={timeline}
              series={[
                {
                  key: 'yoru',
                  label: 'Yoru',
                  color: AGENTS.yoru.color,
                },
              ]}
              patches={[yoruPatch]}
              area
              callouts={[
                {
                  pointId: 'santiago-2026',
                  seriesKey: 'yoru',
                  text: '62%',
                  dx: 0,
                  dy: -26,
                },
              ]}
              ariaLabel={t.chapters.c3.aria}
              caption={t.chapters.c3.caption}
            />
          }
        >
          <p>{t.chapters.c3.p1}</p>
          <p>{t.chapters.c3.p2}</p>
          <p>{t.chapters.c3.p3}</p>
        </Chapter>

        <Chapter
          id="neon"
          number="04"
          kicker={t.chapters.c4.kicker}
          title={t.chapters.c4.title}
          reverse
          chart={<RegionalBars />}
        >
          <p>{t.chapters.c4.p1}</p>
          <p>{t.chapters.c4.p2}</p>
          <p>{t.chapters.c4.p3}</p>
        </Chapter>

        <Chapter
          id="london"
          number="05"
          kicker={t.chapters.c5.kicker}
          title={t.chapters.c5.title}
          chart={<DuelistShiftChart />}
        >
          <p>{t.chapters.c5.p1}</p>
          <p>{t.chapters.c5.p2}</p>

          <PullQuote attribution={t.chapters.c5.attribution}>
            {t.chapters.c5.quote}
          </PullQuote>

          <p>{t.chapters.c5.p3}</p>
        </Chapter>

        <Chapter
          id="constants"
          number="06"
          kicker={t.chapters.c6.kicker}
          title={t.chapters.c6.title}
          stacked
          chart={<ConstantsChart />}
        >
          <p>{t.chapters.c6.p1}</p>
          <p>{t.chapters.c6.p2}</p>
          <p>{t.chapters.c6.p3}</p>
        </Chapter>

        <Chapter
          id="next-patch"
          number="07"
          kicker={t.chapters.c7.kicker}
          title={t.chapters.c7.title}
          stacked
          chart={<PatchTimeline />}
        >
          <p>{t.chapters.c7.p1}</p>
          <p>{t.chapters.c7.p2}</p>
          <p>{t.chapters.c7.p3}</p>
          <p>{t.chapters.c7.p4}</p>
        </Chapter>
      </main>

      <Footer />
    </>
  )
}

export default App

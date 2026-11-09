import { useI18n } from '../../i18n'
import { duelistShift } from '../../lib/story'
import { SlopeChart } from './SlopeChart'

export function DuelistShiftChart() {
  const { t } = useI18n()
  const c5 = t.chapters.c5

  const shiftSummary = duelistShift
    .map((entry) =>
      c5.shiftItem(entry.label, entry.before.toFixed(0), entry.after.toFixed(0)),
    )
    .join(', ')

  return (
    <SlopeChart
      entries={duelistShift}
      leftLabel={c5.leftLabel}
      rightLabel={c5.rightLabel}
      leftSub={c5.leftSub}
      rightSub={c5.rightSub}
      patch={{
        version: '12.09',
        date: c5.patchDate,
        title: c5.patchTitle,
      }}
      ariaLabel={c5.aria(shiftSummary)}
      caption={c5.caption}
    />
  )
}

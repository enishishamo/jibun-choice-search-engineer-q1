/**
 * The one visual spine running through every learning screen: how wide a view
 * the work is being done at. Not a progress bar — the children never "finish"
 * a stop, they move their attention along it.
 */
export const SCALE_STOPS = [
  { icon: '🔎', label: '1つの検索' },
  { icon: '🔎×100', label: 'たくさんの検索' },
  { icon: '👥', label: '実際に使う人' },
  { icon: '🌏', label: '世界' },
] as const

interface Props {
  /** the stop being looked at now */
  at: number
  /** where the attention moved from, drawn as a travelled segment */
  from?: number
  /** dim the stop after `at`, for "we are stopping just before this" */
  stopBefore?: boolean
}

export function ScaleBar({ at, from, stopBefore }: Props) {
  const start = from ?? at
  return (
    <div className="scalebar" aria-label={`いま見ているのは ${SCALE_STOPS[at].label}`}>
      {SCALE_STOPS.map((s, i) => {
        const travelled = i >= Math.min(start, at) && i <= at
        const isNow = i === at
        const blocked = stopBefore && i === at + 1
        return (
          <div key={s.label} className="scalebar__cell">
            {i > 0 && <span className={`scalebar__link ${travelled ? 'is-travelled' : ''}`} aria-hidden="true" />}
            <div className={`scalestop ${isNow ? 'is-now' : ''} ${travelled ? 'is-travelled' : ''} ${blocked ? 'is-blocked' : ''}`}>
              <span className="scalestop__icon">{s.icon}</span>
              <span className="scalestop__label">{s.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

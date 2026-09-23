import { PRO_POINTS, type ProPoint } from '../data/pro.ts'
import { Button } from '../components/ui.tsx'

/**
 * The app shows a cue and waits. What the engineer says is hers; the screen
 * never puts her explanation in writing, and never carries the story on its
 * own — the screen after this one shows the same idea with real searches.
 */
export function ProScreen({ id, onNext }: { id: ProPoint['id']; onNext: () => void }) {
  const p = PRO_POINTS[id]
  return (
    <div className="mei fade-in">
      <div className="mei__avatar" aria-hidden="true">
        <svg width="96" height="96" viewBox="0 0 64 64">
          <circle cx="32" cy="30" r="17" fill="#ffd7bd" />
          <path d="M14 30c0-13 8-20 18-20s18 7 18 20v10h-5V32c-4-1-8-5-13-9-5 4-9 8-13 9v8h-5z" fill="#4a2e26" />
          <circle cx="26" cy="32" r="2.2" fill="#3a2e2a" />
          <circle cx="38" cy="32" r="2.2" fill="#3a2e2a" />
          <path d="M26 41q6 5 12 0" stroke="#3a2e2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="37" r="3" fill="#ffb3a0" opacity=".6" />
          <circle cx="42" cy="37" r="3" fill="#ffb3a0" opacity=".6" />
        </svg>
      </div>
      {p.sub && <p className="sub">{p.sub}</p>}
      <div className="mei__cue">{p.cue}</div>
      <div className="mei__dots" aria-hidden="true"><i /><i /><i /></div>
      <Button size="lg" color="teal" onClick={onNext}>{p.next}</Button>
    </div>
  )
}

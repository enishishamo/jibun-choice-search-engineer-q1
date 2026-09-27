import { SUMMARY_STEPS } from '../data/summarySteps.ts'
import { Button, Notice } from '../components/ui.tsx'

type Beat = 'recap' | 'ok'

/**
 * Two beats, never at once. First the team looks back at the shape of the work
 * they did — not the buttons they pressed. Then, on a fresh screen, three
 * separate OKs, one per person, before the world button appears at all.
 */
interface Props {
  /** current beat, held in game state so the facilitator can step back */
  beat: string
  onBeat: (b: string) => void
  /** which of the three OKs are in — in game state, so undo restores them */
  oks: boolean[]
  onOk: (index: number) => void
  onRelease: () => void
}

export function ReadyToReleaseScreen({ beat: rawBeat, onBeat, oks, onOk, onRelease }: Props) {
  const beat = (rawBeat || 'recap') as Beat
  const allOk = oks.every(Boolean)

  if (beat === 'recap') {
    return (
      <div className="col w-full fade-in" style={{ gap: 16, textAlign: 'center' }}>
        <Notice color="teal">みんなが やってきたこと</Notice>
        <ol className="recap">
          {SUMMARY_STEPS.map((s, i) => (
            <li key={s.title} className="recap__item pop-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="recap__icon" aria-hidden="true">{s.icon}</span>
              <span className="recap__body">
                <b>{s.title}</b>
                <em>{s.sub}</em>
              </span>
            </li>
          ))}
        </ol>
        <Button size="lg" onClick={() => onBeat('ok')}>ここまで できた！</Button>
      </div>
    )
  }

  return (
    <div className="col w-full fade-in" style={{ gap: 20, textAlign: 'center' }}>
      <h1 className="h1">4人で 最後のOKを 出そう</h1>
      <p className="sub">ひとり 1つずつ 押してね</p>
      <div className="oks">
        {oks.map((on, i) => (
          <button
            key={i}
            type="button"
            className={`okbtn ${on ? 'is-on' : ''}`}
            disabled={on}
            onClick={() => onOk(i)}
          >
            <span className="okbtn__who">{i + 1}人目</span>
            <span className="okbtn__mark">{on ? '✓ OK！' : 'OK！'}</span>
          </button>
        ))}
      </div>
      {allOk && (
        <button type="button" className="btn release-btn pop-in" onClick={onRelease}>
          世界へ<br />届ける！
          <small>RELEASE</small>
        </button>
      )}
    </div>
  )
}

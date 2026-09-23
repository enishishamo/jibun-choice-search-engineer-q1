import { Button } from '../components/ui.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

const ONE_BY_ONE = [
  { icon: '🌦️', query: '天気' },
  { icon: '🚃', query: '電車' },
  { icon: '🎮', query: 'ゲーム' },
]

interface Props {
  /** current beat, held in game state so the facilitator can step back */
  beat: string
  onBeat: (b: string) => void
  onNext: () => void
}

/**
 * Learning ①. Carried by the picture, not the sentence: on the left a hand
 * repairing searches one at a time, on the right one mechanism reaching
 * several of them at once. Deliberately *several*, not all hundred — this is
 * not a magic switch. Only after the picture has been seen is the lesson put
 * into a single sentence, and then the next question is handed back.
 */
export function BridgeToSystemScreen({ beat: rawBeat, onBeat, onNext }: Props) {
  const beat = (rawBeat || 'figure') as 'figure' | 'line'
  return (
    <div className="col w-full fade-in" style={{ gap: 16 }}>
      <ScaleBar at={1} from={0} />

      <div className="vs">
        <div className="vs__side">
          <div className="vs__cap">1件ずつ</div>
          <ul className="vs__hands">
            {ONE_BY_ONE.map((o) => (
              <li key={o.query}>
                <span className="vs__q">{o.icon} 🔎 {o.query}</span>
                <span className="vs__arrow" aria-hidden="true">→</span>
                <span className="vs__hand">✋ 直す</span>
              </li>
            ))}
            <li className="vs__more">……</li>
          </ul>
          <div className="vs__foot vs__foot--hot">まだ 95件</div>
        </div>

        <div className="vs__between" aria-hidden="true">
          <span>→</span>
        </div>

        <div className="vs__side vs__side--new">
          <div className="vs__cap">いくつもの検索に 働く</div>
          <div className="vs__gear">🧩<em>検索の しくみ</em></div>
          <div className="vs__rays" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="vs__targets">
            {['🔎', '🔎', '🔎', '🔎'].map((s, i) => <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{s}</span>)}
          </div>
          <div className="vs__foot">1つの しくみが、いくつもの検索に とどく</div>
        </div>
      </div>

      {beat === 'figure' ? (
        <div className="btn-row">
          <Button size="lg" onClick={() => onBeat('line')}>なるほど！</Button>
        </div>
      ) : (
        <div className="col center pop-in" style={{ gap: 14 }}>
          <div className="learncard">
            <p className="pre">{'たくさんの検索を よくするために、\n1件ずつ 直すのではなく、検索の「しくみ」を 変える。'}</p>
          </div>
          <p className="h1">じゃあ、どんな「しくみ」に する？</p>
          <Button size="lg" onClick={onNext}>考えてみる</Button>
        </div>
      )}
    </div>
  )
}

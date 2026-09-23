import { Button } from '../components/ui.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

const LOOP = [
  { icon: '💡', text: '作戦を 考える' },
  { icon: '🧪', text: 'たくさん 試す' },
  { icon: '⚖️', text: '結果を くらべる' },
  { icon: '⚙️', text: 'しくみを 直す' },
  { icon: '🔁', text: 'もう一度 試す' },
]

/**
 * Learning ③, shown once the try-compare-fix loop has actually been lived
 * through. It names what just happened; it does not set "no problems left" as
 * the goal.
 */
export function LearnTryScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="col w-full fade-in" style={{ gap: 16 }}>
      <ScaleBar at={1} />
      <div className="learncard">
        <p className="pre">{'考えた「しくみ」が ほんとうに いろいろな検索で 使えるか 確かめるために、\nたくさん 試して、結果を くらべる。'}</p>
      </div>
      <div className="loop">
        {LOOP.map((l, i) => (
          <div key={l.text} className="loop__step pop-in" style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="loop__icon">{l.icon}</span>
            <span className="loop__text">{l.text}</span>
            {i < LOOP.length - 1 && <span className="loop__arrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
      <div className="btn-row">
        <Button size="lg" onClick={onNext}>つぎへ</Button>
      </div>
    </div>
  )
}

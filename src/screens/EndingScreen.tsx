import { useEffect, useState } from 'react'
import { ENDING_PEOPLE } from '../data/ending.ts'
import { UserAvatar } from '../components/UserAvatar.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'
import { Button } from '../components/ui.tsx'

/**
 * The world animation was the middle of the story. This is the end of it: the
 * same people the children started from, before and after their change.
 */
export function EndingScreen({ onNext }: { onNext: () => void }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n < ENDING_PEOPLE.length + 1) {
      const t = setTimeout(() => setN(n + 1), 1300)
      return () => clearTimeout(t)
    }
  }, [n])
  const final = n > ENDING_PEOPLE.length

  return (
    <div className="col w-full fade-in" style={{ gap: 18, textAlign: 'center' }}>
      <div className="endings">
        {ENDING_PEOPLE.map((p, i) => (
          <div key={p.query} className={`ending ${i < n ? 'is-in' : ''}`}>
            <span className="ending__q">🔎 {p.query}</span>
            <UserAvatar kind={p.kind} size={72} mood={i < n ? 'happy' : 'meh'} />
            <div className="ending__before pre">{p.before}</div>
            <div className="ending__arrow" aria-hidden="true">↓</div>
            <div className="ending__after">
              <ClayAsset name={p.asset} size={40} />
              <span className="pre">{p.after}</span>
            </div>
          </div>
        ))}
      </div>
      {final && (
        <div className="finale pop-in">
          <p className="h1 pre">{'「知りたいのに 見つからない」が\n「見つかった！」に 変わった。'}</p>
          <p className="h2 pre">{'みんなが 変えた しくみが、\nだれかの「知りたい」に 届いた！'}</p>
          <Button size="lg" color="teal" onClick={onNext}>エンジニアプロに 聞いてみよう</Button>
        </div>
      )}
    </div>
  )
}

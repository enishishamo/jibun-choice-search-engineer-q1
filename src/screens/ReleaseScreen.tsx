import { useEffect, useState } from 'react'
import { ClayAsset } from '../components/ClayAsset.tsx'
import { Button } from '../components/ui.tsx'

const REACH = ['1人', '100人', '1,000人', '日本', '世界']

/** The update spreads outward, then hands straight back to real people. */
export function ReleaseScreen({ onNext }: { onNext: () => void }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i < REACH.length - 1) {
      const t = setTimeout(() => setI(i + 1), 700)
      return () => clearTimeout(t)
    }
  }, [i])
  const last = i >= REACH.length - 1
  const pings = [[20, 30], [55, 22], [70, 55], [35, 65], [60, 75], [80, 35]]
  return (
    <div className="col fade-in" style={{ gap: 18, textAlign: 'center', minHeight: 420, justifyContent: 'center' }}>
      <div className="label">RELEASE</div>
      <div className="globe-wrap">
        <ClayAsset name="globe" fluid />
        {pings.slice(0, i + 2).map(([x, y], k) => (
          <span key={k} className="ping" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${k * 0.18}s` }} />
        ))}
      </div>
      <div key={i} className="reach">{REACH[i]}</div>
      {last && <Button size="lg" color="teal" className="pop-in" onClick={onNext}>届いた人を 見る</Button>}
    </div>
  )
}

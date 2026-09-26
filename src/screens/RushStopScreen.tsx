import { useEffect, useState } from 'react'
import { Button, Notice } from '../components/ui.tsx'
import { RUSH_INCOMING } from '../data/voices.ts'

type Beat = 'pile' | 'think' | 'ask'

/**
 * Everything stops at 100. Three beats: see the backlog, be asked an open
 * "what now?" with room for any idea at all, then (if they want a nudge) a
 * more specific prompt, then the engineer. Any answer at the open question is
 * a good one — the screen never suggests "batching" before the children do.
 */
interface Props {
  /** current beat, held in game state so the facilitator can step back */
  beat: string
  onBeat: (b: string) => void
  onNext: () => void
}

export function RushStopScreen({ beat: rawBeat, onBeat, onNext }: Props) {
  const beat = (rawBeat || 'pile') as Beat
  const [n, setN] = useState(95)
  const [openShown, setOpenShown] = useState(false)
  const [hintShown, setHintShown] = useState(false)
  const [askShown, setAskShown] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setN((v) => (v < 100 ? v + 1 : v)), 240)
    return () => clearInterval(t)
  }, [])

  // the open question lands a beat after the count settles, and the small
  // "still one at a time?" nudge only appears later still — never first
  useEffect(() => {
    if (beat !== 'pile' || n < 100) return
    const t1 = setTimeout(() => setOpenShown(true), 700)
    const t2 = setTimeout(() => setHintShown(true), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [beat, n])

  // the real question only lands after a pause, so it is not skipped past
  useEffect(() => {
    if (beat !== 'think') return
    const t = setTimeout(() => setAskShown(true), 1800)
    return () => clearTimeout(t)
  }, [beat])

  const counted = n >= 100

  return (
    <div className="col fade-in" style={{ gap: 18, textAlign: 'center' }}>
      <div className="rushbar">
        <div className="counter"><div className="counter__label">なおした</div><div className="counter__num">5</div></div>
        <div className="counter counter--hot"><div className="counter__label">まだある</div><div className="counter__num">{n}</div></div>
      </div>

      <div className="wall" aria-hidden="true">
        {RUSH_INCOMING.slice(0, 30).map((q, i) => (
          <span key={q} className="wall__card" style={{ ['--r' as string]: `${((i * 5) % 7) - 3}deg` }}>🔎 {q}</span>
        ))}
        <span className="wall__card wall__card--more">…</span>
      </div>

      {beat === 'pile' && counted && (
        <div className="col pop-in" style={{ gap: 16 }}>
          <Notice color="coral">100 SEARCHES</Notice>
          <h2 className="h2">まだ 95件 ある。</h2>
          {openShown && (
            <div className="col pop-in" style={{ gap: 10 }}>
              <h1 className="h1">……どうする？</h1>
              <p className="sub">3人で 考えてみよう。</p>
            </div>
          )}
          {hintShown && <p className="sub fade-in">今までみたいに、1個ずつ やっていく？</p>}
          {openShown && <Button size="lg" className="pop-in" onClick={() => onBeat('think')}>考えてみた！</Button>}
        </div>
      )}

      {beat === 'think' && (
        <div className="col pop-in" style={{ gap: 16 }}>
          <h1 className="h1 pre">{'どうしたら、たくさんの検索を\nいっぺんに よくできると思う？'}</h1>
          <p className="sub">3人で 考えてみよう。どんな答えでも いいよ</p>
          {askShown && <Button size="lg" className="pop-in" onClick={() => onBeat('ask')}>考えてみた！</Button>}
        </div>
      )}

      {beat === 'ask' && (
        <div className="col pop-in" style={{ gap: 16 }}>
          <h1 className="h1">エンジニアプロは、どうしてるんだろう？</h1>
          <Button size="lg" color="teal" onClick={onNext}>エンジニアプロに 聞いてみる</Button>
        </div>
      )}
    </div>
  )
}

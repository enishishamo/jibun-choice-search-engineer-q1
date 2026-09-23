import { useEffect, useRef, useState } from 'react'
import { RUSH_COUNTERS, RUSH_INCOMING, RUSH_VOICES } from '../data/voices.ts'
import { VoiceScreen } from './VoiceScreen.tsx'

interface Props {
  rushSolved: number
  onSolved: () => void
}

/**
 * SEARCH RUSH: the child keeps fixing voices one at a time while a band of
 * incoming searches piles up along the bottom and never clears. The pile is
 * what makes "we cannot keep up" land — the counter only confirms it.
 */
export function RushScreen({ rushSolved, onSolved }: Props) {
  const idx = Math.min(rushSolved, RUSH_VOICES.length - 1)
  const task = RUSH_VOICES[idx]
  const from = RUSH_COUNTERS[rushSolved]
  const to = RUSH_COUNTERS[Math.min(rushSolved + 1, RUSH_COUNTERS.length - 1)]
  const [remaining, setRemaining] = useState(from.remaining)
  const [pile, setPile] = useState<{ id: number; q: string }[]>([])
  const [bump, setBump] = useState(false)
  const nextQ = useRef(0)

  useEffect(() => {
    setRemaining(from.remaining)
    let cur = from.remaining
    const target = Math.max(from.remaining, to.remaining - 1)
    const tick = () => {
      if (cur >= target) return
      const step = Math.max(1, Math.ceil((target - cur) / 10))
      cur = Math.min(target, cur + step)
      setRemaining(cur)
      setBump(true)
      setTimeout(() => setBump(false), 280)
      const q = RUSH_INCOMING[nextQ.current % RUSH_INCOMING.length]
      nextQ.current += 1
      setPile((p) => [...p, { id: nextQ.current, q }].slice(-20))
    }
    const interval = setInterval(tick, rushSolved >= 2 ? 300 : 620)
    const first = setTimeout(tick, 1200)
    return () => { clearInterval(interval); clearTimeout(first) }
  }, [rushSolved, from.remaining, to.remaining])

  return (
    <>
      <VoiceScreen key={task.id} task={task} compact onSolved={onSolved} nextLabel="つぎの VOICEへ" />
      {/* the backlog lives in one place: counters and the pile that feeds them */}
      <div className="rushdock">
        <div className="rushdock__counts">
          <span className="minicount"><i>なおした</i><b>{from.fixed}</b></span>
          <span className={`minicount minicount--hot ${bump ? 'is-bump' : ''}`}><i>まだある</i><b>{remaining}</b></span>
        </div>
        <div className="pile" aria-hidden="true">
          {pile.map((p) => (
            <div key={p.id} className="pile__card" style={{ ['--r' as string]: `${((p.id * 7) % 9) - 4}deg` }}>
              🔎 {p.q}
            </div>
          ))}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">検索が {remaining} 件 たまっています</div>
    </>
  )
}

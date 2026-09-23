import { useEffect, useState } from 'react'
import type { ResultCard, VoiceTask } from '../game/types.ts'
import { ReorderList } from '../components/ReorderList.tsx'
import { Button, Notice, SearchBox, Speech, StaticResult } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

type Stage = 'arrive' | 'sort' | 'open' | 'react' | 'requery'

interface Props {
  task: VoiceTask
  onSolved: () => void
  /** compact mode used during SEARCH RUSH */
  compact?: boolean
  nextLabel?: string
}

/**
 * One USER VOICE: arrive → sort (drag) → check → the user opens rank 1 →
 * reaction. If it is not what they needed, they re-search and the child tries
 * again. The UI never says which card should be on top.
 */
export function VoiceScreen({ task, onSolved, compact, nextLabel = 'つぎへ' }: Props) {
  const [stage, setStage] = useState<Stage>('arrive')
  const [cards, setCards] = useState<ResultCard[]>(task.cards)
  const [attempt, setAttempt] = useState(0)
  const [hinted, setHinted] = useState(false)

  useEffect(() => { setStage('arrive'); setCards(task.cards); setAttempt(0); setHinted(false) }, [task])

  useEffect(() => {
    if (stage === 'arrive') {
      const t = setTimeout(() => setStage('sort'), compact ? 800 : 1000)
      return () => clearTimeout(t)
    }
    if (stage === 'open') {
      const t = setTimeout(() => setStage('react'), 900)
      return () => clearTimeout(t)
    }
  }, [stage, compact])

  // one-off "this card can be picked up" hint on the first sort screen
  useEffect(() => {
    if (stage === 'sort' && !hinted) {
      const t = setTimeout(() => setHinted(true), 1600)
      return () => clearTimeout(t)
    }
  }, [stage, hinted])

  const top = cards[0]
  const solved = top.id === task.solvedTopId

  return (
    <div className="col w-full fade-in" style={{ gap: 16 }}>
      {stage === 'arrive' && (
        <div className="col" style={{ gap: 20, paddingTop: 32 }}>
          <Notice color="coral"><ClayAsset name="mail" size={24} /> USER VOICE が届いた！</Notice>
          <Speech kind={task.user} name={task.userName} size={88}>{task.voice}</Speech>
        </div>
      )}

      {stage === 'sort' && (
        <>
          <Speech kind={task.user} name={task.userName} size={compact ? 56 : 72}>{task.voice}</Speech>
          <SearchBox query={attempt === 0 ? task.query : task.requery} />
          <ReorderList cards={cards} onChange={setCards} hintTop={!hinted} />
          <Button size="lg" onClick={() => setStage('open')}>
            <span className="btn__stack">この じゅんばんで！<small>CHECK</small></span>
          </Button>
        </>
      )}

      {stage === 'open' && (
        <>
          <SearchBox query={attempt === 0 ? task.query : task.requery} />
          <div className="results">
            {cards.map((c, i) => <StaticResult key={c.id} card={c} rank={i + 1} dim={i !== 0} />)}
          </div>
          <div className="row" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: 28 }} aria-hidden="true">👆</span>
            <span className="sub">{task.userName}が 1位を ひらいた……</span>
          </div>
        </>
      )}

      {stage === 'react' && (
        <div className="col" style={{ gap: 18 }}>
          <div className="results"><StaticResult card={top} rank={1} /></div>
          {solved ? (
            <>
              <Speech kind={task.user} name={task.userName} mood="happy" size={88}>{task.solvedLine}</Speech>
              <div className="row" style={{ justifyContent: 'center', gap: 16 }}>
                <ClayAsset name={task.solvedAsset} size={64} />
                <Notice color="good">見つかった！</Notice>
              </div>
              <Button size="lg" color="teal" onClick={onSolved}>{nextLabel}</Button>
            </>
          ) : (
            <>
              <Speech kind={task.user} name={task.userName} mood="meh" size={88}>{task.failLines[top.id] ?? task.failFallback}</Speech>
              <Button size="lg" color="yellow" onClick={() => setStage('requery')}>もう一回 やってみる</Button>
            </>
          )}
        </div>
      )}

      {stage === 'requery' && (
        <RequeryStage task={task} onDone={() => { setAttempt((a) => a + 1); setStage('sort') }} />
      )}
    </div>
  )
}

/** The user types a new query, then the child gets another go automatically. */
function RequeryStage({ task, onDone }: { task: VoiceTask; onDone: () => void }) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i += 1
      setTyped(task.requery.slice(0, i))
      if (i >= task.requery.length) clearInterval(t)
    }, 70)
    return () => clearInterval(t)
  }, [task])
  const done = typed.length >= task.requery.length
  useEffect(() => {
    if (!done) return
    const t = setTimeout(onDone, 700)
    return () => clearTimeout(t)
  }, [done, onDone])
  return (
    <div className="col" style={{ gap: 18, paddingTop: 24 }}>
      <Speech kind={task.user} name={task.userName} mood="meh">もう一回、調べてみよう……</Speech>
      <SearchBox query={typed} typing={!done} />
    </div>
  )
}

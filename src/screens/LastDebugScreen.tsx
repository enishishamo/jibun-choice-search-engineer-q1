import { useEffect, useState } from 'react'
import type { StrategyId } from '../game/types.ts'
import { STRATEGIES } from '../data/strategies.ts'
import { pickResidualCase } from '../data/userTest.ts'
import { Button, Notice, SearchBox, Speech, StaticResult } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

interface Props {
  tuned: StrategyId[]
  pick: StrategyId | null
  fixed: boolean
  onPick: (s: StrategyId, fixes: boolean) => void
  onNext: () => void
}

type Stage = 'look' | 'fix' | 'trying' | 'check' | 'done'

/**
 * Route B — LAST DEBUG. Exactly three short steps, one search, one fix.
 * Never returns to SYSTEM MODE. The residual case is the one the user test
 * flagged, chosen so it is not something the team already tuned.
 */
export function LastDebugScreen({ tuned, pick, fixed, onPick, onNext }: Props) {
  const r = pickResidualCase(tuned)
  const [stage, setStage] = useState<Stage>('look')
  const step = stage === 'look' ? 1 : stage === 'check' || stage === 'done' ? 3 : 2

  useEffect(() => {
    if (stage === 'trying') {
      const t = setTimeout(() => setStage(fixed ? 'check' : 'fix'), 1400)
      return () => clearTimeout(t)
    }
    if (stage === 'check') {
      const t = setTimeout(() => setStage('done'), 1600)
      return () => clearTimeout(t)
    }
  }, [stage, fixed])

  return (
    <div className="col w-full fade-in" style={{ gap: 20 }}>
      <div className="center">
        <Notice color="yellow">1つ 直してから 届ける</Notice>
        <p className="sub mt">あと3ステップ</p>
        <div className="steps3">
          {['気になる検索を 1つ見る', '仕組みを 1つ直す', 'もう一回 たしかめる'].map((t, i) => (
            <div key={t} className={`steps3__item ${i + 1 < step ? 'is-done' : ''} ${i + 1 === step ? 'is-now' : ''}`}>
              <span className="steps3__n">{i + 1}</span>{t}
            </div>
          ))}
        </div>
      </div>

      {stage === 'look' && (
        <div className="clay col w-full" style={{ gap: 14, alignItems: 'stretch' }}>
          <Speech kind={r.user} name={r.userName} mood="meh">{r.line}</Speech>
          <SearchBox query={r.results.length ? r.line.match(/「(.+?)」/)?.[1] ?? '' : ''} />
          <div className="afterlist">
            {r.results.map((x, i) => <StaticResult key={x.title} card={x} rank={i + 1} />)}
          </div>
          <div className="btn-row"><Button size="lg" onClick={() => setStage('fix')}>仕組みを1つ直す</Button></div>
        </div>
      )}

      {(stage === 'fix' || stage === 'trying') && (
        <div className="clay col w-full" style={{ gap: 14, alignItems: 'stretch' }}>
          {pick && !fixed && stage === 'fix' && (
            <Speech kind={r.user} name={r.userName} mood="meh">{r.stillLine}</Speech>
          )}
          <h2 className="h2 center">この検索では、どの情報を 大事にする？</h2>
          <div className="strategies">
            {STRATEGIES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`strategy ${pick === s.id && stage === 'trying' ? 'is-selected' : ''}`}
                style={{ ['--accent' as string]: s.color, minHeight: 160 }}
                disabled={stage === 'trying'}
                onClick={() => { onPick(s.id, s.id === r.fixStrategy); setStage('trying') }}
              >
                <div className="strategy__icon" style={{ width: 64, height: 64 }}><ClayAsset name={s.asset} size={40} /></div>
                <div className="strategy__label">{s.label}</div>
                <div className="strategy__tag" style={{ fontSize: 15 }}>{s.tagline}</div>
              </button>
            ))}
          </div>
          {stage === 'trying' && <p className="sub center">{r.userName}がもう一度使ってみる……</p>}
        </div>
      )}

      {(stage === 'check' || stage === 'done') && (
        <div className="clay col w-full pop-in" style={{ gap: 14, alignItems: 'stretch' }}>
          <div className="label center">もう一回 たしかめる</div>
          <div className="afterlist">
            {r.fixedResults.map((x, i) => <StaticResult key={x.title} card={x} rank={i + 1} move={i === 0 ? 'up' : undefined} />)}
          </div>
          <Speech kind={r.user} name={r.userName} mood="happy">{r.fixedLine}</Speech>
          {stage === 'done' && (
            <div className="col" style={{ gap: 12 }}>
              <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
                <span className="badge badge--FIXED badge--lg">なおった！</span>
                <span className="sub">前の「よくなった」は そのまま</span>
              </div>
              <Button size="lg" color="teal" onClick={onNext}>じゅんび できた！</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

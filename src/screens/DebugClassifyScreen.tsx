import { useMemo } from 'react'
import type { StrategyId } from '../game/types.ts'
import type { Classification } from '../game/machine.ts'
import { STRATEGY_BY_ID } from '../data/strategies.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import { evaluateRaw } from '../game/logic.ts'
import { SortBoard } from '../components/SortBoard.tsx'
import { QueryList } from '../components/QueryList.tsx'
import { Button } from '../components/ui.tsx'

interface Props {
  strategy: StrategyId
  /** current beat, held in game state so the facilitator can step back */
  beat: string
  onBeat: (b: string) => void
  classification: Classification
  onClassify: (caseId: string, bucket: 'use' | 'skip' | undefined) => void
  onConfirm: () => void
}

/**
 * Two beats, both after the engineer has shown *how* to compare.
 *  A: the same two groups again, now with the telling word picked out —
 *     the children have already looked and thought, so this confirms rather
 *     than tells.
 *  B: they sort the cards. Their split is their hypothesis, not an answer
 *     sheet: any split is accepted and tested by the recheck.
 */
export function DebugClassifyScreen({ strategy, beat: rawBeat, onBeat, classification, onClassify, onConfirm }: Props) {
  const s = STRATEGY_BY_ID[strategy]
  const beat = (rawBeat || 'reveal') as 'reveal' | 'sort'
  const raw = useMemo(() => evaluateRaw(strategy), [strategy])
  const cases = s.debugCaseIds.map((id) => CASE_BY_ID[id])
  const allDecided = cases.every((c) => classification[c.id])

  if (beat === 'reveal') {
    return (
      <div className="col w-full fade-in" style={{ gap: 18 }}>
        <div className="center">
          <div className="label">くらべてみる</div>
          <h1 className="h1">ここが ちがった</h1>
        </div>
        <div className="twocol">
          <div className="twocol__side twocol__side--good">
            <div className="twocol__head">うまくいった検索</div>
            <QueryList results={raw.results.filter((r) => r.verdict === 'GOOD')} hint={s.hint.good} />
          </div>
          <div className="twocol__side twocol__side--bad">
            <div className="twocol__head">うまくいかなかった検索</div>
            <QueryList results={raw.results.filter((r) => r.verdict === 'BAD')} hint={s.hint.bad} />
          </div>
        </div>
        <div className="btn-row">
          <Button size="lg" onClick={() => onBeat('sort')}>じゃあ、わけてみる</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="col w-full fade-in" style={{ gap: 18 }}>
      <div className="center">
        <div className="label">わけてみる</div>
        <h1 className="h1">{s.debugQuestion}</h1>
      </div>
      <SortBoard
        strategy={strategy}
        label={s.label}
        color={s.color}
        cases={cases}
        classification={classification}
        onClassify={onClassify}
      />
      <div className="btn-row">
        <Button size="lg" disabled={!allDecided} onClick={onConfirm}>
          {allDecided ? 'この しくみで ためす！' : 'カードを ぜんぶ わけよう'}
        </Button>
      </div>
    </div>
  )
}

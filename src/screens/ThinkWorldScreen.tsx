import { useEffect, useState } from 'react'
import type { StrategyId } from '../game/types.ts'
import { pickResidualCase } from '../data/userTest.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import { Button } from '../components/ui.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

interface Props {
  tuned: StrategyId[]
  onNext: () => void
}

/**
 * Learning ⑤, first half. The result is on the table and the question is put
 * to the team before anyone offers a way of thinking about it. The scale bar
 * deliberately stops just short of the world.
 */
export function ThinkWorldScreen({ tuned, onNext }: Props) {
  const residualQuery = CASE_BY_ID[pickResidualCase(tuned).caseId].query
  const [askShown, setAskShown] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAskShown(true), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="col w-full fade-in" style={{ gap: 16, textAlign: 'center' }}>
      <ScaleBar at={2} stopBefore />
      <div className="tally">
        <div className="tally__row tally__row--ok"><b>9人</b> ほしい情報を 見つけられた</div>
        <div className="tally__row tally__row--still"><b>1人</b> まだ 少し 見つけにくそう<span className="chip">🔎 {residualQuery}</span></div>
      </div>
      <h1 className="h1">この結果、みんなは どう思う？</h1>
      <p className="sub">4人で 話してみよう。どんな答えでも いいよ</p>
      {askShown && <Button size="lg" className="pop-in" color="teal" onClick={onNext}>エンジニアプロに 聞いてみる</Button>}
    </div>
  )
}

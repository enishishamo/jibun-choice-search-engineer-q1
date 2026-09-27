import type { Decision } from '../game/machine.ts'
import type { StrategyId } from '../game/types.ts'
import { pickResidualCase } from '../data/userTest.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import { ClayAsset } from '../components/ClayAsset.tsx'
import type { AssetName } from '../game/types.ts'

interface Props {
  tuned: StrategyId[]
  onDecide: (d: Decision) => void
}

/**
 * Three equally valid choices. The evidence sits on the same screen so this
 * reads as a team judgement, not a quiz with one right answer.
 */
export function TeamDecisionScreen({ tuned, onDecide }: Props) {
  const residual = pickResidualCase(tuned)
  const residualQuery = CASE_BY_ID[residual.caseId].query
  const options: { d: Decision; label: string; sub: string; asset: AssetName }[] = [
    { d: 'A', label: 'このまま 届ける', sub: 'いまの しくみで 世界へ', asset: 'globe' },
    { d: 'B', label: '1つ 直してから 届ける', sub: 'あの検索を 直してから', asset: 'gear' },
    { d: 'C', label: 'もう少し 試してみる', sub: 'もう一度 人に 使ってもらう', asset: 'magnifier' },
  ]
  return (
    <div className="col w-full fade-in" style={{ gap: 20 }}>
      <div className="center">
        <h1 className="h1">じゃあ、みんなは 次に どうする？</h1>
        <p className="sub">4人で 決めよう。どれを えらんでも いいよ</p>
      </div>
      <div className="evidence">
        <span className="evidence__chip">10人に 試した</span>
        <span className="evidence__chip">9人が 見つけられた</span>
        <span className="evidence__chip evidence__chip--warn">🔎 {residualQuery} は まだ 見つけにくそう</span>
      </div>
      <div className="decisions">
        {options.map((o) => (
          <button key={o.d} type="button" className="decision" onClick={() => onDecide(o.d)}>
            <span className="decision__icon"><ClayAsset name={o.asset} size={44} /></span>
            <span className="decision__label">{o.label}</span>
            <span className="decision__sub">{o.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

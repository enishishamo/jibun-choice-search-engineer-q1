import type { StrategyId } from '../game/types.ts'
import { STRATEGY_BY_ID } from '../data/strategies.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import { Button, Notice } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

interface Props {
  strategy: StrategyId
  useIds: string[]
  onNext: () => void
}

/**
 * What the team actually built. The app shows their own split back to them —
 * it never rewrites it into a tidy "correct" rule. Meaning-making, if any,
 * belongs to Mei out loud.
 */
export function SystemUpdatedScreen({ strategy, useIds, onNext }: Props) {
  const s = STRATEGY_BY_ID[strategy]
  const all = s.debugCaseIds
  const skipIds = all.filter((id) => !useIds.includes(id))
  return (
    <div className="col w-full fade-in" style={{ gap: 20, alignItems: 'center' }}>
      <Notice color="teal"><ClayAsset name="gear" size={22} /> しくみが かわった！</Notice>
      <h2 className="h2">みんなの作戦</h2>
      <div className="ourrule" style={{ ['--accent' as string]: s.color }}>
        <div className="ourrule__col ourrule__col--use">
          <div className="ourrule__head">
            <span className="ourrule__icon"><ClayAsset name={s.asset} size={28} /></span>
            {s.tagline}
          </div>
          <ul>
            {useIds.map((id) => <li key={id}>{CASE_BY_ID[id].query}</li>)}
            {useIds.length === 0 && <li className="ourrule__none">なし</li>}
          </ul>
        </div>
        <div className="ourrule__col ourrule__col--skip">
          <div className="ourrule__head">今回は つかわない</div>
          <ul>
            {skipIds.map((id) => <li key={id}>{CASE_BY_ID[id].query}</li>)}
            {skipIds.length === 0 && <li className="ourrule__none">なし</li>}
          </ul>
        </div>
      </div>
      <Button size="lg" onClick={onNext}>この しくみで、もう一回 100件ためす！</Button>
    </div>
  )
}

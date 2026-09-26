import { useState } from 'react'
import type { StrategyId } from '../game/types.ts'
import { STRATEGIES } from '../data/strategies.ts'
import { ClayAsset } from '../components/ClayAsset.tsx'
import { Button } from '../components/ui.tsx'

interface Props {
  tuned: StrategyId[]
  onChoose: (s: StrategyId) => void
  onSkip: () => void
}

/**
 * Pick one hypothesis to try on all 100 searches. The first pick is
 * mandatory and shows all three cards straight away. The second round is a
 * bonus: the default path forward is "このまま すすむ", and the strategy
 * picker only appears once a team asks for it — so a second strategy never
 * reads as equal in weight to moving on.
 */
export function SystemModeScreen({ tuned, onChoose, onSkip }: Props) {
  const [sel, setSel] = useState<StrategyId | null>(null)
  const second = tuned.length > 0
  const [wantsSecond, setWantsSecond] = useState(false)
  const showPicker = !second || wantsSecond

  return (
    <div className="col w-full fade-in" style={{ gap: 20 }}>
      <div className="center">
        <div className="label">しくみを 変える</div>
        <h1 className="h1">{second ? 'このあと、どうする？' : '100件に、どんな作戦を 試してみる？'}</h1>
        {second && !showPicker && <p className="sub">もっと試したければ、もう1つ 別の作戦も 選べるよ</p>}
      </div>

      {second && !showPicker && (
        <div className="col center" style={{ gap: 12 }}>
          <Button size="lg" onClick={onSkip}>このまま すすむ</Button>
          <Button color="ghost" size="sm" onClick={() => setWantsSecond(true)}>もう1つの作戦も 試してみる</Button>
        </div>
      )}

      {showPicker && (
        <>
          <div className="strategies">
            {STRATEGIES.map((s) => {
              const done = tuned.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`strategy ${sel === s.id ? 'is-selected' : ''} ${done ? 'is-done' : ''}`}
                  style={{ ['--accent' as string]: s.color }}
                  disabled={done}
                  onClick={() => setSel(s.id)}
                  aria-pressed={sel === s.id}
                >
                  {done && <span className="strategy__done badge badge--FIXED">ためした</span>}
                  <div className="strategy__icon"><ClayAsset name={s.asset} size={52} /></div>
                  <div className="strategy__tag">{s.tagline}</div>
                  <div className="strategy__label">{s.label}</div>
                </button>
              )
            })}
          </div>
          <div className="btn-row">
            {second && <Button color="ghost" onClick={onSkip}>このまま すすむ</Button>}
            <Button size="lg" disabled={!sel} onClick={() => sel && onChoose(sel)}>この作戦で 100件ためす！</Button>
          </div>
        </>
      )}
    </div>
  )
}

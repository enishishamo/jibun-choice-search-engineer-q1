import { useEffect, useMemo, useState } from 'react'
import type { StrategyId } from '../game/types.ts'
import { STRATEGY_BY_ID } from '../data/strategies.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import { badCaseIds, evaluateRaw, evaluateWithRule, type CaseResult, type CheckSummary } from '../game/logic.ts'
import { Badge, Button, Notice } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

interface Props {
  strategy: StrategyId
  /** when set, this is the recheck with the team's own rule */
  rule?: string[]
  onNext: () => void
  onReclassify?: () => void
}

/**
 * The strategy is tried on all 100 searches. Searches scroll past one by one
 * and pick up a result; the ones that got worse drop into a tray on the side
 * and stay there, so the next screen opens the very cards the children saw
 * pile up. Counts are a small footnote — there is no score.
 */
export function BatchCheckScreen({ strategy, rule, onNext, onReclassify }: Props) {
  const s = STRATEGY_BY_ID[strategy]
  const isRecheck = !!rule
  const summary: CheckSummary = useMemo(() => (rule ? evaluateWithRule(strategy, rule) : evaluateRaw(strategy)), [strategy, rule])
  /** what the same 100 searches looked like before the team's rule */
  const before: CheckSummary = useMemo(() => evaluateRaw(strategy), [strategy])
  const seq = useMemo(() => displaySequence(summary.results), [summary])
  const prevBad = useMemo(() => (isRecheck ? badCaseIds(strategy) : []), [isRecheck, strategy])
  const [shown, setShown] = useState(0)
  const [skip, setSkip] = useState(false)

  const pace = isRecheck ? 190 : 320
  useEffect(() => {
    if (skip) { setShown(seq.length); return }
    if (shown >= seq.length) return
    const t = setTimeout(() => setShown((n) => Math.min(seq.length, n + 1)), shown === 0 ? 350 : pace)
    return () => clearTimeout(t)
  }, [shown, skip, seq.length, pace])

  const done = shown >= seq.length
  const revealed = seq.slice(0, shown)
  const checked = revealed.reduce((n, r) => n + r.count, 0)
  const visible = revealed.slice(-4)
  const trouble = revealed.filter((r) => r.verdict === 'BAD')
  const fixedNow = revealed.filter((r) => r.fixed)
  const badCases = summary.results.filter((r) => r.verdict === 'BAD')

  return (
    <div className="col w-full fade-in" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
        <span className="strategy__icon strategy__icon--sm" style={{ background: s.color }}><ClayAsset name={s.asset} size={28} /></span>
        <div>
          <div className="label">{isRecheck ? 'もう一回 ためす' : '100件 ためす'}</div>
          <div className="h2">{s.tagline}</div>
        </div>
      </div>

      <div className="checkboard">
        <div className="checkboard__stream" onClick={() => setSkip(true)} role="button" aria-label="とばす">
          <div className="checkboard__count">しらべた <strong>{checked}</strong> / 100</div>
          <div className="checkboard__list">
            {visible.map((r) => (
              <div key={r.caseId} className={`qcard qcard--${r.fixed ? 'FIXED' : r.verdict}`}>
                <ClayAsset name={CASE_BY_ID[r.caseId].asset} size={34} />
                <span className="qcard__q">🔎 {r.query}</span>
                <span className="qcard__v"><Badge v={r.fixed ? 'FIXED' : r.verdict} /></span>
              </div>
            ))}
          </div>
          {!done && <div className="checkboard__skip">タップで とばす</div>}
        </div>

        <aside className={`troubletray ${trouble.length ? 'is-filled' : ''}`}>
          <div className="troubletray__title">うまくいかなかった検索</div>
          {isRecheck ? (
            <div className="troubletray__items">
              {prevBad.map((id) => {
                const fixed = fixedNow.some((r) => r.caseId === id)
                const still = revealed.some((r) => r.caseId === id && r.verdict === 'BAD')
                return (
                  <div key={id} className={`troublechip ${fixed ? 'is-fixed' : still ? 'is-still' : 'is-waiting'}`}>
                    <ClayAsset name={CASE_BY_ID[id].asset} size={24} />
                    <span>{CASE_BY_ID[id].query}</span>
                    {fixed && <em>なおった！</em>}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="troubletray__items">
              {trouble.map((r) => (
                <div key={r.caseId} className="troublechip is-still pop-in">
                  <ClayAsset name={CASE_BY_ID[r.caseId].asset} size={24} />
                  <span>{r.query}</span>
                </div>
              ))}
              {trouble.length === 0 && <span className="troubletray__empty">まだ なし</span>}
            </div>
          )}
        </aside>
      </div>

      {done && !isRecheck && (
        <div className="col w-full pop-in" style={{ gap: 14 }}>
          <Notice color="coral">100件 ためした！</Notice>
          <div className="sumchips">
            <span className="sumchip sumchip--GOOD">よくなった <strong>{summary.good}</strong></span>
            <span className="sumchip sumchip--SAME">ほぼ同じ <strong>{summary.same}</strong></span>
            <span className="sumchip sumchip--BAD">こまった <strong>{summary.bad}</strong></span>
          </div>
          <div className="btn-row">
            <Button size="lg" onClick={onNext}>けっかを くらべてみる</Button>
          </div>
        </div>
      )}

      {done && isRecheck && (
        <div className="col w-full pop-in" style={{ gap: 14 }}>
          <Notice color="teal">もう一回 ためした！</Notice>

          {/* the point of this screen: what changed, not how big the numbers are */}
          <div className="ba">
            <div className="ba__head"><span /><span>さっき</span><span /><span>もう一回</span></div>
            <div className="ba__row">
              <span className="ba__label">よくなった</span>
              <span className="ba__n">{before.good}</span><span className="ba__to">→</span><span className="ba__n">{summary.good}</span>
            </div>
            <div className="ba__row">
              <span className="ba__label">ほぼ同じ</span>
              <span className="ba__n">{before.same}</span><span className="ba__to">→</span><span className="ba__n">{summary.same}</span>
            </div>
            <div className="ba__row ba__row--focus">
              <span className="ba__label">こまった</span>
              <span className="ba__n">{before.bad}</span><span className="ba__to">→</span><span className="ba__n ba__n--big">{summary.bad}</span>
            </div>
          </div>

          <div className="bigchange">
            こまった検索　<b>{before.bad}件</b> <span aria-hidden="true">→</span> <b className="bigchange__now">{summary.bad}件</b>
            {summary.bad < before.bad && <em>！</em>}
          </div>

          <div className="col" style={{ gap: 8, width: '100%', maxWidth: 560 }}>
            {prevBad.map((id) => {
              const now = summary.results.find((r) => r.caseId === id)
              const fixed = !!now?.fixed
              return (
                <div key={id} className={`baCard ${fixed ? 'is-fixed' : 'is-still'}`}>
                  <ClayAsset name={CASE_BY_ID[id].asset} size={30} />
                  <span className="baCard__q">🔎 {CASE_BY_ID[id].query}</span>
                  <span className="baCard__from">こまった</span>
                  <span aria-hidden="true">→</span>
                  <span className="baCard__to">{fixed ? 'なおった！' : 'まだ こまったまま'}</span>
                </div>
              )
            })}
          </div>

          <div className="btn-row">
            {badCases.length > 0 && onReclassify && <Button color="yellow" onClick={onReclassify}>もう一回 くらべる</Button>}
            <Button size="lg" color="teal" onClick={onNext}>つぎへ</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function displaySequence(results: CaseResult[]): CaseResult[] {
  const pools: Record<string, CaseResult[]> = {
    good: results.filter((r) => r.verdict === 'GOOD' && !r.fixed),
    same: results.filter((r) => r.verdict === 'SAME'),
    bad: results.filter((r) => r.verdict === 'BAD'),
    fixed: results.filter((r) => r.fixed),
  }
  const order = ['good', 'good', 'bad', 'same', 'fixed', 'good', 'bad', 'same', 'fixed', 'good', 'same']
  const out: CaseResult[] = []
  let i = 0
  while (out.length < results.length) {
    const want = order[i % order.length]
    i += 1
    const pool = pools[want].length ? pools[want] : Object.values(pools).find((p) => p.length)
    if (!pool || !pool.length) break
    out.push(pool.shift() as CaseResult)
  }
  return out
}

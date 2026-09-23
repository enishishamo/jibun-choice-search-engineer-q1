import { SEARCH_CASES, TOTAL_SEARCHES } from '../data/searchCases.ts'
import type { SearchCase, StrategyId, Verdict } from './types.ts'

export interface CaseResult {
  caseId: string
  query: string
  count: number
  verdict: Verdict
  /** true when a previously-BAD case is no longer hurt after the child's rule */
  fixed: boolean
}

export interface CheckSummary {
  results: CaseResult[]
  good: number
  same: number
  bad: number
  fixed: number
  total: number
}

/** Verdict when a strategy is applied to a case without any rule. */
export function rawVerdict(c: SearchCase, strategy: StrategyId): Verdict {
  if (c.helps.includes(strategy)) return 'GOOD'
  if (c.hurts.includes(strategy)) return 'BAD'
  return 'SAME'
}

/** STEP 5: apply the strategy bluntly to all 100 searches. */
export function evaluateRaw(strategy: StrategyId): CheckSummary {
  const results = SEARCH_CASES.map<CaseResult>((c) => ({
    caseId: c.id,
    query: c.query,
    count: c.count,
    verdict: rawVerdict(c, strategy),
    fixed: false,
  }))
  return summarize(results)
}

/**
 * RECHECK: the strategy applies only to cases the children put in "use".
 * Cases they excluded return to baseline. A previously hurt case that is now
 * excluded is reported as FIXED (BAD → GOOD). A previously helped case that is
 * excluded goes back to SAME — honest, not punished.
 */
export function evaluateWithRule(strategy: StrategyId, useCaseIds: string[]): CheckSummary {
  const use = new Set(useCaseIds)
  const results = SEARCH_CASES.map<CaseResult>((c) => {
    const raw = rawVerdict(c, strategy)
    if (use.has(c.id)) return { caseId: c.id, query: c.query, count: c.count, verdict: raw, fixed: false }
    if (raw === 'BAD') return { caseId: c.id, query: c.query, count: c.count, verdict: 'GOOD', fixed: true }
    return { caseId: c.id, query: c.query, count: c.count, verdict: 'SAME', fixed: false }
  })
  return summarize(results)
}

function summarize(results: CaseResult[]): CheckSummary {
  let good = 0, same = 0, bad = 0, fixed = 0
  for (const r of results) {
    if (r.fixed) fixed += r.count
    if (r.verdict === 'GOOD') good += r.count
    else if (r.verdict === 'BAD') bad += r.count
    else same += r.count
  }
  return { results, good, same, bad, fixed, total: TOTAL_SEARCHES }
}

/**
 * Expand case results into a deterministic stream of 100 items for the
 * fast-scrolling CHECK animation. Round-robin over cases so verdicts mix.
 */
export function expandStream(summary: CheckSummary): CaseResult[] {
  const remaining = summary.results.map((r) => ({ r, left: r.count }))
  const out: CaseResult[] = []
  while (out.length < summary.total) {
    let pushed = false
    for (const slot of remaining) {
      if (slot.left > 0) {
        out.push(slot.r)
        slot.left -= 1
        pushed = true
      }
    }
    if (!pushed) break
  }
  return out
}

/** Cases the strategy hurt when applied bluntly — the BAD files. */
export function badCaseIds(strategy: StrategyId): string[] {
  return SEARCH_CASES.filter((c) => c.hurts.includes(strategy)).map((c) => c.id)
}

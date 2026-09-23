import type { CaseResult } from '../game/logic.ts'

interface Props {
  results: CaseResult[]
  /** words to ring, once the children have had their own go at comparing */
  hint?: string[]
}

/** A column of searches, optionally with the telling word picked out. */
export function QueryList({ results, hint }: Props) {
  return (
    <ul>
      {results.map((r) => (
        <li key={r.caseId}>🔎 {mark(r.query, hint)}</li>
      ))}
    </ul>
  )
}

function mark(query: string, hint?: string[]) {
  const word = hint?.find((w) => query.includes(w))
  if (!word) return query
  const [head, ...tail] = query.split(word)
  return (
    <>
      {head}<mark className="patmark">{word}</mark>{tail.join(word)}
    </>
  )
}

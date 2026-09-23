// Core game types. Keep logic/data types here so screens stay presentational.

export type StrategyId = 'NEW' | 'EYES' | 'OFFICIAL'

export type Verdict = 'GOOD' | 'SAME' | 'BAD'

export type AssetName =
  | 'apple' | 'pie' | 'phone' | 'laptop'
  | 'sun' | 'rain' | 'cloud' | 'calendar'
  | 'train' | 'photo' | 'zoo' | 'clock' | 'ticket' | 'dog' | 'science' | 'play' | 'game' | 'news'
  | 'umbrella' | 'magnifier' | 'globe' | 'sparkle' | 'mail' | 'gear'
  | 'fresh' | 'eyes' | 'stamp'

export type UserKind = 'girl' | 'boy' | 'grandpa' | 'mom' | 'dad' | 'teen' | 'grandma'

/** One search result card the child can reorder. */
export interface ResultCard {
  id: string
  title: string
  /** short meta chips, e.g. "3日前に更新" */
  meta?: string[]
  asset: AssetName
}

/** A single "USER VOICE" task: one user, one query, cards to reorder. */
export interface VoiceTask {
  id: string
  user: UserKind
  userName: string
  voice: string
  query: string
  cards: ResultCard[]
  /** which card must be on top for the user to be satisfied */
  solvedTopId: string
  /** reactions when the user opens the top card */
  solvedLine: string
  solvedAsset: AssetName
  /** fail reaction keyed by the card the user opened; fallback used otherwise */
  failLines: Record<string, string>
  failFallback: string
  /** what the user types when they retry */
  requery: string
}

/** Representative search case for the 100-search system. */
export interface SearchCase {
  id: string
  query: string
  /** what the user actually wants, shown inside BAD files */
  intent: string
  /** how many of the 100 searches this case represents */
  count: number
  /** strategies that genuinely help this search */
  helps: StrategyId[]
  /** strategies that, applied bluntly, hurt this search */
  hurts: StrategyId[]
  asset: AssetName
}

/** How a strategy shows a BAD case to the child (before/after lists + user line). */
export interface BadFile {
  caseId: string
  user: UserKind
  userName: string
  after: { title: string; move: 'up' | 'down' | 'same' }[]
  userLine: string
}

export interface Strategy {
  id: StrategyId
  label: string
  tagline: string
  asset: AssetName
  color: string
  /** debug question, e.g. "新しい情報を大事にするのは、どんな検索？" */
  debugQuestion: string
  useLabel: string
  skipLabel: string
  /**
   * Words worth noticing once the children have already compared the two
   * groups themselves. Only revealed after they have thought and after the
   * engineer has shown *how* to compare — never before.
   */
  hint: { good: string[]; bad: string[] }
  /** which cases are shown as classification cards */
  debugCaseIds: string[]
  badFiles: BadFile[]
}

export interface TestUser {
  kind: UserKind
  name: string
  mood: 'happy' | 'meh'
  /** what this person searched for during the test */
  query: string
  /** what they wanted to know — shown for the slowly-played people */
  need?: string
  line?: string
  /** what this person can now go and do — shown for the slowly-played people */
  nextAction?: string
  asset?: AssetName
}

/** Residual "少し探しにくかった" case used in USER TEST / LAST DEBUG. */
export interface ResidualCase {
  caseId: string
  user: UserKind
  userName: string
  line: string
  results: { title: string; asset: AssetName }[]
  /** which strategy fixes it */
  fixStrategy: StrategyId
  fixedResults: { title: string; asset: AssetName }[]
  fixedLine: string
  stillLine: string
}

import type { StrategyId } from './types.ts'

export type Phase =
  | 'TITLE'
  | 'USER_VOICE_INTRO'
  | 'USER_VOICE_1'
  | 'USER_VOICE_2'
  | 'SEARCH_RUSH'
  | 'RUSH_STOP'
  | 'PRO_1'
  | 'BRIDGE_TO_SYSTEM'
  | 'PATTERN'
  | 'SYSTEM_MODE'
  | 'BATCH_CHECK'
  | 'BAD_INSPECTION'
  | 'PRO_2'
  | 'DEBUG_CLASSIFY'
  | 'SYSTEM_UPDATED'
  | 'RECHECK'
  | 'LEARN_TRY'
  | 'THINK_RELEASE'
  | 'PRO_3'
  | 'BRIDGE_TO_USERTEST'
  | 'USER_TEST'
  | 'THINK_WORLD'
  | 'PRO_4'
  | 'LEARN_DECIDE'
  | 'TEAM_DECISION'
  | 'DIRECT_RELEASE'
  | 'LAST_DEBUG'
  | 'EXTRA_TEST'
  | 'READY_TO_RELEASE'
  | 'RELEASE'
  | 'ENDING'
  | 'PRO_FINAL'

export const PHASES: Phase[] = [
  'TITLE', 'USER_VOICE_INTRO', 'USER_VOICE_1', 'USER_VOICE_2', 'SEARCH_RUSH', 'RUSH_STOP', 'PRO_1',
  'BRIDGE_TO_SYSTEM', 'PATTERN', 'SYSTEM_MODE', 'BATCH_CHECK', 'BAD_INSPECTION', 'PRO_2',
  'DEBUG_CLASSIFY', 'SYSTEM_UPDATED', 'RECHECK', 'LEARN_TRY', 'THINK_RELEASE', 'PRO_3',
  'BRIDGE_TO_USERTEST', 'USER_TEST', 'THINK_WORLD', 'PRO_4', 'LEARN_DECIDE', 'TEAM_DECISION',
  'DIRECT_RELEASE', 'LAST_DEBUG', 'EXTRA_TEST', 'READY_TO_RELEASE', 'RELEASE',
  'ENDING', 'PRO_FINAL',
]

/**
 * Every screen the game can show, in order, counting a beat inside a phase as
 * its own screen. This list is for the facilitator's step controls only —
 * normal play still follows `nextPhase` and its conditions.
 */
export interface ScreenRef { phase: Phase; beat: string }

export const SCREENS: ScreenRef[] = [
  { phase: 'TITLE', beat: '' },
  { phase: 'USER_VOICE_INTRO', beat: '' },
  { phase: 'USER_VOICE_1', beat: '' },
  { phase: 'USER_VOICE_2', beat: '' },
  { phase: 'SEARCH_RUSH', beat: '' },
  { phase: 'RUSH_STOP', beat: '' },
  { phase: 'RUSH_STOP', beat: 'think' },
  { phase: 'RUSH_STOP', beat: 'ask' },
  { phase: 'PRO_1', beat: '' },
  { phase: 'BRIDGE_TO_SYSTEM', beat: '' },
  { phase: 'BRIDGE_TO_SYSTEM', beat: 'line' },
  { phase: 'PATTERN', beat: '' },
  { phase: 'PATTERN', beat: 'pro-reveal' },
  { phase: 'PATTERN', beat: 'child' },
  { phase: 'PATTERN', beat: 'child-reveal' },
  { phase: 'PATTERN', beat: 'third' },
  { phase: 'PATTERN', beat: 'third-reveal' },
  { phase: 'PATTERN', beat: 'sum' },
  { phase: 'SYSTEM_MODE', beat: '' },
  { phase: 'BATCH_CHECK', beat: '' },
  { phase: 'BAD_INSPECTION', beat: '' },
  { phase: 'BAD_INSPECTION', beat: 'look' },
  { phase: 'BAD_INSPECTION', beat: 'think' },
  { phase: 'PRO_2', beat: '' },
  { phase: 'DEBUG_CLASSIFY', beat: '' },
  { phase: 'DEBUG_CLASSIFY', beat: 'sort' },
  { phase: 'SYSTEM_UPDATED', beat: '' },
  { phase: 'RECHECK', beat: '' },
  { phase: 'LEARN_TRY', beat: '' },
  { phase: 'THINK_RELEASE', beat: '' },
  { phase: 'THINK_RELEASE', beat: 'ask' },
  { phase: 'PRO_3', beat: '' },
  { phase: 'BRIDGE_TO_USERTEST', beat: '' },
  { phase: 'USER_TEST', beat: '' },
  { phase: 'THINK_WORLD', beat: '' },
  { phase: 'PRO_4', beat: '' },
  { phase: 'LEARN_DECIDE', beat: '' },
  { phase: 'TEAM_DECISION', beat: '' },
  { phase: 'DIRECT_RELEASE', beat: '' },
  { phase: 'LAST_DEBUG', beat: '' },
  { phase: 'EXTRA_TEST', beat: '' },
  { phase: 'READY_TO_RELEASE', beat: '' },
  { phase: 'READY_TO_RELEASE', beat: 'ok' },
  { phase: 'RELEASE', beat: '' },
  { phase: 'ENDING', beat: '' },
  { phase: 'PRO_FINAL', beat: '' },
]

/** Where a phase+beat sits in the screen list, or -1 when it is not listed. */
export function screenIndex(phase: Phase, beat: string): number {
  const exact = SCREENS.findIndex((x) => x.phase === phase && x.beat === beat)
  return exact >= 0 ? exact : SCREENS.findIndex((x) => x.phase === phase)
}

/**
 * Screens that cannot render without a strategy picked. When a facilitator
 * steps into one during a preview, a placeholder is filled in so the screen is
 * viewable; it is only ever written when the slot is empty, so it can never
 * overwrite what a team actually chose.
 */
const NEEDS_STRATEGY: Phase[] = ['BATCH_CHECK', 'BAD_INSPECTION', 'DEBUG_CLASSIFY', 'SYSTEM_UPDATED', 'RECHECK']

export type Decision = 'A' | 'B' | 'C'

export type Classification = Record<string, 'use' | 'skip' | undefined>

export interface GameState {
  phase: Phase
  /** how many SEARCH RUSH voices have been solved (0..3) */
  rushSolved: number
  /** strategy currently being tried */
  strategy: StrategyId | null
  /** strategies that went through DEBUG + RECHECK, with the child's rule */
  rules: Partial<Record<StrategyId, string[]>>
  /** order in which strategies were tuned */
  tuned: StrategyId[]
  /** current DEBUG classification */
  classification: Classification
  decision: Decision | null
  /** LAST_DEBUG: strategy the team picked for the residual case */
  lastDebugPick: StrategyId | null
  lastDebugFixed: boolean
  /**
   * Which beat of a multi-beat screen is showing. Kept here rather than in the
   * screen so the facilitator's one-step undo can step back inside a phase.
   * Cleared automatically whenever the phase changes.
   */
  beat: string
  /** READY_TO_RELEASE: which of the three OKs are in */
  oks: boolean[]
}

export const MAX_STRATEGIES_PER_PLAY = 2

export const initialState: GameState = {
  phase: 'TITLE',
  rushSolved: 0,
  strategy: null,
  rules: {},
  tuned: [],
  classification: {},
  decision: null,
  lastDebugPick: null,
  lastDebugFixed: false,
  beat: '',
  oks: [false, false, false],
}

export type Action =
  | { type: 'VOICE_SOLVED' }
  | { type: 'RUSH_SOLVED' }
  | { type: 'NEXT' }
  | { type: 'CHOOSE_STRATEGY'; strategy: StrategyId }
  | { type: 'SKIP_MORE_STRATEGIES' }
  | { type: 'CLASSIFY'; caseId: string; bucket: 'use' | 'skip' | undefined }
  | { type: 'CONFIRM_CLASSIFICATION' }
  | { type: 'RECLASSIFY' }
  | { type: 'DECIDE'; decision: Decision }
  | { type: 'LAST_DEBUG_PICK'; strategy: StrategyId; fixes: boolean }
  | { type: 'JUMP'; phase: Phase }
  | { type: 'SET_BEAT'; beat: string }
  | { type: 'SET_OK'; index: number }
  /** facilitator-only: move one screen, ignoring the normal conditions */
  | { type: 'FAC_STEP'; dir: 1 | -1 }
  | { type: 'RESET' }

/**
 * Explicit macro-level transitions. Screens own only their animation state;
 * anything a facilitator might need to step back through lives here.
 */
export function reducer(state: GameState, action: Action): GameState {
  const next = core(state, action)
  // stepping by screen sets the beat on purpose, so it is not reset here
  if (action.type === 'FAC_STEP') return next
  // a new phase always starts on its first beat
  return next.phase === state.phase ? next : { ...next, beat: '' }
}

function core(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'RESET':
      return initialState
    case 'JUMP':
      return { ...state, phase: action.phase }

    case 'SET_BEAT':
      return state.beat === action.beat ? state : { ...state, beat: action.beat }

    case 'FAC_STEP': {
      const here = SCREENS.findIndex((x) => x.phase === state.phase && x.beat === state.beat)
      const from = here >= 0 ? here : SCREENS.findIndex((x) => x.phase === state.phase)
      if (from < 0) return state
      const to = from + action.dir
      if (to < 0 || to >= SCREENS.length) return state
      const target = SCREENS[to]
      const moved: GameState = { ...state, phase: target.phase, beat: target.beat }
      return NEEDS_STRATEGY.includes(target.phase) && !moved.strategy
        ? { ...moved, strategy: 'NEW' }
        : moved
    }

    case 'SET_OK':
      return state.oks[action.index]
        ? state
        : { ...state, oks: state.oks.map((v, i) => (i === action.index ? true : v)) }

    case 'VOICE_SOLVED':
      if (state.phase === 'USER_VOICE_1') return { ...state, phase: 'USER_VOICE_2' }
      if (state.phase === 'USER_VOICE_2') return { ...state, phase: 'SEARCH_RUSH', rushSolved: 0 }
      return state

    case 'RUSH_SOLVED': {
      const n = state.rushSolved + 1
      if (n >= 3) return { ...state, rushSolved: n, phase: 'RUSH_STOP' }
      return { ...state, rushSolved: n }
    }

    case 'CHOOSE_STRATEGY':
      if (state.phase !== 'SYSTEM_MODE') return state
      return { ...state, strategy: action.strategy, classification: {}, phase: 'BATCH_CHECK' }

    case 'SKIP_MORE_STRATEGIES':
      return { ...state, phase: 'LEARN_TRY' }

    case 'CLASSIFY':
      return { ...state, classification: { ...state.classification, [action.caseId]: action.bucket } }

    case 'CONFIRM_CLASSIFICATION': {
      if (!state.strategy) return state
      const use = Object.entries(state.classification)
        .filter(([, b]) => b === 'use')
        .map(([id]) => id)
      const tuned = state.tuned.includes(state.strategy) ? state.tuned : [...state.tuned, state.strategy]
      return {
        ...state,
        rules: { ...state.rules, [state.strategy]: use },
        tuned,
        phase: 'SYSTEM_UPDATED',
      }
    }

    case 'RECLASSIFY':
      return { ...state, phase: 'DEBUG_CLASSIFY' }

    case 'DECIDE': {
      const phase: Phase = action.decision === 'A' ? 'DIRECT_RELEASE' : action.decision === 'B' ? 'LAST_DEBUG' : 'EXTRA_TEST'
      return { ...state, decision: action.decision, phase }
    }

    case 'LAST_DEBUG_PICK':
      return { ...state, lastDebugPick: action.strategy, lastDebugFixed: action.fixes }

    case 'NEXT':
      return { ...state, phase: nextPhase(state) }
  }
}

function nextPhase(s: GameState): Phase {
  switch (s.phase) {
    case 'TITLE': return 'USER_VOICE_INTRO'
    case 'USER_VOICE_INTRO': return 'USER_VOICE_1'
    case 'RUSH_STOP': return 'PRO_1'
    case 'PRO_1': return 'BRIDGE_TO_SYSTEM'
    case 'BRIDGE_TO_SYSTEM': return 'PATTERN'
    case 'PATTERN': return 'SYSTEM_MODE'
    case 'BATCH_CHECK': return 'BAD_INSPECTION'
    case 'BAD_INSPECTION': return 'PRO_2'
    case 'PRO_2': return 'DEBUG_CLASSIFY'
    case 'SYSTEM_UPDATED': return 'RECHECK'
    case 'RECHECK':
      // the "try it, compare it, fix it" recap is shown once, at the end of the loop
      return s.tuned.length >= MAX_STRATEGIES_PER_PLAY ? 'LEARN_TRY' : 'SYSTEM_MODE'
    case 'LEARN_TRY': return 'THINK_RELEASE'
    case 'THINK_RELEASE': return 'PRO_3'
    case 'PRO_3': return 'BRIDGE_TO_USERTEST'
    case 'BRIDGE_TO_USERTEST': return 'USER_TEST'
    case 'USER_TEST': return 'THINK_WORLD'
    case 'THINK_WORLD': return 'PRO_4'
    case 'PRO_4': return 'LEARN_DECIDE'
    case 'LEARN_DECIDE': return 'TEAM_DECISION'
    case 'DIRECT_RELEASE':
    case 'LAST_DEBUG':
    case 'EXTRA_TEST':
      return 'READY_TO_RELEASE'
    case 'READY_TO_RELEASE': return 'RELEASE'
    case 'RELEASE': return 'ENDING'
    case 'ENDING': return 'PRO_FINAL'
    default: return s.phase
  }
}


/* ---------------------------------------------------------------------------
 * Facilitator undo
 *
 * The event runs live, so a mis-tap on "next" has to be recoverable. Every
 * action pushes the state it replaced onto a short stack, and UNDO pops it.
 * The stack is deliberately NOT part of GameState: only the present is saved
 * to sessionStorage, so snapshots never nest and a reload simply starts the
 * history again from wherever the game is.
 * ------------------------------------------------------------------------- */

export interface Session {
  present: GameState
  past: GameState[]
}

const MAX_HISTORY = 40

export type SessionAction = Action | { type: 'UNDO' }

export function initialSession(present: GameState): Session {
  return { present, past: [] }
}

export function sessionReducer(session: Session, action: SessionAction): Session {
  if (action.type === 'UNDO') {
    if (session.past.length === 0) return session
    return {
      present: session.past[session.past.length - 1],
      past: session.past.slice(0, -1),
    }
  }
  if (action.type === 'RESET') {
    return { present: reducer(session.present, action), past: [] }
  }
  const present = reducer(session.present, action)
  // no-op actions must not fill the history with identical entries
  if (present === session.present) return session
  return { present, past: [...session.past, session.present].slice(-MAX_HISTORY) }
}

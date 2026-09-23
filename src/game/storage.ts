import { initialState, PHASES, type GameState } from './machine.ts'

const KEY = 'jibun-choice-search-engineer-q1/state'

/** Persist macro state so an accidental reload at the event does not lose progress. */
export function loadState(): GameState {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<GameState>
    if (!parsed.phase || !PHASES.includes(parsed.phase)) return initialState
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

export function saveState(state: GameState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage may be unavailable (private mode); the game still works in memory
  }
}

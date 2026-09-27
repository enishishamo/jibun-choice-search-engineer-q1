import { test } from 'node:test'
import assert from 'node:assert/strict'
import { evaluateRaw, evaluateWithRule, expandStream, badCaseIds } from '../src/game/logic.ts'
import { reducer, initialState, initialSession, sessionReducer, SCREENS, PHASES, type GameState } from '../src/game/machine.ts'
import { TOTAL_SEARCHES } from '../src/data/searchCases.ts'
import { STRATEGIES } from '../src/data/strategies.ts'
import { pickResidualCase } from '../src/data/userTest.ts'

test('the game starts on the title screen', () => {
  assert.equal(initialState.phase, 'TITLE')
  const intro = reducer(initialState, { type: 'NEXT' })
  assert.equal(intro.phase, 'USER_VOICE_INTRO')
  assert.equal(reducer(intro, { type: 'NEXT' }).phase, 'USER_VOICE_1')
})

test('100 searches sum to 100', () => {
  assert.equal(TOTAL_SEARCHES, 100)
})

test('raw NEW check: 東京 昔の写真 is BAD, 明日の天気 is GOOD, no score', () => {
  const s = evaluateRaw('NEW')
  const byId = Object.fromEntries(s.results.map((r) => [r.caseId, r.verdict]))
  assert.equal(byId['tokyo-old-photo'], 'BAD')
  assert.equal(byId['typhoon-10y'], 'BAD')
  assert.equal(byId['tokyo-tomorrow'], 'GOOD')
  assert.equal(byId['free-research'], 'SAME')
  assert.equal(s.good + s.same + s.bad, 100)
})

test('every strategy has at least one BAD when applied bluntly (never stuck)', () => {
  for (const st of STRATEGIES) {
    assert.ok(badCaseIds(st.id).length >= 1, st.id)
    // every bad file refers to a case that is actually hurt
    for (const bf of st.badFiles) assert.ok(badCaseIds(st.id).includes(bf.caseId), `${st.id}:${bf.caseId}`)
    // all debug cards exist and include the hurt ones
    for (const id of badCaseIds(st.id)) assert.ok(st.debugCaseIds.includes(id))
  }
})

test('recheck with a sensible rule fixes BAD and keeps GOOD', () => {
  const s = evaluateWithRule('NEW', ['tokyo-tomorrow', 'train-today', 'game-update'])
  const byId = Object.fromEntries(s.results.map((r) => [r.caseId, r]))
  assert.equal(byId['tokyo-old-photo'].verdict, 'GOOD')
  assert.equal(byId['tokyo-old-photo'].fixed, true)
  assert.equal(byId['tokyo-tomorrow'].verdict, 'GOOD')
  assert.equal(s.bad, 0)
})

test('recheck is honest: including a hurt case keeps it BAD', () => {
  const s = evaluateWithRule('NEW', ['tokyo-old-photo'])
  const byId = Object.fromEntries(s.results.map((r) => [r.caseId, r]))
  assert.equal(byId['tokyo-old-photo'].verdict, 'BAD')
  assert.equal(byId['tokyo-tomorrow'].verdict, 'SAME')
})

test('stream is deterministic and 100 long', () => {
  const a = expandStream(evaluateRaw('EYES')).map((r) => r.caseId + r.verdict).join(',')
  const b = expandStream(evaluateRaw('EYES')).map((r) => r.caseId + r.verdict).join(',')
  assert.equal(a, b)
  assert.equal(a.split(',').length, 100)
})

test('residual case never targets an already-tuned strategy', () => {
  assert.equal(pickResidualCase([]).fixStrategy, 'OFFICIAL')
  assert.equal(pickResidualCase(['OFFICIAL']).fixStrategy, 'EYES')
  assert.equal(pickResidualCase(['OFFICIAL', 'EYES']).fixStrategy, 'NEW')
})

function run(actions: Parameters<typeof reducer>[1][], from: GameState = initialState) {
  return actions.reduce(reducer, from)
}

test('macro flow: title → voices → rush → pro → learning → system mode', () => {
  const s = run([
    { type: 'NEXT' }, { type: 'NEXT' },
    { type: 'VOICE_SOLVED' }, { type: 'VOICE_SOLVED' },
    { type: 'RUSH_SOLVED' }, { type: 'RUSH_SOLVED' }, { type: 'RUSH_SOLVED' },
    { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
  ])
  assert.equal(s.phase, 'SYSTEM_MODE')
})

test('one strategy → second offered; two → release question; B route never returns to first half', () => {
  const afterOne = run([
    { type: 'JUMP', phase: 'SYSTEM_MODE' },
    { type: 'CHOOSE_STRATEGY', strategy: 'OFFICIAL' },
    { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
    { type: 'CLASSIFY', caseId: 'event-time', bucket: 'use' },
    { type: 'CONFIRM_CLASSIFICATION' }, { type: 'NEXT' }, { type: 'NEXT' },
  ])
  assert.equal(afterOne.phase, 'SYSTEM_MODE')
  assert.deepEqual(afterOne.tuned, ['OFFICIAL'])
  const afterTwo = run([
    { type: 'CHOOSE_STRATEGY', strategy: 'EYES' },
    { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
    { type: 'CONFIRM_CLASSIFICATION' }, { type: 'NEXT' }, { type: 'NEXT' },
  ], afterOne)
  assert.equal(afterTwo.phase, 'LEARN_TRY')
  const b = run([
    { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
    { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' },
    { type: 'DECIDE', decision: 'B' },
  ], afterTwo)
  assert.equal(b.phase, 'LAST_DEBUG')
  const rel = run([{ type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }, { type: 'NEXT' }], b)
  assert.equal(rel.phase, 'PRO_FINAL')
})

test('skip after one strategy still goes through the try recap', () => {
  const s = run([{ type: 'JUMP', phase: 'SYSTEM_MODE' }, { type: 'SKIP_MORE_STRATEGIES' }])
  assert.equal(s.phase, 'LEARN_TRY')
  assert.equal(reducer(s, { type: 'NEXT' }).phase, 'THINK_RELEASE')
})

test('each learning screen sits between the children thinking and the pro', () => {
  const step = (phase: Parameters<typeof reducer>[0]['phase']) =>
    reducer({ ...initialState, phase }, { type: 'NEXT' }).phase
  // ① widen the view, then the children work out what the mechanism should be
  assert.equal(step('PRO_1'), 'BRIDGE_TO_SYSTEM')
  assert.equal(step('BRIDGE_TO_SYSTEM'), 'PATTERN')
  assert.equal(step('PATTERN'), 'SYSTEM_MODE')
  // ③ compare inside the bad-search screen, then the pro, then sorting
  assert.equal(step('BAD_INSPECTION'), 'PRO_2')
  assert.equal(step('PRO_2'), 'DEBUG_CLASSIFY')
  assert.equal(step('LEARN_TRY'), 'THINK_RELEASE')
  // ⑤ the team is asked first, the pro second, the recap third
  assert.equal(step('USER_TEST'), 'THINK_WORLD')
  assert.equal(step('THINK_WORLD'), 'PRO_4')
  assert.equal(step('PRO_4'), 'LEARN_DECIDE')
  assert.equal(step('LEARN_DECIDE'), 'TEAM_DECISION')
})

test('every pro moment is preceded by a screen where the children think', () => {
  // PRO_1 ← RUSH_STOP (think beats), PRO_2 ← BAD_INSPECTION (think beat),
  // PRO_3 ← THINK_RELEASE, and each is followed by a concrete-example screen.
  assert.equal(reducer({ ...initialState, phase: 'RUSH_STOP' }, { type: 'NEXT' }).phase, 'PRO_1')
  assert.equal(reducer({ ...initialState, phase: 'PRO_1' }, { type: 'NEXT' }).phase, 'BRIDGE_TO_SYSTEM')
  assert.equal(reducer({ ...initialState, phase: 'BAD_INSPECTION' }, { type: 'NEXT' }).phase, 'PRO_2')
  assert.equal(reducer({ ...initialState, phase: 'PRO_2' }, { type: 'NEXT' }).phase, 'DEBUG_CLASSIFY')
  assert.equal(reducer({ ...initialState, phase: 'THINK_RELEASE' }, { type: 'NEXT' }).phase, 'PRO_3')
  assert.equal(reducer({ ...initialState, phase: 'PRO_3' }, { type: 'NEXT' }).phase, 'BRIDGE_TO_USERTEST')
  assert.equal(reducer({ ...initialState, phase: 'BRIDGE_TO_USERTEST' }, { type: 'NEXT' }).phase, 'USER_TEST')
})


/* --- facilitator undo ---------------------------------------------------- */

test('undo steps back across a phase boundary and restores the state', () => {
  let s = initialSession(initialState)
  s = sessionReducer(s, { type: 'NEXT' })            // TITLE → USER_VOICE_INTRO
  s = sessionReducer(s, { type: 'NEXT' })            // → USER_VOICE_1
  s = sessionReducer(s, { type: 'VOICE_SOLVED' })    // → USER_VOICE_2
  assert.equal(s.present.phase, 'USER_VOICE_2')
  s = sessionReducer(s, { type: 'UNDO' })
  assert.equal(s.present.phase, 'USER_VOICE_1')
  s = sessionReducer(s, { type: 'UNDO' })
  assert.equal(s.present.phase, 'USER_VOICE_INTRO')
  s = sessionReducer(s, { type: 'UNDO' })
  assert.equal(s.present.phase, 'TITLE')
  // and forward again as normal
  s = sessionReducer(s, { type: 'NEXT' })
  assert.equal(s.present.phase, 'USER_VOICE_INTRO')
})

test('undo steps back one beat inside a phase', () => {
  let s = initialSession({ ...initialState, phase: 'RUSH_STOP' })
  s = sessionReducer(s, { type: 'SET_BEAT', beat: 'think' })
  s = sessionReducer(s, { type: 'SET_BEAT', beat: 'ask' })
  assert.equal(s.present.beat, 'ask')
  s = sessionReducer(s, { type: 'UNDO' })
  assert.equal(s.present.beat, 'think')
  assert.equal(s.present.phase, 'RUSH_STOP')
})

test('a new phase always starts on its first beat', () => {
  const s = reducer({ ...initialState, phase: 'RUSH_STOP', beat: 'ask' }, { type: 'NEXT' })
  assert.equal(s.phase, 'PRO_1')
  assert.equal(s.beat, '')
})

test('undo restores state changed by an action: classification, decision, OKs', () => {
  let s = initialSession({ ...initialState, phase: 'DEBUG_CLASSIFY', strategy: 'NEW' })
  s = sessionReducer(s, { type: 'CLASSIFY', caseId: 'tokyo-tomorrow', bucket: 'use' })
  s = sessionReducer(s, { type: 'CLASSIFY', caseId: 'tokyo-old-photo', bucket: 'skip' })
  s = sessionReducer(s, { type: 'UNDO' })
  assert.equal(s.present.classification['tokyo-old-photo'], undefined)
  assert.equal(s.present.classification['tokyo-tomorrow'], 'use')

  let d = initialSession({ ...initialState, phase: 'TEAM_DECISION' })
  d = sessionReducer(d, { type: 'DECIDE', decision: 'B' })
  assert.equal(d.present.phase, 'LAST_DEBUG')
  d = sessionReducer(d, { type: 'UNDO' })
  assert.equal(d.present.phase, 'TEAM_DECISION')
  assert.equal(d.present.decision, null)

  let o = initialSession({ ...initialState, phase: 'READY_TO_RELEASE', beat: 'ok' })
  o = sessionReducer(o, { type: 'SET_OK', index: 0 })
  o = sessionReducer(o, { type: 'SET_OK', index: 1 })
  assert.deepEqual(o.present.oks, [true, true, false, false])
  o = sessionReducer(o, { type: 'UNDO' })
  assert.deepEqual(o.present.oks, [true, false, false, false])
})

test('undo is a no-op with nothing to undo, and reset clears the history', () => {
  const empty = initialSession(initialState)
  assert.equal(sessionReducer(empty, { type: 'UNDO' }), empty)

  let s = initialSession(initialState)
  s = sessionReducer(s, { type: 'NEXT' })
  s = sessionReducer(s, { type: 'RESET' })
  assert.equal(s.past.length, 0)
  assert.equal(sessionReducer(s, { type: 'UNDO' }).present.phase, 'TITLE')
})

test('no-op actions do not fill the history', () => {
  let s = initialSession({ ...initialState, phase: 'SYSTEM_MODE' })
  s = sessionReducer(s, { type: 'VOICE_SOLVED' })  // meaningless here
  assert.equal(s.past.length, 0)
})


/* --- facilitator screen stepping ----------------------------------------- */

test('the screen list covers every phase and has no duplicates', () => {
  const seen = new Set(SCREENS.map((s) => `${s.phase}/${s.beat}`))
  assert.equal(seen.size, SCREENS.length)
  for (const p of PHASES) {
    assert.ok(SCREENS.some((s) => s.phase === p), `missing screen for ${p}`)
  }
})

test('stepping moves one screen, including beats inside a phase', () => {
  // into the beats of a phase and back out again
  let s: GameState = { ...initialState, phase: 'RUSH_STOP', beat: '' }
  s = reducer(s, { type: 'FAC_STEP', dir: 1 })
  assert.deepEqual([s.phase, s.beat], ['RUSH_STOP', 'think'])
  s = reducer(s, { type: 'FAC_STEP', dir: 1 })
  assert.deepEqual([s.phase, s.beat], ['RUSH_STOP', 'ask'])
  s = reducer(s, { type: 'FAC_STEP', dir: 1 })
  assert.deepEqual([s.phase, s.beat], ['PRO_1', ''])
  s = reducer(s, { type: 'FAC_STEP', dir: -1 })
  assert.deepEqual([s.phase, s.beat], ['RUSH_STOP', 'ask'])
})

test('stepping stops at both ends instead of falling off', () => {
  const first = reducer({ ...initialState, phase: 'TITLE', beat: '' }, { type: 'FAC_STEP', dir: -1 })
  assert.equal(first.phase, 'TITLE')
  const last = reducer({ ...initialState, phase: 'PRO_FINAL', beat: '' }, { type: 'FAC_STEP', dir: 1 })
  assert.equal(last.phase, 'PRO_FINAL')
})

test('stepping into a strategy screen fills a placeholder, and never overwrites a real choice', () => {
  const blank = reducer({ ...initialState, phase: 'SYSTEM_MODE', beat: '' }, { type: 'FAC_STEP', dir: 1 })
  assert.equal(blank.phase, 'BATCH_CHECK')
  assert.equal(blank.strategy, 'NEW')

  const chosen = reducer(
    { ...initialState, phase: 'SYSTEM_MODE', beat: '', strategy: 'OFFICIAL' },
    { type: 'FAC_STEP', dir: 1 },
  )
  assert.equal(chosen.strategy, 'OFFICIAL')
})

test('stepping never loosens normal play', () => {
  // choosing a strategy is still the only way normal play leaves SYSTEM_MODE
  const s = reducer({ ...initialState, phase: 'SYSTEM_MODE' }, { type: 'NEXT' })
  assert.equal(s.phase, 'SYSTEM_MODE')
  // and an unfinished classification still confirms into the team's own rule
  const d = reducer({ ...initialState, phase: 'DEBUG_CLASSIFY', strategy: 'NEW' }, { type: 'CONFIRM_CLASSIFICATION' })
  assert.deepEqual(d.rules.NEW, [])
})

test('facilitator steps are undoable like any other action', () => {
  let s = initialSession({ ...initialState, phase: 'RUSH_STOP', beat: '' })
  s = sessionReducer(s, { type: 'FAC_STEP', dir: 1 })
  s = sessionReducer(s, { type: 'FAC_STEP', dir: 1 })
  assert.equal(s.present.beat, 'ask')
  s = sessionReducer(s, { type: 'UNDO' })
  assert.equal(s.present.beat, 'think')
})

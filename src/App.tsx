import { useEffect, useReducer } from 'react'
import { initialSession, sessionReducer, type GameState } from './game/machine.ts'
import { loadState, saveState } from './game/storage.ts'
import { Frame } from './components/Frame.tsx'
import { VOICE_APPLE, VOICE_WEATHER } from './data/voices.ts'
import { TitleScreen } from './screens/TitleScreen.tsx'
import { VoiceScreen } from './screens/VoiceScreen.tsx'
import { RushScreen } from './screens/RushScreen.tsx'
import { RushStopScreen } from './screens/RushStopScreen.tsx'
import { BridgeToSystemScreen } from './screens/BridgeToSystemScreen.tsx'
import { ThinkReleaseScreen } from './screens/ThinkReleaseScreen.tsx'
import { BridgeToUserTestScreen } from './screens/BridgeToUserTestScreen.tsx'
import { PatternScreen } from './screens/PatternScreen.tsx'
import { LearnTryScreen } from './screens/LearnTryScreen.tsx'
import { ThinkWorldScreen } from './screens/ThinkWorldScreen.tsx'
import { LearnDecideScreen } from './screens/LearnDecideScreen.tsx'
import { ExtraTestScreen } from './screens/ExtraTestScreen.tsx'
import { ProScreen } from './screens/ProScreen.tsx'
import { SystemModeScreen } from './screens/SystemModeScreen.tsx'
import { BatchCheckScreen } from './screens/BatchCheckScreen.tsx'
import { BadInspectionScreen } from './screens/BadInspectionScreen.tsx'
import { DebugClassifyScreen } from './screens/DebugClassifyScreen.tsx'
import { SystemUpdatedScreen } from './screens/SystemUpdatedScreen.tsx'
import { UserTestScreen } from './screens/UserTestScreen.tsx'
import { TeamDecisionScreen } from './screens/TeamDecisionScreen.tsx'
import { DirectReleaseScreen } from './screens/DirectReleaseScreen.tsx'
import { LastDebugScreen } from './screens/LastDebugScreen.tsx'
import { ReadyToReleaseScreen } from './screens/ReadyToReleaseScreen.tsx'
import { ReleaseScreen } from './screens/ReleaseScreen.tsx'
import { EndingScreen } from './screens/EndingScreen.tsx'

/** The facilitator tools appear only when the URL asks for them: ?facilitator=1 */
function wantsFacilitator(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('facilitator')
  } catch {
    return false
  }
}

export default function App() {
  const [session, dispatch] = useReducer(sessionReducer, undefined, () => initialSession(loadState()))
  const state = session.present
  const facilitator = wantsFacilitator()
  // only the present is persisted, so history never nests inside storage
  useEffect(() => { saveState(state) }, [state])
  useEffect(() => { window.scrollTo({ top: 0 }) }, [state.phase])

  const next = () => dispatch({ type: 'NEXT' })
  const centered = ['TITLE', 'RUSH_STOP', 'PRO_1', 'PRO_2', 'PRO_3', 'PRO_4', 'PRO_FINAL', 'DIRECT_RELEASE', 'RELEASE', 'SYSTEM_UPDATED'].includes(state.phase)

  return (
    <Frame
      phase={state.phase}
      onJump={(phase) => dispatch({ type: 'JUMP', phase })}
      onReset={() => dispatch({ type: 'RESET' })}
      onUndo={() => dispatch({ type: 'UNDO' })}
      canUndo={session.past.length > 0}
      onStep={(dir) => dispatch({ type: 'FAC_STEP', dir })}
      facilitator={facilitator}
      beat={state.beat}
      center={centered}
    >
      {renderPhase(state, dispatch, next)}
    </Frame>
  )
}

function renderPhase(s: GameState, dispatch: React.Dispatch<Parameters<typeof sessionReducer>[1]>, next: () => void) {
  const beatProps = { beat: s.beat, onBeat: (beat: string) => dispatch({ type: 'SET_BEAT', beat }) }
  switch (s.phase) {
    case 'TITLE':
      return <TitleScreen onStart={next} />
    case 'USER_VOICE_1':
      return <VoiceScreen key="v1" task={VOICE_APPLE} onSolved={() => dispatch({ type: 'VOICE_SOLVED' })} />
    case 'USER_VOICE_2':
      return <VoiceScreen key="v2" task={VOICE_WEATHER} onSolved={() => dispatch({ type: 'VOICE_SOLVED' })} />
    case 'SEARCH_RUSH':
      return <RushScreen rushSolved={s.rushSolved} onSolved={() => dispatch({ type: 'RUSH_SOLVED' })} />
    case 'RUSH_STOP':
      return <RushStopScreen {...beatProps} onNext={next} />
    case 'PRO_1':
      return <ProScreen id="PRO_1" onNext={next} />
    case 'BRIDGE_TO_SYSTEM':
      return <BridgeToSystemScreen {...beatProps} onNext={next} />
    case 'PATTERN':
      return <PatternScreen {...beatProps} onNext={next} />
    case 'SYSTEM_MODE':
      return <SystemModeScreen tuned={s.tuned} onChoose={(strategy) => dispatch({ type: 'CHOOSE_STRATEGY', strategy })} onSkip={() => dispatch({ type: 'SKIP_MORE_STRATEGIES' })} />
    case 'BATCH_CHECK':
      return s.strategy ? <BatchCheckScreen key={`check-${s.strategy}`} strategy={s.strategy} onNext={next} /> : null
    case 'BAD_INSPECTION':
      return s.strategy ? <BadInspectionScreen strategy={s.strategy} {...beatProps} onNext={next} /> : null
    case 'PRO_2':
      return <ProScreen id="PRO_2" onNext={next} />
    case 'DEBUG_CLASSIFY':
      return s.strategy ? (
        <DebugClassifyScreen
          strategy={s.strategy}
          {...beatProps}
          classification={s.classification}
          onClassify={(caseId, bucket) => dispatch({ type: 'CLASSIFY', caseId, bucket })}
          onConfirm={() => dispatch({ type: 'CONFIRM_CLASSIFICATION' })}
        />
      ) : null
    case 'SYSTEM_UPDATED':
      return s.strategy ? <SystemUpdatedScreen strategy={s.strategy} useIds={s.rules[s.strategy] ?? []} onNext={next} /> : null
    case 'RECHECK':
      return s.strategy ? (
        <BatchCheckScreen key={`recheck-${s.strategy}`} strategy={s.strategy} rule={s.rules[s.strategy] ?? []} onNext={next} onReclassify={() => dispatch({ type: 'RECLASSIFY' })} />
      ) : null
    case 'LEARN_TRY':
      return <LearnTryScreen onNext={next} />
    case 'THINK_RELEASE':
      return <ThinkReleaseScreen {...beatProps} onNext={next} />
    case 'PRO_3':
      return <ProScreen id="PRO_3" onNext={next} />
    case 'BRIDGE_TO_USERTEST':
      return <BridgeToUserTestScreen onNext={next} />
    case 'USER_TEST':
      return <UserTestScreen key="ut" tuned={s.tuned} onNext={next} />
    case 'THINK_WORLD':
      return <ThinkWorldScreen tuned={s.tuned} onNext={next} />
    case 'PRO_4':
      return <ProScreen id="PRO_4" onNext={next} />
    case 'LEARN_DECIDE':
      return <LearnDecideScreen onNext={next} />
    case 'TEAM_DECISION':
      return <TeamDecisionScreen tuned={s.tuned} onDecide={(decision) => dispatch({ type: 'DECIDE', decision })} />
    case 'DIRECT_RELEASE':
      return <DirectReleaseScreen onNext={next} />
    case 'LAST_DEBUG':
      return <LastDebugScreen tuned={s.tuned} pick={s.lastDebugPick} fixed={s.lastDebugFixed} onPick={(strategy, fixes) => dispatch({ type: 'LAST_DEBUG_PICK', strategy, fixes })} onNext={next} />
    case 'EXTRA_TEST':
      return <ExtraTestScreen onNext={next} />
    case 'READY_TO_RELEASE':
      return <ReadyToReleaseScreen {...beatProps} oks={s.oks} onOk={(index) => dispatch({ type: 'SET_OK', index })} onRelease={next} />
    case 'RELEASE':
      return <ReleaseScreen onNext={next} />
    case 'ENDING':
      return <EndingScreen onNext={next} />
    case 'PRO_FINAL':
      return <ProScreen id="PRO_FINAL" onNext={() => dispatch({ type: 'RESET' })} />
  }
}

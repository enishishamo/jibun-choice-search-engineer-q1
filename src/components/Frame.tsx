import { useState, type ReactNode } from 'react'
import type { Phase } from '../game/machine.ts'
import { PHASES, SCREENS, screenIndex } from '../game/machine.ts'
import { PRO_POINTS } from '../data/pro.ts'
import { ClayAsset } from './ClayAsset.tsx'

/**
 * Three big acts, not a progress bar. The children see what they are doing
 * now, never how many states are left.
 */
export const STAGES = ['なおす', 'まとめて試す', '世界へ届ける'] as const

export function stageIndex(phase: Phase): number {
  switch (phase) {
    case 'TITLE': case 'USER_VOICE_INTRO':
      return -1
    case 'USER_VOICE_1': case 'USER_VOICE_2': case 'SEARCH_RUSH': case 'RUSH_STOP':
      return 0
    case 'PRO_1': case 'BRIDGE_TO_SYSTEM': case 'PATTERN': case 'SYSTEM_MODE': case 'BATCH_CHECK':
    case 'BAD_INSPECTION': case 'PRO_2': case 'DEBUG_CLASSIFY': case 'SYSTEM_UPDATED':
    case 'RECHECK': case 'LEARN_TRY':
      return 1
    default:
      return 2
  }
}

interface Props {
  phase: Phase
  onJump: (p: Phase) => void
  onReset: () => void
  /** facilitator-only recovery from a mis-tap during the live event */
  onUndo: () => void
  canUndo: boolean
  /** facilitator-only: step one screen either way, conditions ignored */
  onStep: (dir: 1 | -1) => void
  /** the facilitator tools are hidden unless the URL asks for them */
  facilitator: boolean
  beat: string
  children: ReactNode
  center?: boolean
}

export function Frame({ phase, onJump, onReset, onUndo, canUndo, onStep, facilitator, beat, children, center }: Props) {
  const [fac, setFac] = useState(false)
  const idx = stageIndex(phase)
  // plain arrows so the children can step back to a screen they want to look
  // at again, or forward past one they are done with
  const here = screenIndex(phase, beat)
  const canBack = here > 0
  const canForward = here >= 0 && here < SCREENS.length - 1
  const proId = phase === 'PRO_1' || phase === 'PRO_2' || phase === 'PRO_3' || phase === 'PRO_FINAL' ? phase : null
  return (
    <div className="app">
      <header className="topbar">
        <button
          type="button"
          className="navarrow"
          aria-label="前の画面"
          disabled={!canBack}
          onClick={() => onStep(-1)}
        >◀</button>
        <div className="topbar__brand">JIBUN <strong>CHOICE</strong></div>
        {idx >= 0 && (
          <nav className="stages" aria-label={`いま：${STAGES[idx]}`}>
            {STAGES.map((s, i) => (
              <span key={s} className={`stage ${i < idx ? 'stage--done' : ''} ${i === idx ? 'stage--now' : ''}`}>
                <i className="stage__dot" aria-hidden="true" />
                <span className="stage__name">{s}</span>
              </span>
            ))}
          </nav>
        )}
        <button
          type="button"
          className="navarrow"
          aria-label="次の画面"
          disabled={!canForward}
          onClick={() => onStep(1)}
        >▶</button>
        {facilitator && (
          <button type="button" className="gear-btn" aria-label="ファシリテーター用メニュー" onClick={() => setFac((v) => !v)}>
            <ClayAsset name="gear" size={20} />
          </button>
        )}
      </header>
      {facilitator && fac && (
        <div className="fac">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>ファシリテーター用</strong>
            <button type="button" onClick={() => setFac(false)}>閉じる</button>
          </div>
          <h4>画面を すすめる／もどす</h4>
          <div className="fac__steps">
            <button type="button" onClick={() => onStep(-1)}>← 前の画面</button>
            <button type="button" onClick={() => onStep(1)}>次の画面 →</button>
          </div>
          <p className="fac__hint">
            ゲームの進行条件を無視して、1画面ずつ移動します。画面の中の段階も1画面として数えます。
          </p>

          <h4>あんぜん機能</h4>
          <button type="button" className="fac__undo" disabled={!canUndo} onClick={onUndo}>
            ← 1つ前に戻る
          </button>
          <p className="fac__hint">
            まちがえて「つぎへ」を押したときの復旧用です。画面の中の段階（考える／聞く など）も
            1つずつ戻ります。{canUndo ? '' : '（戻れる操作はまだありません）'}
          </p>
          <h4>現在：{phase}{beat ? ` / ${beat}` : ''}</h4>
          {proId && (
            <>
              <h4>エンジニアプロへ（話す内容の目安）</h4>
              <div className="fac__note">{PRO_POINTS[proId].facilitatorNote}</div>
            </>
          )}
          <h4>画面ジャンプ</h4>
          <div className="fac__phases">
            {PHASES.map((p) => (
              <button key={p} type="button" className={p === phase ? 'is-now' : ''} onClick={() => { onJump(p); setFac(false) }}>{p}</button>
            ))}
          </div>
          <h4>やりなおし</h4>
          <button type="button" onClick={() => { if (confirm('はじめから？')) { onReset(); setFac(false) } }}>はじめから</button>
        </div>
      )}
      <main className={`stage-area ${center ? 'stage-area--center' : ''}`}>{children}</main>
    </div>
  )
}

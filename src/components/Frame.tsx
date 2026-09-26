import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Phase } from '../game/machine.ts'
import { PHASES, SCREENS, screenIndex } from '../game/machine.ts'
import { PRO_POINTS, type ProPoint } from '../data/pro.ts'
import { ClayAsset } from './ClayAsset.tsx'
import { Button } from './ui.tsx'

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

const PRO_PHASES = new Set<Phase>(['PRO_1', 'PRO_2', 'PRO_3', 'PRO_4', 'PRO_FINAL'])
function isProPhase(p: Phase): p is ProPoint['id'] {
  return PRO_PHASES.has(p)
}

export function Frame({ phase, onJump, onReset, onUndo, canUndo, onStep, facilitator, beat, children, center }: Props) {
  const [fac, setFac] = useState(false)
  const idx = stageIndex(phase)
  // plain arrows so the children can step back to a screen they want to look
  // at again, or forward past one they are done with
  const here = screenIndex(phase, beat)
  const canBack = here > 0
  const canForward = here >= 0 && here < SCREENS.length - 1
  const proId = isProPhase(phase) ? phase : null

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

      {/*
       * Rendered via a portal, outside .app: .app is scaled up with CSS zoom
       * on wide screens so the child-facing board reads well from across a
       * table, but a `position: fixed` panel inside a zoomed ancestor gets
       * its own box scaled too (a Chrome quirk) and — since its size and
       * offsets were tuned in true CSS pixels — ends up taller than the
       * window with no way to scroll to the bottom. Escaping .app keeps the
       * panel at its real, compact size regardless of the board's zoom.
       */}
      {facilitator && fac && createPortal(
        <div className="fac-backdrop" onClick={() => setFac(false)}>
          <div className="fac" onClick={(e) => e.stopPropagation()}>
            <div className="fac__top">
              <strong>ファシリテーター用</strong>
              <button type="button" className="fac__close" aria-label="閉じる" onClick={() => setFac(false)}>閉じる</button>
            </div>

            <section className="fac__section">
              <h4>画面を すすめる／もどす</h4>
              <div className="fac__steps">
                <Button size="sm" color="teal" onClick={() => onStep(-1)}>← 前の画面</Button>
                <Button size="sm" color="teal" onClick={() => onStep(1)}>次の画面 →</Button>
              </div>
              <p className="fac__hint">
                ゲームの進行条件を無視して、1画面ずつ移動します。画面の中の段階も1画面として数えます。
              </p>
            </section>

            <section className="fac__section">
              <h4>あんぜん機能</h4>
              <Button size="sm" color="coral" className="fac__wide" disabled={!canUndo} onClick={onUndo}>
                ← 1つ前に戻る
              </Button>
              <p className="fac__hint">
                まちがえて「つぎへ」を押したときの復旧用です。画面の中の段階（考える／聞く など）も
                1つずつ戻ります。{canUndo ? '' : '（戻れる操作はまだありません）'}
              </p>
            </section>

            <section className="fac__section">
              <h4>現在：<span className="fac__now">{phase}{beat ? ` / ${beat}` : ''}</span></h4>
            </section>

            {proId && (
              <section className="fac__section">
                <h4>エンジニアプロへ（話す内容の目安）</h4>
                <div className="fac__note">{PRO_POINTS[proId].facilitatorNote}</div>
              </section>
            )}

            <section className="fac__section">
              <h4>画面ジャンプ</h4>
              <div className="fac__phases">
                {PHASES.map((p) => (
                  <button key={p} type="button" className={`fac__chip ${p === phase ? 'is-now' : ''}`} onClick={() => { onJump(p); setFac(false) }}>{p}</button>
                ))}
              </div>
            </section>

            <section className="fac__section">
              <h4>やりなおし</h4>
              <Button size="sm" color="ghost" className="fac__wide" onClick={() => { if (confirm('はじめから？')) { onReset(); setFac(false) } }}>
                はじめから
              </Button>
            </section>
          </div>
        </div>,
        document.body,
      )}

      <main className={`stage-area ${center ? 'stage-area--center' : ''}`}>{children}</main>
    </div>
  )
}

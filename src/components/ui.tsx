import type { ReactNode } from 'react'
import type { ResultCard, UserKind, Verdict } from '../game/types.ts'
import { UserAvatar } from './UserAvatar.tsx'
import { ClayAsset } from './ClayAsset.tsx'

type BtnColor = 'coral' | 'teal' | 'yellow' | 'purple' | 'blue' | 'ghost' | 'good'

export function Button({
  children, onClick, color = 'coral', size, disabled, className = '', type = 'button',
}: {
  children: ReactNode; onClick?: () => void; color?: BtnColor; size?: 'lg' | 'sm'; disabled?: boolean; className?: string; type?: 'button' | 'submit'
}) {
  const cls = ['btn', color !== 'coral' ? `btn--${color}` : '', size ? `btn--${size}` : '', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function Notice({ children, color }: { children: ReactNode; color?: 'coral' | 'teal' | 'good' | 'yellow' }) {
  return <div className={`notice ${color ? `notice--${color}` : ''}`}>{children}</div>
}

/** Verdict wording the children read. English never appears here. */
export const VERDICT_LABEL: Record<Verdict | 'FIXED', string> = {
  GOOD: 'よくなった',
  SAME: 'ほぼ同じ',
  BAD: 'こまった',
  FIXED: 'なおった！',
}

const VERDICT_MARK: Record<Verdict | 'FIXED', string> = { GOOD: '↑', SAME: '–', BAD: '!', FIXED: '✓' }

export function Badge({ v, lg }: { v: Verdict | 'FIXED'; lg?: boolean }) {
  return (
    <span className={`badge badge--${v} ${lg ? 'badge--lg' : ''}`}>
      <i aria-hidden="true">{VERDICT_MARK[v]}</i>{VERDICT_LABEL[v]}
    </span>
  )
}

export function Speech({
  kind, name, children, mood, center, size = 72,
}: { kind: UserKind; name?: string; children: ReactNode; mood?: 'happy' | 'meh' | 'neutral'; center?: boolean; size?: number }) {
  return (
    <div className={`speech ${center ? 'speech--center' : ''} fade-in`}>
      <div className="speech__avatar"><UserAvatar kind={kind} size={size} mood={mood} /></div>
      <div className="speech__bubble">
        {name && <div className="speech__name">{name}</div>}
        <div className="pre">{children}</div>
      </div>
    </div>
  )
}

export function SearchBox({ query, typing }: { query: string; typing?: boolean }) {
  return (
    <div className="searchbox" role="img" aria-label={`検索：${query}`}>
      <ClayAsset name="magnifier" size={30} />
      <span className="searchbox__q">{query}</span>
      {typing && <span className="searchbox__caret" />}
    </div>
  )
}

/** Non-draggable rendering of a result card (used in reactions / after lists). */
export function StaticResult({ card, rank, dim, move }: { card: Pick<ResultCard, 'title' | 'asset' | 'meta'>; rank: number; dim?: boolean; move?: 'up' | 'down' | 'same' }) {
  return (
    <div className={`result result--static ${dim ? 'result--dim' : ''}`}>
      <div className={`result__rank ${rank === 1 ? 'result__rank--top' : ''}`}>{rank}</div>
      <ClayAsset name={card.asset} size={52} />
      <div>
        <div className="result__title">{card.title}</div>
        {card.meta && <div className="result__meta">{card.meta.map((m) => <span key={m} className={`chip ${metaClass(m)}`}>{m}</span>)}</div>}
      </div>
      {move && move !== 'same' && (
        <div className={`result__move result__move--${move}`}>{move === 'up' ? '↑' : '↓'}</div>
      )}
      {move === 'same' && <div className="result__move">–</div>}
    </div>
  )
}

export function metaClass(m: string) {
  if (m.includes('新しい')) return 'chip--new'
  if (m.includes('見られている')) return 'chip--hot'
  if (m.includes('公式')) return 'chip--official'
  return ''
}

export function Mission() {
  return <span>検索をもっと便利にして、最後に世界へ届けよう！</span>
}

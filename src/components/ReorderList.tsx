import { useRef, useState } from 'react'
import type { ResultCard } from '../game/types.ts'
import { ClayAsset } from './ClayAsset.tsx'
import { metaClass } from './ui.tsx'

interface Props {
  cards: ResultCard[]
  onChange: (next: ResultCard[]) => void
  disabled?: boolean
  /** one-off lift animation on the first card so "you can pick this up" reads without text */
  hintTop?: boolean
}

const GAP = 12

/**
 * Drag-to-reorder list built on Pointer Events (mouse + touch + pen).
 * The dragged card follows the pointer; whenever its centre crosses another
 * card's midpoint the list reorders live. Position maths uses the pointer,
 * not the (possibly stale) rendered transform, so fast flicks jump several
 * slots correctly. ▲▼ buttons offer the same reorder for keyboard use.
 */
export function ReorderList({ cards, onChange, disabled, hintTop }: Props) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [dy, setDy] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef(cards)
  cardsRef.current = cards
  const grab = useRef({ id: '', offset: 0, height: 0, baseTop: 0 })

  // Handlers live on the card and use pointer capture, so no move/up event is
  // lost between pointerdown and React's effect scheduling (fast flicks, touch).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (disabled) return
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    grab.current = { id, offset: e.clientY - rect.top, height: rect.height, baseTop: rect.top }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDy(0)
    setDragId(id)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = grab.current
    if (!g.id) return
    const list = listRef.current
    if (!list) return
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-card-id]'))
    const from = cardsRef.current.findIndex((c) => c.id === g.id)
    if (from < 0) return
    const visualTop = e.clientY - g.offset
    const center = visualTop + g.height / 2
    const slotTops = items.map((el, i) => (i === from ? g.baseTop : el.getBoundingClientRect().top))
    let to = from
    items.forEach((el, i) => {
      if (i === from) return
      const mid = slotTops[i] + el.getBoundingClientRect().height / 2
      if (i < from && center < mid) to = Math.min(to, i)
      if (i > from && center > mid) to = Math.max(to, i)
    })
    if (to !== from) {
      const next = [...cardsRef.current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      cardsRef.current = next
      onChange(next)
      g.baseTop = to < from ? slotTops[to] : slotTops[to] + items[to].getBoundingClientRect().height - g.height
    }
    setDy(visualTop - g.baseTop)
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!grab.current.id) return
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* already released */ }
    grab.current.id = ''
    setDragId(null)
    setDy(0)
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= cards.length) return
    const next = [...cards]
    const [m] = next.splice(from, 1)
    next.splice(to, 0, m)
    onChange(next)
  }

  return (
    <div className="results" ref={listRef} style={{ gap: GAP }}>
      {cards.map((card, i) => {
        const dragging = dragId === card.id
        return (
          <div
            key={card.id}
            data-card-id={card.id}
            className={`result ${dragging ? 'is-dragging' : ''} ${hintTop && i === 0 && !dragId ? 'is-hint' : ''}`}
            style={dragging ? { transform: `translateY(${dy}px) scale(1.03) rotate(-1deg)` } : undefined}
            onPointerDown={(e) => onPointerDown(e, card.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label={`${i + 1}位 ${card.title}`}
          >
            <div className="result__grip" aria-hidden="true"><i /><i /><i /></div>
            <div className={`result__rank ${i === 0 ? 'result__rank--top' : ''}`}>{i + 1}</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
              <ClayAsset name={card.asset} size={52} />
              <div style={{ minWidth: 0 }}>
                <div className="result__title">{card.title}</div>
                {card.meta && (
                  <div className="result__meta">
                    {card.meta.map((m) => <span key={m} className={`chip ${metaClass(m)}`}>{m}</span>)}
                  </div>
                )}
              </div>
            </div>
            <div className="result__arrows">
              <button type="button" aria-label="上へ" disabled={disabled || i === 0} onClick={() => move(i, i - 1)}>▲</button>
              <button type="button" aria-label="下へ" disabled={disabled || i === cards.length - 1} onClick={() => move(i, i + 1)}>▼</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useRef, useState } from 'react'
import type { SearchCase, StrategyId } from '../game/types.ts'
import type { Classification } from '../game/machine.ts'
import { ClayAsset } from './ClayAsset.tsx'

type Bucket = 'use' | 'skip'

interface Props {
  strategy: StrategyId
  label: string
  color: string
  cases: SearchCase[]
  classification: Classification
  onClassify: (caseId: string, bucket: Bucket | undefined) => void
}

/**
 * Two trays and a pile of big search cards. A card can be dragged into a tray
 * or sent with its own two buttons, so three children can work at once. Cards
 * in a tray go back to the pile with a tap. Nothing is marked right or wrong:
 * this is the team's own hypothesis, checked later by the recheck.
 */
export function SortBoard({ label, color, cases, classification, onClassify }: Props) {
  const useRef_ = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLDivElement>(null)
  // drag bookkeeping lives in a ref: pointer events can fire several times
  // before React re-renders, and a stale state read would drop the drop.
  const dragRef = useRef<{ id: string; x: number; y: number } | null>(null)
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null)
  const [over, setOver] = useState<Bucket | null>(null)

  const bucketAt = (x: number, y: number): Bucket | null => {
    const hit = (el: HTMLElement | null) => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
    }
    if (hit(useRef_.current)) return 'use'
    if (hit(skipRef.current)) return 'skip'
    return null
  }

  const pile = cases.filter((c) => !classification[c.id])
  const inTray = (b: Bucket) => cases.filter((c) => classification[c.id] === b)

  return (
    <div className="board" style={{ ['--accent' as string]: color }}>
      <div className="board__trays">
        <div ref={useRef_} className={`tray tray--use ${over === 'use' ? 'is-over' : ''}`}>
          <div className="tray__title"><span className="tray__pin" aria-hidden="true">▼</span>{label}を つかう</div>
          <div className="tray__items">
            {inTray('use').map((c) => (
              <button key={c.id} type="button" className="tray__chip" onClick={() => onClassify(c.id, undefined)}>
                <ClayAsset name={c.asset} size={26} />{c.query}<span className="tray__x" aria-hidden="true">×</span>
              </button>
            ))}
            {inTray('use').length === 0 && <span className="tray__empty">ここに カードを いれる</span>}
          </div>
        </div>
        <div ref={skipRef} className={`tray tray--skip ${over === 'skip' ? 'is-over' : ''}`}>
          <div className="tray__title"><span className="tray__pin" aria-hidden="true">▼</span>今回は つかわない</div>
          <div className="tray__items">
            {inTray('skip').map((c) => (
              <button key={c.id} type="button" className="tray__chip" onClick={() => onClassify(c.id, undefined)}>
                <ClayAsset name={c.asset} size={26} />{c.query}<span className="tray__x" aria-hidden="true">×</span>
              </button>
            ))}
            {inTray('skip').length === 0 && <span className="tray__empty">ここに カードを いれる</span>}
          </div>
        </div>
      </div>

      <div className="board__pile">
        {pile.map((c) => (
          <div
            key={c.id}
            className={`scard ${drag?.id === c.id ? 'is-dragging' : ''}`}
            style={drag?.id === c.id ? { transform: `translate(${drag.dx}px, ${drag.dy}px) rotate(-2deg) scale(1.04)` } : undefined}
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest('button')) return
              e.preventDefault()
              e.currentTarget.setPointerCapture(e.pointerId)
              dragRef.current = { id: c.id, x: e.clientX, y: e.clientY }
              setDrag({ id: c.id, dx: 0, dy: 0 })
            }}
            onPointerMove={(e) => {
              const d = dragRef.current
              if (d?.id !== c.id) return
              setDrag({ id: c.id, dx: e.clientX - d.x, dy: e.clientY - d.y })
              setOver(bucketAt(e.clientX, e.clientY))
            }}
            onPointerUp={(e) => {
              const d = dragRef.current
              if (d?.id !== c.id) return
              const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6
              const b = bucketAt(e.clientX, e.clientY)
              dragRef.current = null
              setDrag(null)
              setOver(null)
              if (b && moved) onClassify(c.id, b)
            }}
            onPointerCancel={() => { dragRef.current = null; setDrag(null); setOver(null) }}
          >
            <ClayAsset name={c.asset} size={54} />
            <div className="scard__body">
              <div className="scard__q">{c.query}</div>
              <div className="scard__intent">知りたいこと：{c.intent}</div>
            </div>
            <div className="scard__btns">
              <button type="button" className="toggle toggle--use" onClick={() => onClassify(c.id, 'use')}>▲ つかう</button>
              <button type="button" className="toggle" onClick={() => onClassify(c.id, 'skip')}>▲ つかわない</button>
            </div>
          </div>
        ))}
        {pile.length === 0 && <div className="board__empty">ぜんぶ わけた！</div>}
      </div>
    </div>
  )
}

import type { UserKind } from '../game/types.ts'
import { USER_IMAGES } from '../data/assets.ts'

interface Props {
  kind: UserKind
  size?: number
  mood?: 'happy' | 'meh' | 'neutral'
}

const PALETTE: Record<UserKind, { skin: string; hair: string; shirt: string; hairShape: 'long' | 'short' | 'bald' | 'bun' | 'cap' | 'gray' | 'grayBun' }> = {
  girl: { skin: '#ffd7bd', hair: '#5b3a2e', shirt: '#ff9fc0', hairShape: 'long' },
  boy: { skin: '#ffd7bd', hair: '#2f2a2a', shirt: '#5fb4ff', hairShape: 'short' },
  grandpa: { skin: '#f6d0b3', hair: '#d9d3cc', shirt: '#9b8cf0', hairShape: 'gray' },
  grandma: { skin: '#f6d0b3', hair: '#d9d3cc', shirt: '#ffc93c', hairShape: 'grayBun' },
  mom: { skin: '#ffd7bd', hair: '#6b3f2a', shirt: '#3ec1b3', hairShape: 'bun' },
  dad: { skin: '#f3c9a8', hair: '#2f2a2a', shirt: '#ff7a59', hairShape: 'cap' },
  teen: { skin: '#ffd7bd', hair: '#3a2e2a', shirt: '#7ee0c8', hairShape: 'short' },
}

/** Clay-style user avatar (asset slot: register a PNG in data/assets.ts to replace). */
export function UserAvatar({ kind, size = 72, mood = 'neutral' }: Props) {
  const src = USER_IMAGES[kind]
  if (src) return <img src={src} width={size} height={size} alt="" style={{ borderRadius: '50%' }} />
  const p = PALETTE[kind]
  const mouth =
    mood === 'happy' ? 'M26 42q6 6 12 0' : mood === 'meh' ? 'M27 43h10' : 'M27 42q5 3 10 0'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="#fff3e3" />
      <path d="M12 64c2-14 10-18 20-18s18 4 20 18z" fill={p.shirt} />
      <circle cx="32" cy="30" r="16" fill={p.skin} />
      {p.hairShape === 'long' && <path d="M16 30c0-14 8-20 16-20s16 6 16 20v14h-6V32c-3 0-6-4-10-8-4 4-7 8-10 8v12h-6z" fill={p.hair} />}
      {p.hairShape === 'short' && <path d="M16 28c0-12 7-18 16-18s16 6 16 18c-4-4-8-6-16-6s-12 2-16 6z" fill={p.hair} />}
      {p.hairShape === 'bun' && (
        <g>
          <circle cx="32" cy="12" r="7" fill={p.hair} />
          <path d="M16 30c0-12 7-18 16-18s16 6 16 18c-4-4-8-7-16-7s-12 3-16 7z" fill={p.hair} />
        </g>
      )}
      {p.hairShape === 'cap' && (
        <g>
          <path d="M14 26c0-10 8-16 18-16s18 6 18 16z" fill="#2f5da8" />
          <rect x="12" y="24" width="40" height="5" rx="2.5" fill="#1f4380" />
        </g>
      )}
      {p.hairShape === 'gray' && (
        <g>
          <path d="M17 26c1-8 6-12 15-12s14 4 15 12c-5-3-10-4-15-4s-10 1-15 4z" fill={p.hair} />
          <path d="M22 44q10 6 20 0" stroke={p.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}
      {p.hairShape === 'grayBun' && (
        <g>
          <circle cx="32" cy="13" r="7" fill={p.hair} />
          <path d="M16 30c0-12 7-18 16-18s16 6 16 18c-4-4-8-7-16-7s-12 3-16 7z" fill={p.hair} />
        </g>
      )}
      <circle cx="26" cy="32" r="2.2" fill="#3a2e2a" />
      <circle cx="38" cy="32" r="2.2" fill="#3a2e2a" />
      <circle cx="22" cy="37" r="3" fill="#ffb3a0" opacity=".6" />
      <circle cx="42" cy="37" r="3" fill="#ffb3a0" opacity=".6" />
      <path d={mouth} stroke="#3a2e2a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

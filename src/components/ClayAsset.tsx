import type { AssetName } from '../game/types.ts'
import { ASSET_IMAGES } from '../data/assets.ts'

interface Props {
  name: AssetName
  size?: number
  className?: string
  /** fill the parent box instead of a fixed pixel size */
  fluid?: boolean
}

/**
 * Asset slot. Renders a registered image when one exists, otherwise a rounded
 * inline-SVG placeholder in the clay palette. Swapping in real artwork never
 * changes layout because the box size is fixed by `size`.
 */
export function ClayAsset({ name, size = 56, className, fluid }: Props) {
  const src = ASSET_IMAGES[name]
  const w = fluid ? '100%' : size
  if (src) {
    return <img src={src} width={w} height={w} alt="" className={className} style={{ objectFit: 'contain' }} />
  }
  return (
    <svg width={w} height={w} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ICONS[name]}
    </svg>
  )
}

const shade = (fill: string) => ({ fill, stroke: 'rgba(60,40,30,.12)', strokeWidth: 1.5 })

const ICONS: Record<AssetName, React.ReactNode> = {
  apple: (
    <g>
      <path d="M33 14c2-6 7-8 10-8-1 4-3 7-8 9z" {...shade('#7cc47a')} />
      <path d="M32 18c-5-4-13-4-17 3-5 8-2 22 6 30 3 3 6 3 11 1 5 2 8 2 11-1 8-8 11-22 6-30-4-7-12-7-17-3z" {...shade('#ff6b5e')} />
      <ellipse cx="24" cy="26" rx="6" ry="9" fill="url(#hl)" />
    </g>
  ),
  pie: (
    <g>
      <ellipse cx="32" cy="42" rx="26" ry="12" {...shade('#e8a25e')} />
      <path d="M8 40c0-10 12-18 24-18s24 8 24 18c-8 6-40 6-48 0z" {...shade('#f5c27a')} />
      <path d="M14 36c6-6 30-6 36 0" stroke="#c97b3a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="26" cy="30" rx="8" ry="3" fill="url(#hl)" />
    </g>
  ),
  phone: (
    <g>
      <rect x="18" y="6" width="28" height="52" rx="8" {...shade('#5c6b8c')} />
      <rect x="21" y="12" width="22" height="38" rx="4" fill="#a8d8ff" />
      <rect x="21" y="12" width="22" height="14" rx="4" fill="url(#hl)" />
      <circle cx="32" cy="54" r="2.2" fill="#c9d3e6" />
    </g>
  ),
  laptop: (
    <g>
      <rect x="12" y="12" width="40" height="28" rx="5" {...shade('#5c6b8c')} />
      <rect x="15" y="15" width="34" height="22" rx="3" fill="#a8d8ff" />
      <rect x="15" y="15" width="34" height="9" rx="3" fill="url(#hl)" />
      <path d="M6 44h52l-4 6H10z" {...shade('#c9d3e6')} />
    </g>
  ),
  sun: (
    <g>
      <circle cx="32" cy="32" r="14" {...shade('#ffcf4a')} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="30" y="6" width="4" height="9" rx="2" fill="#ffcf4a" transform={`rotate(${a} 32 32)`} />
      ))}
      <ellipse cx="27" cy="26" rx="5" ry="4" fill="url(#hl)" />
    </g>
  ),
  rain: (
    <g>
      <path d="M18 40a10 10 0 0 1 2-19 14 14 0 0 1 26 3 8 8 0 0 1 1 16z" {...shade('#c9d3e6')} />
      <ellipse cx="26" cy="26" rx="8" ry="4" fill="url(#hl)" />
      {[22, 32, 42].map((x, i) => (
        <path key={x} d={`M${x} 46l-3 8`} stroke="#5fb4ff" strokeWidth="4" strokeLinecap="round" opacity={i === 1 ? 1 : 0.8} />
      ))}
    </g>
  ),
  cloud: (
    <g>
      <path d="M18 46a10 10 0 0 1 2-19 14 14 0 0 1 26 3 8 8 0 0 1 1 16z" {...shade('#dfe6f2')} />
      <ellipse cx="26" cy="32" rx="8" ry="4" fill="url(#hl)" />
    </g>
  ),
  calendar: (
    <g>
      <rect x="10" y="14" width="44" height="42" rx="8" {...shade('#fff')} />
      <rect x="10" y="14" width="44" height="14" rx="8" fill="#ff7a59" />
      <rect x="10" y="22" width="44" height="6" fill="#ff7a59" />
      {[20, 32, 44].map((x) => [36, 46].map((y) => <rect key={`${x}${y}`} x={x - 3} y={y - 3} width="8" height="6" rx="2" fill="#f0e0cc" />))}
    </g>
  ),
  train: (
    <g>
      <rect x="12" y="8" width="40" height="44" rx="10" {...shade('#3ec1b3')} />
      <rect x="18" y="16" width="28" height="14" rx="4" fill="#dff7ff" />
      <rect x="18" y="16" width="28" height="6" rx="4" fill="url(#hl)" />
      <circle cx="22" cy="42" r="3.5" fill="#fff8d6" />
      <circle cx="42" cy="42" r="3.5" fill="#fff8d6" />
      <path d="M16 56l-4 5M48 56l4 5" stroke="#3a2e2a" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  photo: (
    <g>
      <rect x="8" y="14" width="48" height="38" rx="6" {...shade('#f7e9d3')} />
      <rect x="13" y="19" width="38" height="28" rx="3" fill="#c9b79c" />
      <path d="M13 44l10-11 8 8 6-6 14 11z" fill="#8f7b62" />
      <circle cx="40" cy="27" r="4" fill="#fff3d6" />
    </g>
  ),
  zoo: (
    <g>
      <circle cx="32" cy="34" r="18" {...shade('#f6f2ea')} />
      <circle cx="18" cy="20" r="7" {...shade('#3a2e2a')} />
      <circle cx="46" cy="20" r="7" {...shade('#3a2e2a')} />
      <circle cx="24" cy="32" r="5" fill="#3a2e2a" />
      <circle cx="40" cy="32" r="5" fill="#3a2e2a" />
      <circle cx="25" cy="31" r="1.5" fill="#fff" />
      <circle cx="41" cy="31" r="1.5" fill="#fff" />
      <ellipse cx="32" cy="40" rx="3.5" ry="2.5" fill="#3a2e2a" />
    </g>
  ),
  clock: (
    <g>
      <circle cx="32" cy="32" r="24" {...shade('#fff')} />
      <circle cx="32" cy="32" r="19" fill="#fff8e8" />
      <path d="M32 32V18M32 32l9 6" stroke="#3a2e2a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill="#ff7a59" />
    </g>
  ),
  ticket: (
    <g>
      <path d="M8 22a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v6a6 6 0 0 0 0 12v6a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-6a6 6 0 0 0 0-12z" {...shade('#9b8cf0')} />
      <rect x="16" y="26" width="18" height="4" rx="2" fill="#fff" opacity=".9" />
      <rect x="16" y="34" width="12" height="4" rx="2" fill="#fff" opacity=".7" />
      <circle cx="46" cy="32" r="5" fill="#fff" opacity=".9" />
    </g>
  ),
  dog: (
    <g>
      <ellipse cx="32" cy="36" rx="18" ry="16" {...shade('#e9c49a')} />
      <ellipse cx="14" cy="30" rx="6" ry="11" {...shade('#c4925e')} />
      <ellipse cx="50" cy="30" rx="6" ry="11" {...shade('#c4925e')} />
      <circle cx="25" cy="34" r="3" fill="#3a2e2a" />
      <circle cx="39" cy="34" r="3" fill="#3a2e2a" />
      <ellipse cx="32" cy="43" rx="4" ry="3" fill="#3a2e2a" />
    </g>
  ),
  science: (
    <g>
      <path d="M26 8h12v18l12 22a6 6 0 0 1-5 9H19a6 6 0 0 1-5-9l12-22z" {...shade('#dff7ff')} />
      <path d="M20 44h24l5 8a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" fill="#7ee0c8" />
      <circle cx="28" cy="40" r="2.5" fill="#fff" />
      <circle cx="36" cy="34" r="2" fill="#fff" />
    </g>
  ),
  play: (
    <g>
      <circle cx="32" cy="32" r="22" {...shade('#ff9fc0')} />
      <path d="M18 26h28M18 32h28M18 38h28" stroke="#fff" strokeWidth="3" opacity=".7" strokeLinecap="round" />
      <path d="M26 20c4 12 8 12 12 24" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".9" />
    </g>
  ),
  game: (
    <g>
      <rect x="8" y="20" width="48" height="26" rx="13" {...shade('#5c6b8c')} />
      <rect x="18" y="29" width="10" height="4" rx="2" fill="#fff" />
      <rect x="21" y="26" width="4" height="10" rx="2" fill="#fff" />
      <circle cx="42" cy="29" r="2.8" fill="#ff7a59" />
      <circle cx="47" cy="34" r="2.8" fill="#3ec1b3" />
    </g>
  ),
  news: (
    <g>
      <rect x="10" y="12" width="44" height="40" rx="6" {...shade('#fff')} />
      <rect x="16" y="18" width="14" height="12" rx="2" fill="#ffc93c" />
      <rect x="34" y="18" width="14" height="4" rx="2" fill="#c9b79c" />
      <rect x="34" y="26" width="14" height="4" rx="2" fill="#c9b79c" />
      <rect x="16" y="36" width="32" height="4" rx="2" fill="#e5d8c5" />
      <rect x="16" y="44" width="24" height="4" rx="2" fill="#e5d8c5" />
    </g>
  ),
  umbrella: (
    <g>
      <path d="M8 32a24 24 0 0 1 48 0z" {...shade('#ff7a59')} />
      <path d="M8 32a24 24 0 0 1 48 0" fill="url(#hl)" />
      <path d="M32 32v20a4 4 0 0 1-8 0" stroke="#3a2e2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  ),
  magnifier: (
    <g>
      <circle cx="28" cy="28" r="16" {...shade('#fff')} />
      <circle cx="28" cy="28" r="11" fill="#dff7ff" />
      <path d="M40 40l12 12" stroke="#3a2e2a" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="23" cy="22" rx="4" ry="3" fill="#fff" />
    </g>
  ),
  globe: (
    <g>
      <circle cx="32" cy="32" r="24" {...shade('#5fb4ff')} />
      <path d="M18 22c6 2 8 8 4 12s2 10 8 8 6-8 12-6 4-8 0-12-10-2-12-6-8-2-12 4z" fill="#7ee0a3" />
      <ellipse cx="24" cy="18" rx="7" ry="4" fill="url(#hl)" />
    </g>
  ),
  sparkle: (
    <g>
      <path d="M32 8l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" {...shade('#fff')} />
      <path d="M50 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff" />
    </g>
  ),
  mail: (
    <g>
      <rect x="8" y="16" width="48" height="34" rx="7" {...shade('#fff')} />
      <path d="M10 20l22 16 22-16" stroke="#ff7a59" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  fresh: (
    <g>
      <circle cx="30" cy="34" r="20" {...shade('#fff')} />
      <circle cx="30" cy="34" r="15" fill="#fff8e8" />
      <path d="M30 34V23M30 34l8 5" stroke="#3a2e2a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="34" r="2.6" fill="#ff7a59" />
      <path d="M50 8l2.6 7.4L60 18l-7.4 2.6L50 28l-2.6-7.4L40 18l7.4-2.6z" fill="#ffd84a" stroke="rgba(60,40,30,.12)" strokeWidth="1.2" />
    </g>
  ),
  eyes: (
    <g>
      <ellipse cx="22" cy="26" rx="13" ry="9" {...shade('#fff')} />
      <circle cx="22" cy="26" r="5" fill="#3a6ea8" />
      <circle cx="22" cy="26" r="2.2" fill="#22303f" />
      <ellipse cx="44" cy="26" rx="13" ry="9" {...shade('#fff')} />
      <circle cx="44" cy="26" r="5" fill="#3a6ea8" />
      <circle cx="44" cy="26" r="2.2" fill="#22303f" />
      <ellipse cx="33" cy="45" rx="13" ry="9" {...shade('#fff')} />
      <circle cx="33" cy="45" r="5" fill="#3a6ea8" />
      <circle cx="33" cy="45" r="2.2" fill="#22303f" />
    </g>
  ),
  stamp: (
    <g>
      <rect x="24" y="8" width="16" height="22" rx="6" {...shade('#c9d3e6')} />
      <rect x="16" y="28" width="32" height="12" rx="5" {...shade('#8a7ce0')} />
      <rect x="10" y="44" width="44" height="9" rx="4.5" {...shade('#e6dcff')} />
      <circle cx="32" cy="34" r="3.4" fill="#fff" opacity=".85" />
    </g>
  ),
  gear: (
    <g>
      <circle cx="32" cy="32" r="12" fill="none" stroke="#7a6a62" strokeWidth="6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="29" y="10" width="6" height="8" rx="2" fill="#7a6a62" transform={`rotate(${a} 32 32)`} />
      ))}
    </g>
  ),
}

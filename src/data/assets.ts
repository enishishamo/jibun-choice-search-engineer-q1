import type { AssetName, UserKind } from '../game/types.ts'

/**
 * Asset slots. When real clay artwork arrives, drop the file in public/assets
 * and register its path here. Anything not registered falls back to the
 * inline SVG placeholder in components/ClayAsset.tsx, so layout never breaks.
 */
export const ASSET_IMAGES: Partial<Record<AssetName, string>> = {
  // apple: 'assets/apple.png',
}

export const USER_IMAGES: Partial<Record<UserKind, string>> = {
  // girl: 'assets/user-girl.png',
}

import type { AssetName } from '../game/types.ts'

/**
 * BRIDGE_TO_SYSTEM beat B. One strategy, shown touching several searches at
 * once with real examples. Deliberately a *sample*: no verdict badges, no
 * counts, and the screen says so — the children still choose freely next.
 */
export interface DemoSearch {
  query: string
  asset: AssetName
  up: string
  down: string
}

export const BRIDGE_DEMO_LABEL = '新しい情報を大事にする'

export const BRIDGE_DEMO: DemoSearch[] = [
  {
    query: '東京 明日の天気',
    asset: 'rain',
    up: '今日 8:00 更新の 明日の予報',
    down: '3日前の「晴れそうです」',
  },
  {
    query: '電車 今日 運行状況',
    asset: 'train',
    up: '10分前 更新の 運行情報',
    down: '去年の 電車の記事',
  },
  {
    query: 'ゲーム 最新アップデート',
    asset: 'game',
    up: '今日 出た アップデート情報',
    down: '2年前の バージョンの話',
  },
]

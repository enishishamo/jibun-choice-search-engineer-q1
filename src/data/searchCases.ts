import type { SearchCase } from '../game/types.ts'

/**
 * Representative search cases. The "100 searches" are these cases weighted by
 * `count` (sums to 100). Results are fully deterministic.
 */
export const SEARCH_CASES: SearchCase[] = [
  { id: 'tokyo-tomorrow', query: '東京 明日の天気', intent: '明日の予報', count: 12, helps: ['NEW'], hurts: ['EYES'], asset: 'rain' },
  { id: 'train-today', query: '電車 今日 運行状況', intent: '今動いているか', count: 10, helps: ['NEW', 'OFFICIAL'], hurts: [], asset: 'train' },
  { id: 'game-update', query: 'ゲーム 最新アップデート', intent: '最新情報', count: 8, helps: ['NEW', 'OFFICIAL'], hurts: [], asset: 'game' },
  { id: 'tokyo-old-photo', query: '東京 昔の写真', intent: '昔の東京を見る', count: 6, helps: [], hurts: ['NEW'], asset: 'photo' },
  { id: 'typhoon-10y', query: '10年前の台風', intent: '過去の記録', count: 5, helps: [], hurts: ['NEW'], asset: 'cloud' },
  { id: 'zoo-open-today', query: '上野動物園 今日 開いてる？', intent: '今日の開園状況', count: 8, helps: ['NEW', 'OFFICIAL'], hurts: ['EYES'], asset: 'zoo' },
  { id: 'event-time', query: 'イベント 何時から？', intent: '正式な開始時刻', count: 9, helps: ['OFFICIAL'], hurts: [], asset: 'clock' },
  { id: 'train-kids-fare', query: '電車 子ども料金', intent: '正式な料金', count: 8, helps: ['OFFICIAL'], hurts: [], asset: 'ticket' },
  { id: 'zoo-fun', query: '上野動物園 小学生 楽しかった？', intent: '実際に行った人の体験', count: 7, helps: [], hurts: ['OFFICIAL'], asset: 'zoo' },
  { id: 'free-research', query: '小学生 自由研究 おすすめ', intent: 'アイデアを探したい', count: 10, helps: ['EYES'], hurts: ['OFFICIAL'], asset: 'science' },
  { id: 'first-dog', query: 'はじめて犬を飼う 準備', intent: '定番の情報を知りたい', count: 8, helps: ['EYES'], hurts: [], asset: 'dog' },
  { id: 'popular-play', query: '小学生に人気の遊び', intent: 'みんなが何をしているか', count: 9, helps: ['EYES'], hurts: [], asset: 'play' },
]

export const CASE_BY_ID: Record<string, SearchCase> = Object.fromEntries(
  SEARCH_CASES.map((c) => [c.id, c]),
)

export const TOTAL_SEARCHES = SEARCH_CASES.reduce((s, c) => s + c.count, 0)

import type { StrategyId } from '../game/types.ts'

/**
 * Learning screen ②. Three small groups of searches that share something.
 * The first is shown as the professional's worked example, the second is the
 * children's turn, the third is a short third pass. None of them is "the
 * right answer" — they are how the three strategies were arrived at.
 */
export interface PatternItem {
  icon: string
  query: string
  /** what the person wanted, or what the results looked like */
  note: string
  /** the word in `query` worth noticing, highlighted on reveal */
  key?: string
}

export interface PatternGroup {
  strategy: StrategyId
  icon: string
  items: PatternItem[]
  /** what the shared thing turns out to be — revealed only after thinking */
  reveal: string
}

export const PATTERN_PRO: PatternGroup = {
  strategy: 'OFFICIAL',
  icon: '🏛️',
  items: [
    { icon: '🦁', query: '上野動物園 今日 開いてる？', note: '個人のブログ / 動物園のお知らせ' },
    { icon: '🚃', query: '電車 子ども料金', note: 'まとめ記事 / 鉄道会社の案内' },
    { icon: '🎪', query: 'イベント 何時から？', note: 'SNSの投稿 / 主催者のお知らせ' },
  ],
  reveal: '時間や料金など、まちがえたくない情報は「公式の情報」が大事そう！',
}

export const PATTERN_CHILD: PatternGroup = {
  strategy: 'NEW',
  icon: '🆕',
  items: [
    { icon: '🌦️', query: '東京 明日の天気', note: '3日前の予報より、今日の予報が知りたい', key: '明日' },
    { icon: '🚃', query: '電車 今日 運行状況', note: '去年の情報より、今どうなっているか知りたい', key: '今日' },
    { icon: '🎮', query: 'ゲーム 最新アップデート', note: '前のアップデートより、今の情報が知りたい', key: '最新' },
  ],
  reveal: '「新しい情報」が大事そう！',
}

export const PATTERN_THIRD: PatternGroup = {
  strategy: 'EYES',
  icon: '👀',
  items: [
    { icon: '🎲', query: '小学生に人気の遊び', note: 'いま みんなが 何で遊んでいるか 知りたい', key: '人気' },
    { icon: '🎯', query: '定番のボードゲーム', note: 'よく遊ばれているものから 選びたい', key: '定番' },
    { icon: '📚', query: '自由研究 おすすめ', note: 'たくさんの人が 見ている アイデアから 探したい', key: 'おすすめ' },
  ],
  reveal: '「よく見られている情報」が 手がかりに なりそう！',
}

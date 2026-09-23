import type { Strategy, StrategyId } from '../game/types.ts'

/**
 * The three hypotheses the children can try on the 100 searches.
 * These are game hypotheses only — not a description of any real search engine.
 */
export const STRATEGIES: Strategy[] = [
  {
    id: 'NEW',
    label: 'NEW',
    tagline: '新しい情報を大事にする',
    asset: 'fresh',
    color: 'var(--c-new)',
    debugQuestion: '新しい情報を大事にするのは、どんな検索？',
    useLabel: 'NEWを使う',
    skipLabel: '使わない',
    hint: { good: ['明日', '今日', '最新'], bad: ['昔', '10年前'] },
    debugCaseIds: ['tokyo-tomorrow', 'train-today', 'game-update', 'tokyo-old-photo', 'typhoon-10y'],
    badFiles: [
      {
        caseId: 'tokyo-old-photo',
        user: 'grandpa',
        userName: 'おじいさん',
        after: [
          { title: '今日の東京ニュース', move: 'up' },
          { title: '昨日の東京イベント', move: 'up' },
          { title: '100年前の東京の写真', move: 'down' },
        ],
        userLine: '昔の東京を見たかったんだけどな……',
      },
      {
        caseId: 'typhoon-10y',
        user: 'teen',
        userName: '中学生',
        after: [
          { title: '今週の天気の見通し', move: 'up' },
          { title: '今日の雨雲の動き', move: 'up' },
          { title: '10年前の台風の記録', move: 'down' },
        ],
        userLine: '10年前の記録を調べたかったのに……',
      },
    ],
  },
  {
    id: 'EYES',
    label: 'EYES',
    tagline: 'よく見られている情報を大事にする',
    asset: 'eyes',
    color: 'var(--c-eyes)',
    debugQuestion: 'よく見られている情報を大事にするのは、どんな検索？',
    useLabel: 'EYESを使う',
    skipLabel: '使わない',
    hint: { good: ['人気', 'おすすめ', '準備'], bad: ['明日', '今日'] },
    debugCaseIds: ['popular-play', 'free-research', 'first-dog', 'tokyo-tomorrow', 'zoo-open-today'],
    badFiles: [
      {
        caseId: 'tokyo-tomorrow',
        user: 'girl',
        userName: '女の子',
        after: [
          { title: '東京、明日は晴れそうです（3日前・とてもよく見られている）', move: 'up' },
          { title: '東京の9月の気温と服装', move: 'up' },
          { title: '東京、明日は午後から雨の予報（今日 8:00）', move: 'down' },
        ],
        userLine: '晴れって書いてあったのに、雨だった……',
      },
      {
        caseId: 'zoo-open-today',
        user: 'dad',
        userName: 'お父さん',
        after: [
          { title: '上野動物園 去年の開園スケジュール（とてもよく見られている）', move: 'up' },
          { title: '上野動物園 人気の動物ランキング', move: 'up' },
          { title: '上野動物園 本日の開園情報', move: 'down' },
        ],
        userLine: '今日開いてるかが知りたかったんだけど……',
      },
    ],
  },
  {
    id: 'OFFICIAL',
    label: 'OFFICIAL',
    tagline: '公式の情報を大事にする',
    asset: 'stamp',
    color: 'var(--c-official)',
    debugQuestion: '公式の情報を大事にするのは、どんな検索？',
    useLabel: 'OFFICIALを使う',
    skipLabel: '使わない',
    hint: { good: ['料金', '何時', '運行', '開いてる'], bad: ['楽しかった', 'おすすめ'] },
    debugCaseIds: ['train-kids-fare', 'event-time', 'zoo-open-today', 'zoo-fun', 'free-research'],
    badFiles: [
      {
        caseId: 'zoo-fun',
        user: 'mom',
        userName: 'お母さん',
        after: [
          { title: '上野動物園 公式 施設案内', move: 'up' },
          { title: '上野動物園 公式 ご利用のきまり', move: 'up' },
          { title: '小学生と行った！上野動物園の一日（体験談）', move: 'down' },
        ],
        userLine: '実際に行った人の話が読みたかったのに……',
      },
      {
        caseId: 'free-research',
        user: 'boy',
        userName: '男の子',
        after: [
          { title: '自由研究 提出のきまり（公式）', move: 'up' },
          { title: '自由研究 応募要項（公式）', move: 'up' },
          { title: 'みんながやった自由研究アイデア50', move: 'down' },
        ],
        userLine: 'アイデアが見たかったんだけどな……',
      },
    ],
  },
]

export const STRATEGY_BY_ID: Record<StrategyId, Strategy> = Object.fromEntries(
  STRATEGIES.map((s) => [s.id, s]),
) as Record<StrategyId, Strategy>

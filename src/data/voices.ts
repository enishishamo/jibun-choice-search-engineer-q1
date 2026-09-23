import type { VoiceTask } from '../game/types.ts'

/** STEP 1 — アップル 新商品 */
export const VOICE_APPLE: VoiceTask = {
  id: 'apple',
  user: 'boy',
  userName: '男の子',
  voice: '新しいスマホが出たって聞いた！\n調べてみたんだけど……',
  query: 'アップル　新商品',
  cards: [
    { id: 'apple-fruit', title: '新しい品種のりんご', asset: 'apple' },
    { id: 'apple-pie', title: '新作アップルパイ', asset: 'pie' },
    { id: 'apple-phone', title: '新しいスマートフォン', asset: 'phone' },
    { id: 'apple-pc', title: '新しいパソコン', asset: 'laptop' },
  ],
  solvedTopId: 'apple-phone',
  solvedLine: 'あ、これだ！',
  solvedAsset: 'phone',
  failLines: {
    'apple-fruit': 'りんご……？\nスマホを探してたんだけどな',
    'apple-pie': 'アップルパイ……？\nおいしそうだけど、スマホを探してたんだよね',
    'apple-pc': 'パソコンか……\nスマホのほうが知りたかったな',
  },
  failFallback: 'うーん、これじゃないんだよな',
  requery: 'アップル スマホ 新商品',
}

/** STEP 2 — 東京 明日の天気 */
export const VOICE_WEATHER: VoiceTask = {
  id: 'weather',
  user: 'girl',
  userName: '女の子',
  voice: '明日、東京で遠足なんだ！\n雨が降るか知りたい！',
  query: '東京　明日の天気',
  cards: [
    { id: 'w-a', title: '東京、明日は晴れそうです', meta: ['3日前に更新', 'よく見られている'], asset: 'sun' },
    { id: 'w-b', title: '東京の9月の気温と服装', meta: ['今年9月の記事', 'とてもよく見られている'], asset: 'calendar' },
    { id: 'w-c', title: '東京、今日の天気はくもり', meta: ['1時間前に更新', 'とても新しい'], asset: 'cloud' },
    { id: 'w-d', title: '東京、明日は午後から雨の予報', meta: ['今日 8:00更新', '新しい'], asset: 'rain' },
  ],
  solvedTopId: 'w-d',
  solvedLine: '明日の午後、雨なんだ！\n傘を持っていこう',
  solvedAsset: 'umbrella',
  failLines: {
    'w-a': '晴れって書いてあったから傘を持っていかなかったのに……\n遠足、雨だった',
    'w-b': '9月の気温……？\n明日雨が降るか知りたかったんだけどな',
    'w-c': '今日の天気か……\n明日のことが知りたかったんだよね',
  },
  failFallback: 'うーん、明日のことが分からないな',
  requery: '東京 明日 雨 降る？',
}

/** STEP 3 — SEARCH RUSH: quick tasks while the backlog grows. */
export const RUSH_VOICES: VoiceTask[] = [
  {
    id: 'rush-train',
    user: 'dad',
    userName: 'お父さん',
    voice: '電車、今動いてるのかな？\n会社に間に合うか心配で……',
    query: '電車　今日　運行状況',
    cards: [
      { id: 't-history', title: '電車の歴史をたどる', meta: ['去年の記事'], asset: 'train' },
      { id: 't-yesterday', title: '昨日の運行情報', meta: ['昨日 更新'], asset: 'train' },
      { id: 't-now', title: '本日の運行状況（鉄道会社）', meta: ['10分前 更新', '公式'], asset: 'train' },
    ],
    solvedTopId: 't-now',
    solvedLine: '動いてる！行ってきます！',
    solvedAsset: 'train',
    failLines: {
      't-history': '歴史……？今日動いてるかが知りたいんだけど',
      't-yesterday': '昨日のことか……今日はどうなんだろう',
    },
    failFallback: 'うーん、今日のことが分からないな',
    requery: '電車 今 動いてる？',
  },
  {
    id: 'rush-event',
    user: 'mom',
    userName: 'お母さん',
    voice: '今日のイベント、何時からだっけ？\n遅れたくないな',
    query: 'イベント　何時から？',
    cards: [
      { id: 'e-blog', title: '去年のイベントに行ってきた！', meta: ['去年', 'よく見られている'], asset: 'news' },
      { id: 'e-official', title: 'イベント開催案内（主催者）', meta: ['公式', '今日 更新'], asset: 'clock' },
      { id: 'e-photo', title: 'イベント会場の写真まとめ', meta: ['1年前'], asset: 'photo' },
    ],
    solvedTopId: 'e-official',
    solvedLine: '10時からだ！間に合う！',
    solvedAsset: 'clock',
    failLines: {
      'e-blog': '去年の話か……今日は何時からなんだろう',
      'e-photo': '写真じゃなくて、時間が知りたいんだけど……',
    },
    failFallback: 'うーん、時間が分からないな',
    requery: 'イベント 今日 開始時刻',
  },
  {
    id: 'rush-play',
    user: 'teen',
    userName: '中学生',
    voice: '小学生のいとこと遊ぶんだけど、\n最近なにが人気なんだろう？',
    query: '小学生に人気の遊び',
    cards: [
      { id: 'p-rule', title: '公園のご利用ルール', meta: ['公式'], asset: 'ticket' },
      { id: 'p-rank', title: '小学生に人気の遊びランキング', meta: ['とてもよく見られている'], asset: 'play' },
      { id: 'p-old', title: '昭和の子どもの遊び', meta: ['5年前'], asset: 'photo' },
    ],
    solvedTopId: 'p-rank',
    solvedLine: 'なるほど、これで遊ぼう！',
    solvedAsset: 'play',
    failLines: {
      'p-rule': 'ルール……？人気の遊びが知りたいんだけど',
      'p-old': '昭和……？最近のが知りたいんだよね',
    },
    failFallback: 'うーん、いまの人気が分からないな',
    requery: '小学生 人気 遊び 最近',
  },
]

/**
 * Counter milestones for SEARCH RUSH: after each rush voice is solved,
 * the counters jump to these values. Index = number of rush voices solved.
 */
export const RUSH_COUNTERS: { fixed: number; remaining: number }[] = [
  { fixed: 2, remaining: 1 },
  { fixed: 3, remaining: 7 },
  { fixed: 4, remaining: 18 },
  { fixed: 5, remaining: 95 },
]

/** Queries that "arrive" as notifications during SEARCH RUSH (deterministic order). */
export const RUSH_INCOMING: string[] = [
  '上野動物園 今日 開いてる？', 'ゲーム 最新アップデート', '電車 子ども料金', '東京 昔の写真',
  '小学生 自由研究 おすすめ', 'はじめて犬を飼う 準備', '10年前の台風', '上野動物園 小学生 楽しかった？',
  '明日 遠足 持ち物', '近くの公園 遊具', '給食 献立 今日', '図書館 何時まで', 'サッカー ルール',
  '恐竜 いちばん大きい', '富士山 高さ', '自転車 サイズ 小学生', 'プール 今日 開いてる', '運動会 何時から',
  'カブトムシ 飼い方', '花火大会 今年', '虹 なぜできる', 'ピアノ 発表会 服', '雪 いつ降る', '月 今日 満月？',
  'なわとび 二重とび', '海 いちばん深いところ', 'うさぎ なにを食べる', '台風 いま どこ',
  'おりがみ つる おりかた', '宿題 終わらない', 'バス 時刻表 今日', 'けん玉 やり方', '星 なまえ',
  'アイス 手作り', 'スニーカー 洗い方', '自由研究 1日でできる', 'カレー ルーなし', '転校 ともだち',
]

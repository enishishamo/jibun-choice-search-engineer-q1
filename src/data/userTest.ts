import type { ResidualCase, StrategyId, TestUser } from '../game/types.ts'

/**
 * Ten people try the new system. The first two are played slowly so the
 * children understand what is being watched — did this person find what they
 * were looking for? — and the one who still cannot find it comes last, so the
 * test ends on the open question the team then has to decide about.
 */
export const TEST_USERS: TestUser[] = [
  {
    kind: 'girl', name: '女の子', query: '東京 明日の天気', mood: 'happy',
    need: '明日 遠足なんだ。雨が降るか 知りたい',
    line: '明日の雨が わかった！', nextAction: '傘を 持っていこう', asset: 'umbrella',
  },
  {
    kind: 'boy', name: '男の子', query: '電車 今日 運行状況', mood: 'happy',
    need: '今日、電車が 動いてるか 知りたい',
    line: '今日の電車情報が 見つかった！', nextAction: 'よし、行ってきます！', asset: 'train',
  },
  { kind: 'grandpa', name: 'おじいさん', query: '東京 昔の写真', mood: 'happy', line: '昔の東京の写真が 見つかった', asset: 'photo' },
  { kind: 'mom', name: 'お母さん', query: '上野動物園 今日 開いてる？', mood: 'happy' },
  { kind: 'dad', name: 'お父さん', query: '電車 子ども料金', mood: 'happy' },
  { kind: 'grandma', name: 'おばあさん', query: 'はじめて犬を飼う 準備', mood: 'happy' },
  { kind: 'girl', name: '女の子', query: '小学生 自由研究 おすすめ', mood: 'happy' },
  { kind: 'boy', name: '男の子', query: 'ゲーム 最新アップデート', mood: 'happy' },
  { kind: 'mom', name: 'お母さん', query: '小学生に人気の遊び', mood: 'happy' },
  // last on purpose: the one who still cannot find it
  { kind: 'teen', name: '中学生', query: '', mood: 'meh' },
]

/** How many people are played slowly, step by step, before the pace picks up. */
export const SLOW_USERS = 2

/** Route C: the same test with more people, to see whether it was a fluke. */
export const FIRST_ROUND = { total: 10, found: 9, still: 1 }
export const SECOND_ROUND = { total: 20, found: 18, still: 2 }

/**
 * The one "still hard to find" case. Which one it is depends on which
 * strategies the team already tuned, so it is never something they fixed.
 */
export const RESIDUAL_CASES: ResidualCase[] = [
  {
    caseId: 'event-time',
    user: 'teen',
    userName: '中学生',
    line: '「イベント 何時から？」で調べたけど、時間がなかなか見つからなかった',
    results: [
      { title: 'イベントに行ってきた！感想ブログ', asset: 'news' },
      { title: 'イベント会場 周辺のお店', asset: 'photo' },
      { title: 'イベント開催案内（主催者）', asset: 'clock' },
    ],
    fixStrategy: 'OFFICIAL',
    fixedResults: [
      { title: 'イベント開催案内（主催者）', asset: 'clock' },
      { title: 'イベントに行ってきた！感想ブログ', asset: 'news' },
      { title: 'イベント会場 周辺のお店', asset: 'photo' },
    ],
    fixedLine: 'あ、見つかった！10時からだ',
    stillLine: 'うーん、まだ時間が見つけにくいな……',
  },
  {
    caseId: 'first-dog',
    user: 'teen',
    userName: '中学生',
    line: '「はじめて犬を飼う 準備」で調べたけど、みんながやってる定番がなかなか見つからなかった',
    results: [
      { title: '犬の登録手続きについて（役所）', asset: 'ticket' },
      { title: '昨日の犬のニュース', asset: 'news' },
      { title: 'はじめて犬を飼う人の準備リスト（定番）', asset: 'dog' },
    ],
    fixStrategy: 'EYES',
    fixedResults: [
      { title: 'はじめて犬を飼う人の準備リスト（定番）', asset: 'dog' },
      { title: '犬の登録手続きについて（役所）', asset: 'ticket' },
      { title: '昨日の犬のニュース', asset: 'news' },
    ],
    fixedLine: 'あ、見つかった！これを準備すればいいんだ',
    stillLine: 'うーん、まだ定番のが見つけにくいな……',
  },
  {
    caseId: 'tokyo-tomorrow',
    user: 'teen',
    userName: '中学生',
    line: '「東京 明日の天気」で調べたけど、明日の予報がなかなか見つからなかった',
    results: [
      { title: '東京の9月の気温と服装', asset: 'calendar' },
      { title: '気象庁 天気予報のしくみ', asset: 'ticket' },
      { title: '東京、明日は午後から雨の予報（今日 8:00）', asset: 'rain' },
    ],
    fixStrategy: 'NEW',
    fixedResults: [
      { title: '東京、明日は午後から雨の予報（今日 8:00）', asset: 'rain' },
      { title: '東京の9月の気温と服装', asset: 'calendar' },
      { title: '気象庁 天気予報のしくみ', asset: 'ticket' },
    ],
    fixedLine: 'あ、見つかった！明日は午後から雨だ',
    stillLine: 'うーん、まだ明日の予報が見つけにくいな……',
  },
]

/** Pick the residual case for a team, given the strategies they tuned. */
export function pickResidualCase(tuned: StrategyId[]): ResidualCase {
  const untouched = RESIDUAL_CASES.find((r) => !tuned.includes(r.fixStrategy))
  return untouched ?? RESIDUAL_CASES[0]
}

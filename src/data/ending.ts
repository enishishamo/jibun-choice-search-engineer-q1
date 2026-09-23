import type { AssetName, UserKind } from '../game/types.ts'

/**
 * The people the children started from, seen twice: how it was before their
 * change, and how it is now. The release animation is only the middle of the
 * story — this is the end of it.
 */
export interface EndingPerson {
  kind: UserKind
  query: string
  before: string
  after: string
  asset: AssetName
}

export const ENDING_PEOPLE: EndingPerson[] = [
  {
    kind: 'girl',
    query: '東京 明日の天気',
    before: '明日の天気を 知りたいのに、\n古い情報ばかり……',
    after: '明日の雨が わかった！\n傘を 持っていこう',
    asset: 'umbrella',
  },
  {
    kind: 'grandpa',
    query: '東京 昔の写真',
    before: '昔の東京を 見たいのに、\n新しいニュースばかり……',
    after: '探していた 昔の東京が\n見つかった！',
    asset: 'photo',
  },
  {
    kind: 'boy',
    query: '電車 今日 運行状況',
    before: '今日、電車が 動いているか\n知りたいのに……',
    after: '今日の電車情報が\n見つかった！',
    asset: 'train',
  },
]

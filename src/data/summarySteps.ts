/**
 * The RELEASE-time recap. This is the shape of the work, not the log of what
 * was clicked: no "100件", no strategy name, no head-counts. Every team sees
 * the same six steps, because every team really did all six.
 */
export interface SummaryStep {
  icon: string
  title: string
  sub: string
}

export const SUMMARY_STEPS: SummaryStep[] = [
  { icon: '🔎', title: 'こまっている検索を 見つけた', sub: 'ほしい情報が 見つからない人が いた' },
  { icon: '💡', title: 'どうしたら よくなるか 考えた', sub: 'どんな情報を 大事にする？' },
  { icon: '⚙️', title: '検索の しくみを 変えた', sub: '1件ずつ ではなく、たくさんに 効くようにした' },
  { icon: '🧪', title: 'たくさんの検索で ためした', sub: 'よくなった？ こまった検索は ない？' },
  { icon: '👥', title: '実際の人にも 使ってもらった', sub: 'ほんとうに ほしい情報を 見つけられる？' },
  { icon: '🚀', title: '結果を見て、届けるか 決めた', sub: 'このまま？ 直す？ もっと試す？' },
]

/**
 * Points where the real search engineer speaks. The screen only shows a short
 * cue; the words belong to the professional. `facilitatorNote` is visible in
 * the facilitator panel only, never on the children's screen.
 *
 * Every one of these is preceded by a screen where the children think first,
 * and followed by a screen that shows the same idea with concrete searches.
 */
export interface ProPoint {
  id: 'PRO_1' | 'PRO_2' | 'PRO_3' | 'PRO_4' | 'PRO_FINAL'
  cue: string
  sub?: string
  facilitatorNote: string
  next: string
}

export const PRO_POINTS: Record<ProPoint['id'], ProPoint> = {
  PRO_1: {
    id: 'PRO_1',
    cue: 'エンジニアプロに 聞いてみる',
    sub: 'たくさんの検索、どうしてるんだろう？',
    facilitatorNote:
      '実際の検索でもものすごくたくさんの検索があるから、全部を人が1個ずつ並べ替えているわけじゃない。たくさんの検索にまとめて効くように仕組みを変えて、それが本当に良くなったか試すことがある。',
    next: 'しくみを 見てみる',
  },
  PRO_2: {
    id: 'PRO_2',
    cue: 'エンジニアプロに 聞いてみる',
    sub: 'うまくいった検索と、こまった検索があった',
    facilitatorNote:
      '1つのやり方が、全部の検索にうまくいくとは限らないよ。うまくいったものと、うまくいかなかったものを比べると、どんなときに使えそうか見えてくることがある。（どの検索でどうするかは言わず、比べ方だけ渡す）',
    next: 'くらべてみる',
  },
  PRO_3: {
    id: 'PRO_3',
    cue: 'エンジニアプロに 聞いてみる',
    sub: 'まだ 分からないことが あるかもしれない',
    facilitatorNote:
      '検索の例でよさそうでも、本当に人が使ったときによくなっているとは限らない。だから、いきなりみんなには出さず、まず少しの人に使ってもらって確かめることがあるよ。',
    next: 'たしかめ方を 見る',
  },
  PRO_4: {
    id: 'PRO_4',
    cue: 'エンジニアプロに 聞いてみる',
    sub: 'この結果を見て、エンジニアは どうやって次を決める？',
    facilitatorNote:
      '世界中のたくさんの人が使うものだから、「自分はいいと思う！」だけでは決めない。試した結果を見て、みんなで話し合って、本当に出していいかを決めるんだ。',
    next: 'つぎへ',
  },
  PRO_FINAL: {
    id: 'PRO_FINAL',
    cue: 'エンジニアプロに 聞いてみよう',
    sub: 'いま みんなが やったこと、ほんとの仕事でもやってる？',
    facilitatorNote:
      '問題を見つけて、どう直すか考えて、仕組みを変えて、たくさん試して、人にも使ってもらって、結果を見てどうするか決める。今みんながやったことは、私が実際にやっている仕事にもつながっている。（必要なら：実際の仕事では、試した結果、今回は出さないと決めることもある）',
    next: 'おわり',
  },
}

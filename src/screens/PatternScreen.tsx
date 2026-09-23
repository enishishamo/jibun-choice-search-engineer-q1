import { PATTERN_CHILD, PATTERN_PRO, PATTERN_THIRD, type PatternGroup } from '../data/patterns.ts'
import { STRATEGIES } from '../data/strategies.ts'
import { Button } from '../components/ui.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

type Beat = 'pro' | 'pro-reveal' | 'child' | 'child-reveal' | 'third' | 'third-reveal' | 'sum'

interface Props {
  beat: string
  onBeat: (b: string) => void
  onNext: () => void
}

/**
 * Learning ②. Where the three strategies come from: comparing searches and
 * noticing what they share. The professional works one example, then the
 * children do the next two. Nothing is marked right or wrong — the reveal is
 * simply what these particular searches have in common.
 */
export function PatternScreen({ beat: rawBeat, onBeat, onNext }: Props) {
  const beat = (rawBeat || 'pro') as Beat

  if (beat === 'sum') {
    return (
      <div className="col w-full fade-in" style={{ gap: 16 }}>
        <ScaleBar at={1} />
        <h1 className="h1 center">見つかった 3つの 作戦</h1>
        <div className="patsum">
          {STRATEGIES.map((s, i) => (
            <div key={s.id} className="patsum__card pop-in" style={{ animationDelay: `${i * 0.12}s`, ['--accent' as string]: s.color }}>
              <span className="patsum__icon">{s.id === 'NEW' ? '🆕' : s.id === 'EYES' ? '👀' : '🏛️'}</span>
              <span className="patsum__tag">{s.tagline}</span>
            </div>
          ))}
        </div>
        <div className="learncard">
          <p className="pre">{'たくさんの検索に 使える「しくみ」を 考えるために、\nいろいろな検索を くらべて、共通する パターンを 見つける。'}</p>
        </div>
        <div className="col center" style={{ gap: 12 }}>
          <p className="h2 pre">{'見つけた パターン、\nほんとうに たくさんの検索に 使えるかな？'}</p>
          <Button size="lg" onClick={onNext}>ためしてみる</Button>
        </div>
      </div>
    )
  }

  const stage: {
    group: PatternGroup
    lead: string
    question: string
    thinkLine?: string
    cta: string
    revealBeat: Beat
    nextBeat: Beat
  } = beat.startsWith('pro')
    ? {
        group: PATTERN_PRO,
        lead: 'エンジニアプロは、こんなふうに 考えることがあるよ。',
        question: 'この3つ、何か 似てない？',
        cta: 'なるほど！',
        revealBeat: 'pro-reveal',
        nextBeat: 'child',
      }
    : beat.startsWith('child')
      ? {
          group: PATTERN_CHILD,
          lead: '今度は、みんなで 見つけてみよう！',
          question: 'この3つに 共通するのは、なんだろう？',
          thinkLine: '3人で 考えてみよう',
          cta: 'わかったかも！',
          revealBeat: 'child-reveal',
          nextBeat: 'third',
        }
      : {
          group: PATTERN_THIRD,
          lead: 'もう1つだけ。',
          question: 'この3つは？',
          thinkLine: '3人で 考えてみよう',
          cta: 'わかったかも！',
          revealBeat: 'third-reveal',
          nextBeat: 'sum',
        }

  const revealed = beat.endsWith('-reveal')

  return (
    <div className="col w-full fade-in" style={{ gap: 14 }}>
      <ScaleBar at={1} />
      <div className="center">
        <p className="sub">{stage.lead}</p>
        <h1 className="h1">{stage.question}</h1>
      </div>

      <div className="patgroup">
        {stage.group.items.map((it, i) => (
          <div key={it.query} className={`patcard ${revealed ? 'is-revealed' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="patcard__icon">{it.icon}</span>
            <div className="patcard__body">
              <div className="patcard__q">🔎 {highlight(it.query, revealed ? it.key : undefined)}</div>
              <div className="patcard__note">{it.note}</div>
            </div>
          </div>
        ))}
      </div>

      {!revealed && (
        <div className="col center" style={{ gap: 12 }}>
          {stage.thinkLine && <p className="sub">{stage.thinkLine}</p>}
          <Button size="lg" color={stage.thinkLine ? 'yellow' : 'teal'} onClick={() => onBeat(stage.revealBeat)}>{stage.cta}</Button>
        </div>
      )}

      {revealed && (
        <div className="col center pop-in" style={{ gap: 12 }}>
          {/* the words are already glowing by now; the name lands a beat later */}
          <div className="patreveal"><span>{stage.group.icon}</span>{stage.group.reveal}</div>
          <Button size="lg" className="delayed" onClick={() => onBeat(stage.nextBeat)}>つぎへ</Button>
        </div>
      )}
    </div>
  )
}

/** Put a ring around the word the searches share, once it has been revealed. */
function highlight(query: string, key?: string) {
  if (!key || !query.includes(key)) return query
  const [head, ...rest] = query.split(key)
  return (
    <>
      {head}<mark className="patmark">{key}</mark>{rest.join(key)}
    </>
  )
}

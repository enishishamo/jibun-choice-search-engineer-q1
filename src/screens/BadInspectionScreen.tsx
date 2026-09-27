import { useMemo, useState } from 'react'
import type { StrategyId } from '../game/types.ts'
import { STRATEGY_BY_ID } from '../data/strategies.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import { evaluateRaw } from '../game/logic.ts'
import { Button, SearchBox, Speech, StaticResult } from '../components/ui.tsx'
import { QueryList } from '../components/QueryList.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

interface Props {
  strategy: StrategyId
  /** current beat, held in game state so the facilitator can step back */
  beat: string
  onBeat: (b: string) => void
  onNext: () => void
}

/**
 * Zoom back in: the cards that piled up in the tray are opened one by one and
 * turn back into a person with a problem. No cause is ever explained here.
 */
export function BadInspectionScreen({ strategy, beat: rawBeat, onBeat, onNext }: Props) {
  const beat = (rawBeat || 'notice') as 'notice' | 'look' | 'think'
  const raw = useMemo(() => evaluateRaw(strategy), [strategy])
  const worked = raw.results.filter((r) => r.verdict === 'GOOD')
  const didnt = raw.results.filter((r) => r.verdict === 'BAD')
  const s = STRATEGY_BY_ID[strategy]
  const [open, setOpen] = useState<string | null>(null)
  const [seen, setSeen] = useState<Set<string>>(new Set())
  const file = s.badFiles.find((f) => f.caseId === open)
  const c = file ? CASE_BY_ID[file.caseId] : null

  if (beat === 'notice') {
    return (
      <div className="col w-full fade-in" style={{ gap: 18 }}>
        <div className="center">
          <h1 className="h1 pre">{'あれ？\n同じ作戦なのに、結果が ちがう。'}</h1>
        </div>
        <div className="twocol">
          <div className="twocol__side twocol__side--good">
            <div className="twocol__head">うまくいった検索</div>
            <QueryList results={worked} />
          </div>
          <div className="twocol__side twocol__side--bad">
            <div className="twocol__head">うまくいかなかった検索</div>
            <QueryList results={didnt} />
          </div>
        </div>
        <div className="btn-row">
          <Button size="lg" onClick={() => onBeat('look')}>くわしく 見てみる</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="col w-full fade-in" style={{ gap: 18 }}>
      <div className="center">
        <div className="label">うまくいかなかった検索</div>
        <h1 className="h1">ひらいて みよう</h1>
        <p className="sub">気になる カードを ひらいてみよう。何人でも ひらけるよ</p>
      </div>

      <div className="files">
        {s.badFiles.map((f) => {
          const cs = CASE_BY_ID[f.caseId]
          return (
            <button
              key={f.caseId}
              type="button"
              className={`file ${open === f.caseId ? 'is-open' : ''} ${seen.has(f.caseId) && open !== f.caseId ? 'is-seen' : ''}`}
              onClick={() => { setOpen(f.caseId); setSeen((v) => new Set(v).add(f.caseId)) }}
            >
              <ClayAsset name={cs.asset} size={48} />
              <div className="grow">
                <div className="file__q">🔎 {cs.query}</div>
                <div className="file__intent">{f.userName}が しらべた</div>
              </div>
              <span aria-hidden="true">👆</span>
            </button>
          )
        })}
      </div>

      {file && c && (
        <div className="clay clay--tint col w-full pop-in" key={file.caseId} style={{ gap: 14, alignItems: 'stretch' }}>
          <SearchBox query={c.query} />
          <div className="label">作戦の あと</div>
          <div className="afterlist">
            {file.after.map((a, i) => (
              <StaticResult key={a.title} card={{ title: a.title, asset: i === file.after.length - 1 ? c.asset : 'news' }} rank={i + 1} move={a.move} />
            ))}
          </div>
          <Speech kind={file.user} name={file.userName} mood="meh">{file.userLine}</Speech>
        </div>
      )}

      {beat === 'look' && (
        <div className="btn-row">
          <Button size="lg" color="yellow" disabled={seen.size === 0} onClick={() => onBeat('think')}>
            {seen.size === 0 ? 'カードを ひらいてみよう' : 'うーん……'}
          </Button>
        </div>
      )}

      {beat === 'think' && (
        <div className="col pop-in" style={{ gap: 14 }}>
          <h2 className="h2 pre">{'同じ作戦を 使ったのに、\nどうして 結果が ちがったんだろう？'}</h2>
          <p className="h2">何が ちがう？</p>
          <p className="sub">4人で 考えてみよう。どんな答えでも いいよ</p>
          <Button size="lg" color="teal" onClick={onNext}>エンジニアプロに 聞いてみる</Button>
        </div>
      )}
    </div>
  )
}

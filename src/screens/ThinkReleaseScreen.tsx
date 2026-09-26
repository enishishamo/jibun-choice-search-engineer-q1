import { useEffect, useState } from 'react'
import { Button } from '../components/ui.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

type Beat = 'think' | 'ask'

/**
 * Before anyone suggests a user test, the team is asked an open question —
 * is there anything we still don't know? — rather than a yes/no "ship it?"
 * that reads as a right-answer guess. "Use real people" is never said here;
 * that idea belongs to the engineer, on the next screen.
 */
interface Props {
  /** current beat, held in game state so the facilitator can step back */
  beat: string
  onBeat: (b: string) => void
  onNext: () => void
}

export function ThinkReleaseScreen({ beat: rawBeat, onBeat, onNext }: Props) {
  const beat = (rawBeat || 'think') as Beat
  const [askShown, setAskShown] = useState(false)

  useEffect(() => {
    if (beat !== 'think') return
    const t = setTimeout(() => setAskShown(true), 1800)
    return () => clearTimeout(t)
  }, [beat])

  if (beat === 'ask') {
    return (
      <div className="col fade-in" style={{ gap: 18, textAlign: 'center' }}>
        <h1 className="h1 pre">{'実際の エンジニアは、\nここから どうするんだろう？'}</h1>
        <Button size="lg" color="teal" onClick={onNext}>エンジニアプロに 聞いてみる</Button>
      </div>
    )
  }

  return (
    <div className="col w-full fade-in" style={{ gap: 16, textAlign: 'center' }}>
      <ScaleBar at={1} stopBefore />
      <h2 className="h2 pre">{'100件では、\nかなり よさそうだった。'}</h2>
      <h1 className="h1 pre">{'でも、\nまだ 分からないことって\nあるかな？'}</h1>
      <p className="sub">3人で 考えてみよう。</p>
      {askShown && <Button size="lg" className="pop-in" onClick={() => onBeat('ask')}>考えてみた！</Button>}
    </div>
  )
}

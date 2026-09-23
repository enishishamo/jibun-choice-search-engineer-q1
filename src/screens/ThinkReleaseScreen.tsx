import { useEffect, useState } from 'react'
import { Button } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

type Beat = 'think' | 'ask'

/**
 * Before anyone suggests a user test, the team is asked the question itself:
 * it looked good on 100 searches, so is that enough to ship to everyone?
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
        <h1 className="h1">エンジニアプロは、どうする？</h1>
        <Button size="lg" color="teal" onClick={onNext}>エンジニアプロに 聞いてみる</Button>
      </div>
    )
  }

  return (
    <div className="col w-full fade-in" style={{ gap: 16, textAlign: 'center' }}>
      <ScaleBar at={1} stopBefore />
      <h2 className="h2 pre">{'100件で ためしたら、\nかなり よさそう！'}</h2>
      <ClayAsset name="globe" size={140} />
      <h1 className="h1 pre">{'じゃあ、もう 世界中の人に\n使ってもらって いいと思う？'}</h1>
      <p className="sub">3人で 考えてみよう。どんな答えでも いいよ</p>
      {askShown && <Button size="lg" className="pop-in" onClick={() => onBeat('ask')}>考えてみた！</Button>}
    </div>
  )
}

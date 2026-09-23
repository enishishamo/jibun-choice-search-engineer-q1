import { Button } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

/** START — the children press this themselves. No lesson, no job explanation. */
export function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="title fade-in">
      <div className="title__logo pop-in"><ClayAsset name="magnifier" size={132} /></div>
      <div className="label">JIBUN CHOICE · SEARCH ENGINEER</div>
      <h1 className="h1 pre title__mission">{'検索をもっと便利にして、\n最後に世界へ届けよう！'}</h1>
      <Button size="lg" onClick={onStart}>ゲームスタート！</Button>
    </div>
  )
}

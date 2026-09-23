import { Button, Notice } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

/** Route A — nothing extra to do. */
export function DirectReleaseScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="col fade-in" style={{ gap: 20, textAlign: 'center' }}>
      <Notice color="coral">このまま 届ける</Notice>
      <ClayAsset name="globe" size={110} />
      <h1 className="h1">この結果なら 届けてみよう</h1>
      <Button size="lg" color="teal" onClick={onNext}>じゅんび できた！</Button>
    </div>
  )
}

import { UserAvatar } from '../components/UserAvatar.tsx'
import { Button } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

/**
 * Learning ④. The same search on both sides, so the difference is between
 * "the results look right" and "this person found what they came for" —
 * visible without reading the caption.
 */
export function BridgeToUserTestScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="col w-full fade-in" style={{ gap: 16 }}>
      <ScaleBar at={2} from={1} />

      <div className="twocol twocol--wide">
        <div className="twocol__side">
          <div className="twocol__head">🧪　検索で たしかめた</div>
          <div className="twocol__body">
            <span className="mini-q">🔎 東京 明日の天気</span>
            <span className="twocol__down" aria-hidden="true">↓</span>
            <ClayAsset name="rain" size={40} />
            <p>新しい 天気予報が 上に 来た</p>
            <span className="twocol__tick">✓ よさそう</span>
          </div>
        </div>

        <div className="twocol__side twocol__side--ask">
          <div className="twocol__head">👧　実際の人が 使う</div>
          <div className="twocol__body">
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <UserAvatar kind="girl" size={44} />
              <span className="mini-need">「明日の遠足、雨かな？」</span>
            </div>
            <span className="mini-q">🔎 東京 明日の天気</span>
            <span className="twocol__down" aria-hidden="true">↓</span>
            <ClayAsset name="umbrella" size={40} />
            <p className="pre">{'「雨なんだ！\n傘を 持っていこう」'}</p>
            <span className="twocol__found">✓ 見つかった</span>
          </div>
        </div>
      </div>

      <div className="learncard">
        <p className="pre">{'検索の例だけでなく、ほんとうに 人の役に立つか 確かめるために、\n実際の人に 使ってもらう。'}</p>
      </div>

      <div className="btn-row">
        <Button size="lg" onClick={onNext}>
          <span className="btn__stack">少しの人に 使ってもらう<small>USER TEST</small></span>
        </Button>
      </div>
    </div>
  )
}

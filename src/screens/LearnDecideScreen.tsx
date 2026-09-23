import { Button } from '../components/ui.tsx'
import { ScaleBar } from '../components/ScaleBar.tsx'

/**
 * Learning ⑤, second half. How the decision to ship gets made: by looking at
 * what the test showed and talking it over, not by one person feeling good
 * about it.
 */
export function LearnDecideScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="col w-full fade-in" style={{ gap: 16 }}>
      <ScaleBar at={3} from={2} />
      <div className="learncard">
        <p className="pre">{'世界中の たくさんの人に 届けてよいか 決めるために、\n試した結果を 見て、みんなで 話し合う。'}</p>
      </div>
      <div className="decidebits">
        <div className="decidebit"><span>📋</span>試した結果を 見る</div>
        <div className="decidebit"><span>💬</span>みんなで 話し合う</div>
        <div className="decidebit"><span>🌏</span>届けるか 決める</div>
      </div>
      <div className="notonly">「自分は いいと思う」だけでは 決めない。</div>
      <div className="btn-row">
        <Button size="lg" onClick={onNext}>じゃあ、次に どうする？</Button>
      </div>
    </div>
  )
}

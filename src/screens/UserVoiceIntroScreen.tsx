import { Button, Notice } from '../components/ui.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'

/**
 * The doorway into the story: the first boy is not "question 1" of a
 * worksheet, he is the search team's first request. One screen, mission only
 * — no mechanism is taught here.
 */
export function UserVoiceIntroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="col fade-in" style={{ gap: 20, textAlign: 'center' }}>
      <Notice color="coral"><ClayAsset name="mail" size={24} /> USER VOICE</Notice>
      <h1 className="h1 pre">{'検索チームに\n最初の依頼が届きました！'}</h1>
      <div className="learncard">
        <p className="pre">{'4人の ミッション\n\n検索で 困っている人を、\n「見つからない」\n↓\n「見つかった！」\nに 変えよう。'}</p>
      </div>
      <Button size="lg" onClick={onNext}>USER VOICEを 見てみる</Button>
    </div>
  )
}

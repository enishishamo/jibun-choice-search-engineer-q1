import { useEffect, useState } from 'react'
import { FIRST_ROUND, SECOND_ROUND } from '../data/userTest.ts'
import { UserAvatar } from '../components/UserAvatar.tsx'
import { Button, Notice } from '../components/ui.tsx'
import type { UserKind } from '../game/types.ts'

const KINDS: UserKind[] = ['girl', 'boy', 'mom', 'grandpa', 'dad', 'grandma', 'teen']

/**
 * Route C. Not "we ran it again" but "we asked more people, to see whether the
 * first ten were a fluke". The two rounds are shown side by side so the answer
 * is read off the picture, with no statistics talk.
 */
export function ExtraTestScreen({ onNext }: { onNext: () => void }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= SECOND_ROUND.total) return
    const t = setTimeout(() => setShown((n) => n + 1), 90)
    return () => clearTimeout(t)
  }, [shown])
  const done = shown >= SECOND_ROUND.total

  return (
    <div className="col w-full fade-in" style={{ gap: 18, textAlign: 'center' }}>
      <Notice color="coral">もう少し 試してみる</Notice>

      <div className="rounds">
        <div className="round">
          <div className="round__head">さいしょの {FIRST_ROUND.total}人</div>
          <div className="round__faces">
            {Array.from({ length: FIRST_ROUND.total }, (_, i) => (
              <UserAvatar key={i} kind={KINDS[i % KINDS.length]} size={30} mood={i < FIRST_ROUND.found ? 'happy' : 'meh'} />
            ))}
          </div>
          <div className="round__nums">
            <span className="round__ok">{FIRST_ROUND.found}人 見つかった</span>
            <span className="round__still">{FIRST_ROUND.still}人 まだ</span>
          </div>
        </div>

        <div className="round round--new">
          <div className="round__head">もう {SECOND_ROUND.total}人に 使ってもらった</div>
          <div className="round__faces">
            {Array.from({ length: SECOND_ROUND.total }, (_, i) => (
              <span key={i} style={{ opacity: i < shown ? 1 : 0.12, transition: 'opacity .2s' }}>
                <UserAvatar kind={KINDS[i % KINDS.length]} size={30} mood={i < SECOND_ROUND.found ? 'happy' : 'meh'} />
              </span>
            ))}
          </div>
          <div className="round__nums">
            <span className="round__ok">{done ? SECOND_ROUND.found : Math.min(shown, SECOND_ROUND.found)}人 見つかった</span>
            {done && <span className="round__still">{SECOND_ROUND.still}人 まだ</span>}
          </div>
        </div>
      </div>

      {done && (
        <div className="col pop-in" style={{ gap: 14 }}>
          <h1 className="h1 pre">{'人数を ふやしても、\nだいたい 同じ結果だった'}</h1>
          <Button size="lg" color="teal" onClick={onNext}>じゅんび できた！</Button>
        </div>
      )}
    </div>
  )
}

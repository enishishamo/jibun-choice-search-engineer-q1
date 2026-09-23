import { useEffect, useState } from 'react'
import { SLOW_USERS, TEST_USERS, pickResidualCase } from '../data/userTest.ts'
import { CASE_BY_ID } from '../data/searchCases.ts'
import type { StrategyId, TestUser } from '../game/types.ts'
import { UserAvatar } from '../components/UserAvatar.tsx'
import { ClayAsset } from '../components/ClayAsset.tsx'
import { Button, Notice, SearchBox } from '../components/ui.tsx'

interface Props {
  tuned: StrategyId[]
  onNext: () => void
}

/**
 * Ten people try it. The first two are played step by step and the children
 * press on themselves, so the question being asked — did this person find what
 * they wanted? — is understood before the pace picks up. The middle runs fast
 * to give a sense of number. The last person cannot find it, and the screen
 * stops there, which is exactly what the team has to decide about next.
 */
export function UserTestScreen({ tuned, onNext }: Props) {
  const residual = pickResidualCase(tuned)
  const residualQuery = CASE_BY_ID[residual.caseId].query
  const users: TestUser[] = TEST_USERS.map((u) => (u.mood === 'meh' ? { ...u, query: residualQuery } : u))
  const lastIndex = users.length - 1

  /** index of the person being played; `done` once everyone has been seen */
  const [idx, setIdx] = useState(0)
  /** sub-step inside a slowly-played person */
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const slow = idx < SLOW_USERS
  const last = idx === lastIndex

  // slow people reveal need → query → searching → result → reaction
  useEffect(() => {
    if (done || !slow || step >= 4) return
    const t = setTimeout(() => setStep((s) => s + 1), 850)
    return () => clearTimeout(t)
  }, [done, slow, step, idx])

  // the middle of the group runs by itself
  useEffect(() => {
    if (done || slow || last) return
    const t = setTimeout(() => setIdx((i) => i + 1), 280)
    return () => clearTimeout(t)
  }, [done, slow, last, idx])

  // the last person: let the "not found" land before offering the summary
  useEffect(() => {
    if (done || !last || step >= 2) return
    const t = setTimeout(() => setStep((s) => s + 1), 900)
    return () => clearTimeout(t)
  }, [done, last, step])

  const nextPerson = () => { setIdx((i) => i + 1); setStep(0) }
  const u = users[Math.min(idx, lastIndex)]
  const found = users.filter((x) => x.mood === 'happy').length

  return (
    <div className="col w-full fade-in" style={{ gap: 16, textAlign: 'center' }}>
      <Notice color={done ? 'good' : 'coral'}>
        {done ? '使ってもらった けっか' : `少しの人に 使ってもらう（${Math.min(idx + 1, users.length)} / ${users.length}）`}
      </Notice>

      <div className="testers">
        {users.map((x, i) => (
          <div key={i} className={`tester ${i < idx || done ? 'is-in' : ''} ${i === idx && !done ? 'is-now' : ''}`}>
            <UserAvatar kind={x.kind} size={46} mood={i < idx || done ? (x.mood === 'happy' ? 'happy' : 'meh') : 'neutral'} />
            <span className={`tester__stamp tester__stamp--${x.mood}`}>
              {i < idx || done ? (x.mood === 'happy' ? '✓' : '🔍') : ''}
            </span>
          </div>
        ))}
      </div>

      {!done && slow && (
        <div className="playcard" key={`slow-${idx}`}>
          <div className="playcard__who">
            <UserAvatar kind={u.kind} size={74} mood={step >= 4 ? 'happy' : 'neutral'} />
            {step >= 0 && <div className="speech__bubble">{u.need}</div>}
          </div>
          {step >= 1 && <div className="pop-in w-full" style={{ display: 'flex', justifyContent: 'center' }}><SearchBox query={u.query} /></div>}
          {step >= 2 && <div className="playcard__searching pop-in">しらべている……</div>}
          {step >= 3 && (
            <div className="playcard__result pop-in">
              <ClayAsset name={u.asset ?? 'magnifier'} size={52} />
              <span>ほしかった情報が 出てきた</span>
            </div>
          )}
          {step >= 4 && (
            <div className="col pop-in" style={{ gap: 12 }}>
              <div className="playcard__line">{u.line}</div>
              {u.nextAction && <div className="playcard__then">{u.nextAction}</div>}
              <span className="badge badge--GOOD badge--lg">✓ 見つかった</span>
              <Button size="lg" color="teal" onClick={nextPerson}>つぎの人</Button>
            </div>
          )}
        </div>
      )}

      {!done && !slow && !last && (
        <div className="playfast">
          <span className="playfast__q">🔎 {u.query}</span>
          <span className="playfast__ok">✓ 見つかった</span>
        </div>
      )}

      {!done && last && (
        <div className="playcard playcard--still" key="last">
          <div className="playcard__who">
            <UserAvatar kind={u.kind} size={74} mood="meh" />
            <div className="speech__bubble">この検索、しらべてみたけど……</div>
          </div>
          <SearchBox query={u.query} />
          {step >= 1 && <div className="playcard__searching pop-in">しらべている……</div>}
          {step >= 2 && (
            <div className="col pop-in" style={{ gap: 12 }}>
              <div className="playcard__still">🔍 ほしい情報が、まだ 見つけにくそう</div>
              <Button size="lg" color="yellow" onClick={() => setDone(true)}>みんなの けっかを 見る</Button>
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="col pop-in" style={{ gap: 14 }}>
          <div className="tally">
            <div className="tally__row tally__row--ok"><b>{found}人</b> ほしい情報を 見つけられた</div>
            <div className="tally__row tally__row--still"><b>1人</b> まだ 見つけにくそう<span className="chip">🔎 {residualQuery}</span></div>
          </div>
          <Button size="lg" color="teal" onClick={onNext}>3人で 話してみる</Button>
        </div>
      )}
    </div>
  )
}

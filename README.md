# JIBUN CHOICE — Search Engineer / 検索エンジニア Q1

小学5年生3名と本物の検索エンジニア「めいちゃん」が、同じ画面を見ながら遊ぶ対面イベント用の仕事体験ゲームです（2026-09-27 実施）。
`jibun-choice-town` とは完全に独立したプロジェクトです。

ミッション：「検索をもっと便利にして、最後に世界へ届けよう！」

## 起動

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # dist/ を生成（静的ホスティングにそのまま置けます）
npm run preview
npm run test       # ロジックの決定論テスト
npm run lint
npm run typecheck
```

## 遊び方の流れ

TITLE → USER_VOICE_1 → USER_VOICE_2 → SEARCH_RUSH → RUSH_STOP → PRO_1 → BRIDGE_TO_SYSTEM ① → PATTERN ② → SYSTEM_MODE → BATCH_CHECK → BAD_INSPECTION ③ → PRO_2 → DEBUG_CLASSIFY → SYSTEM_UPDATED → RECHECK →（2作戦目 任意）→ LEARN_TRY ③ → THINK_RELEASE ④ → PRO_3 → BRIDGE_TO_USERTEST ④ → USER_TEST → THINK_WORLD ⑤ → PRO_4 → LEARN_DECIDE ⑤ → TEAM_DECISION → DIRECT_RELEASE / LAST_DEBUG / EXTRA_TEST → READY_TO_RELEASE → RELEASE → ENDING → PRO_FINAL

学習画面①〜⑤には共通の SCALE BAR（🔎 1つの検索 → 🔎×100 たくさんの検索 → 👥 実際に使う人 → 🌏 世界）が
上部に出て、いまどの範囲を見ながら仕事をしているかを示します。進捗バーではありません。

画面上は「なおす → まとめて試す → 世界へ届ける」の3段階だけを見せます。状態数や進捗率は子どもに見せません。

- 進行はゲームが担保し、判断は子どもがします。UIは正解を教えません。
- エンジニアプロ（PRO_1〜PRO_3）の前には必ず子どもが自分で考える画面があり、
  直後には同じ考え方を実際の検索で見せる画面（BRIDGE_*／くらべる）があります。
  プロの説明を聞き逃しても、ゲームの大筋は画面だけで追えます。
- 結果は必ず前と比べます。再CHECKは「さっき → もう一回」、
  「もう少し試す」は「10人 → もう20人」、ENDINGは各人の BEFORE → AFTER です。
- DEBUG の仕分けは「正解当て」ではありません。5枚すべてを分ければ、その分け方が
  そのまま「自分たちが作った仕組み」として採用され、再CHECKで結果が返ります。
  うまくいっていない部分は「不正解」ではなく「まだ こまっている検索」として見えます。
- SYSTEM UPDATE では、子どもが実際に分けた内容だけを表示します。
  きれいな正解文へ言い換えることはしません。意味づけはめいちゃんが口頭で行います。
- 「めいちゃんに聞いてみよう」画面は本人が口頭で話すための余白です。目安の内容はファシリテーター用パネル（右上の歯車）に表示されます。
- 結果はすべて決定論的です。同じ操作なら同じ結果になります。

## ファシリテーター用パネル

右上の歯車アイコンで開きます。

- 現在の状態と、めいちゃんへの「目安」メモ
- 任意の画面へジャンプ（本番中のリカバリ用）
- はじめから

進行状態は sessionStorage に保存されるため、誤ってリロードしても続きから再開できます。

## 構成

```
src/
  data/        代表12検索ケース・3作戦・USER VOICE・USER TEST・めいちゃん合図・アセット登録
  game/        型・決定論ロジック・状態遷移（reducer）・保存
  components/  クレイ風UI部品（ボタン、カード、ドラッグ並べ替え、アバター、アセットスロット）
  screens/     各STEPの画面
tests/         ロジックと状態遷移のテスト
```

### アセット差し替え

正式なクレイアート素材ができたら `public/assets/` に置き、`src/data/assets.ts` の
`ASSET_IMAGES` / `USER_IMAGES` にパスを登録してください。未登録のものはインラインSVGの
プレースホルダーで描画されるので、途中差し替えでもレイアウトは崩れません。

## 意図的に入れていないもの

スライダー・重み調整・総合スコア・CTR/再検索率などのKPI・3作戦全部の攻略必須・
長いチュートリアル・正解ヒント・「不正解！」表示・職業適性診断・最後の称号・
Google/Appleのロゴや公式画像。

## 素材の状況

画像はすべて仮のインラインSVGです（`src/components/ClayAsset.tsx` と `UserAvatar.tsx`）。
正式なクレイ素材はUI/UX確定後に asset inventory を作ってから制作し、
`public/assets/` へ置いて `src/data/assets.ts` に登録して差し替えます。

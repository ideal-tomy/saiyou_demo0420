# redesign `/clients`

## ページの意思決定目的
本日提案すべき企業案件の優先順を決める。

## 現状課題
- 3カラムカード中心で優先案件が埋もれる。
- 空き枠、緊急度、提案効果の比較がしづらい。
- 一覧から次アクションに直結しにくい。

## 新情報設計（主役/準主役/補助）
- 主役: 優先企業テーブル（企業名/空き枠/緊急度/推奨候補数/主CTA）。
- 準主役: 優先理由（粗利影響、停滞日数、欠員数）。
- 補助: 企業カード一覧（社風、補足情報）。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 上段フル幅テーブル、下段カード2-3列。
- Tablet: テーブル簡易版 + カード2列。
- Mobile: 優先企業リスト（行型） + 詳細カードは折りたたみ。

## 主要コンポーネント差し替え案
- `PriorityClientsTable`（新規）を上段に追加。
- 既存カードは `ClientSummaryCard` として補助枠へ移動。
- `UrgencyBadge` を定義し、色+文言で緊急度を統一表示。

## マイクロコピー置換表
- 案件 -> 提案先企業
- 一覧から詳細・AI候補へ進めます -> 優先順に提案先を確定できます
- 空き -> 未充足枠

## 状態演出（idle/loading/success/retry）
- idle: 算出時刻と優先ロジック（未充足枠×緊急度）を表示。
- loading: テーブル行Skeleton + 「優先順を計算中」。
- success: 優先順位の更新行をハイライト。
- retry: 優先度計算失敗時に「直近順位で表示中」+ 再計算。

## 遷移・状態受け渡し変更点
- 主CTA: `/clients/[id]` に `selectedClientId`, `openSlots`, `priorityRank` を渡す。
- 副CTA: `/matching` に `selectedClientId` と `matchingHintTags` を渡す。

## 実装対象ファイル
- `app/clients/page.tsx`
- `lib/industry-page-hints.ts`
- `lib/demo-data.ts`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 優先企業を30秒以内に1社決定できる。
- 優先企業行から1クリックで詳細へ遷移できる。
- カードだけ見ても緊急度の高低が識別できる。

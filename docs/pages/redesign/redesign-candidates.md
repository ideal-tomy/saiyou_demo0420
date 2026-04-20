# redesign `/candidates`

## ページの意思決定目的
フォロー対象を優先度順に絞り、1名を詳細査定に送る。

## 現状課題
- 一覧カードが均一で優先順位が判別しづらい。
- 検索・フィルタ後の「次アクション」が弱い。
- パイプライン画面と一覧画面の使い分け意図が伝わりにくい。

## 新情報設計（主役/準主役/補助）
- 主役: 優先フォローレーン（最大3名、理由/期限/主CTA）。
- 準主役: パイプライン滞留サマリー + 不備導線。
- 補助: 通常候補者一覧、検索、JLPTフィルタ。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 上段に優先レーン横並び3件、下段で一覧2-3列可変。
- Tablet: 優先レーン1段 + 一覧2列。
- Mobile: 優先レーン縦積み、通常一覧は簡易カード + シート詳細。

## 主要コンポーネント差し替え案
- `PriorityCandidateRail`（新規）を一覧の先頭に追加。
- `CandidateCard` に「至急/本日/今週」バッジを追加。
- パイプラインタブに `StagnationDays` 表示を標準化。

## マイクロコピー置換表
- 一覧 -> 候補者一覧（通常）
- 詳細を開く -> 査定を進める
- 全ステータスの優先候補 -> 本日優先候補

## 状態演出（idle/loading/success/retry）
- idle: 抽出条件（JLPT、キーワード、滞留日数）を表示。
- loading: 「候補者を再抽出中 -> 優先度を計算中」。
- success: フィルタ反映時に優先レーンのみ先に更新。
- retry: 「条件取得に失敗。前回条件で表示中」+ 条件リセット。

## 遷移・状態受け渡し変更点
- 主CTA: `/candidates/[id]` へ `selectedCandidateId`, `followReasonLabel` を渡す。
- 書類不備CTA: `/documents` へ `currentPipelineStatus=document_blocked` を渡す。

## 実装対象ファイル
- `app/candidates/candidates-section.tsx`
- `app/candidates/page.tsx`
- `components/ui/card.tsx`（候補者カード状態バッジ拡張）
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 60秒以内に優先候補3名へ絞れる。
- 1クリックで候補者詳細へ遷移し、対象IDが引き継がれる。
- 優先レーンと通常一覧の役割がUIだけで判別できる。

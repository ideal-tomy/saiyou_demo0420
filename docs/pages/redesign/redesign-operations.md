# redesign `/operations`

## ページの意思決定目的
調整滞留案件を期限内に処理し、面接枠を確定する。

## 現状課題
- KPI表示中心で、最優先案件の処理順が見えづらい。
- 調整待ちリストが行動導線に十分繋がっていない。
- 次ページ（knowledge/documents）への連携意図が弱い。

## 新情報設計（主役/準主役/補助）
- 主役: 期限順オペレーションキュー（候補者、期限、推奨枠、主CTA）。
- 準主役: 健全性KPI（未調整件数、24h確定率、平均調整時間）。
- 補助: 通知再送、履歴、CSV取り込み状態。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 左8カラムキュー、右4カラムKPIと履歴。
- Tablet: キュー先頭 + KPI2列。
- Mobile: キュー縦積み、KPIは折りたたみ。

## 主要コンポーネント差し替え案
- `OpsPriorityQueue`（新規）: 期限と滞留日数で並べる。
- `OpsHealthPanel`（既存KPI再編）: 実務健全性を集約表示。
- `OpsActionDock`（新規）: 確定/再通知/再調整ボタン。

## マイクロコピー置換表
- 面接枠を確定 -> 最優先案件の面接枠を確定する
- 同期完了 -> 調整状況を更新しました
- 通知送信 -> 候補者と面接官へ再通知する

## 状態演出（idle/loading/success/retry）
- idle: 期限超過見込み件数を表示。
- loading: 「候補者・面接官枠を照合中」。
- success: 処理済み行を下段移動 + 健全性スコア更新。
- retry: CSV不整合時に「手動確定モード」を提示。

## 遷移・状態受け渡し変更点
- 評価へ: `/knowledge` へ `opsHealthScore`, `selectedCandidateId` を渡す。
- 書類へ: `/documents` へ `selectedCandidateId`, `documentCheckStatus` を渡す。

## 実装対象ファイル
- `app/operations/page.tsx`
- `lib/industry-page-hints.ts`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 上位1件を45秒以内に確定処理できる。
- 処理後に `opsHealthScore` が更新される。
- キュー先頭が常に期限最短案件になる。

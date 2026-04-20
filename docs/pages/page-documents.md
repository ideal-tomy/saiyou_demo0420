# `/documents` 書類管理仕様

## 1. ページの役割（意思決定）
- 書類不備を即時発見し、停止案件を復帰させるページ。

## 2. 想定ユーザー/利用タイミング
- 朝の確認、OCR投入直後、入管提出前。

## 3. 画面構成（セクション）
- ヘッダー
- OCR実行ボタン群
- KPI 3カード（完了/要確認/要フォロー）
- 不備候補者リスト
- OCR結果シート

## 4. 掲載コンテンツ
- OCRサンプル行（名前、抽出項目）。
- 不備候補者の警告文と詳細リンク。
- パイプライン連動件数。

## 5. 演出仕様
- `loading`: OCR実行時にシート内スケルトンを1秒表示。
- `success`: トースト「抽出完了（デモ）」。
- `retry`: OCR再実行ボタン + 「抽出テキスト編集」導線（演出）。

## 6. 操作と遷移
- `OCR実行` -> シート展開
- `不備候補者を見る` -> `/candidates?view=pipeline`
- 候補者行 -> `/candidates/[id]`

## 7. モックデータ要件
- 不備候補者1名以上、要確認2件以上。
- OCRサンプル出力3行以上。

## 8. デモ訴求トーク
- 「止まっている案件を最短で復帰させるための画面です。」

## 9. 実装メモ
- 対象: `app/documents/page.tsx`
- 関連: `sonner` トースト、`Sheet` コンポーネント

## 10. 業務完了導線
- `OCR実行` 後に不備候補を1件解消（再提出待ち -> 確認中）へ更新したら完了。
- 解消後に `/candidates/[id]` でステータス反映を確認する導線を出す。

## 11. 状態の受け渡し
- 受け取り: `currentPipelineStatus`、`selectedCandidateId`。
- 渡し: `documentCheckStatus`、`ocrExtractSummary` を `/candidates/[id]` と `/home` へ渡す。

## 12. 効果KPI（経営言語）
- `timeSavedMinutesPerDay`: 書類確認作業時間削減。
- `followLeakageRate`: 書類停止案件の放置率低下。
- `proposalCycleHours`: 書類起因の遅延時間短縮。

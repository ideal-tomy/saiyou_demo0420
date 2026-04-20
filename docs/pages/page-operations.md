# `/operations` 実務・収益ハブ仕様

## 1. ページの役割（意思決定）
- 日々のオペレーション優先順位と、収益確認の導線をまとめるハブ。

## 2. 想定ユーザー/利用タイミング
- オペ責任者、営業マネージャーの日次確認。

## 3. 画面構成（セクション）
- ヘッダー
- KPIタイル群
- 直近オペレーションタイムライン
- 書類/収益への遷移カード

## 4. 掲載コンテンツ
- KPI（処理件数、遅延、対応率など）。
- タイムライン（時刻、イベント、バッジ）。
- CSV連携ヒント文。

## 5. 演出仕様
- `loading`: KPIを左上から順次出現。
- `success`: タイムライン更新時に「同期完了」トースト。
- `retry`: CSV読み込み失敗演出と再試行CTA。

## 6. 操作と遷移
- 書類へ -> `/documents`
- 収益へ -> `/revenue`
- 将来導線: 勤怠・請求詳細（拡張枠）

## 7. モックデータ要件
- KPI 4指標以上、タイムライン4行以上。

## 8. デモ訴求トーク
- 「採用後の運用まで同じ画面思想でつながるため、定着が早いです。」

## 9. 実装メモ
- 対象: `app/operations/page.tsx`
- 関連: `lib/industry-page-hints.ts`

## 10. 業務完了導線
- 当日タイムラインの未処理イベントを1件解消し、`同期完了` 表示が出たら完了。
- 収益または書類へ次アクション遷移を明示する。

## 11. 状態の受け渡し
- 受け取り: `reportSubmissionStatus`、`messageRiskLevel`、`documentCheckStatus`。
- 渡し: `opsHealthScore`、`pendingOpsCount` を `/revenue` と `/home` へ渡す。

## 12. 効果KPI（経営言語）
- `timeSavedMinutesPerDay`: オペレーション確認工数削減。
- `followLeakageRate`: 未処理イベント放置率の低下。
- `grossMarginImpactManYen`: 運用遅延の機会損失削減効果。

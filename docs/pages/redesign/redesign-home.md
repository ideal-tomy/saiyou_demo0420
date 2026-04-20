# redesign `/`（home）

## ページの意思決定目的
本日対応すべき候補者を3件に絞り、最初の1件に着手させる。

## 現状課題
- 主要カードが同列で並び、優先行動が埋もれる。
- 「今日の推奨トップ5」が算出意図不明で行動に繋がりにくい。
- KPIと次アクションの因果が見えない。

## 新情報設計（主役/準主役/補助）
- 主役: 本日優先アクション3件（期限、理由、主CTA）。
- 準主役: 停滞件数、書類不備、提案遅延の3指標。
- 補助: 候補者一覧、パイプライン、案件、収益、拡張カード。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 上段フル幅に「本日優先3件」、中段は 8:4 でKPI/補助導線。
- Tablet: 主役1段 + KPI2列 + 補助カード2列。
- Mobile: 主役3件を縦積み。補助カードは折りたたみ。

## 主要コンポーネント差し替え案
- `TodayActionBoard`（新規）: 優先度順カード + 完了/延期アクション。
- `RiskKpiStrip`（既存KPI置換）: 停滞/不備/提案遅延のみ表示。
- `DashboardCandidateCard` を「本日優先フォロー5名」仕様へ変更。

## マイクロコピー置換表
- 今日の推奨トップ5 -> 本日優先フォロー5名
- 詳細へ -> 対応を進める
- 今日やる3件を再抽出 -> 本日優先案件を更新する

## 状態演出（idle/loading/success/retry）
- idle: 「最終更新: HH:mm / 算出条件: 停滞日数×期限」を表示。
- loading: 「優先度を再計算中 -> 期限順に並べ替え中」2段表示。
- success: 完了した行を縮退し次順位が繰り上がる。
- retry: 「更新失敗。前回算出結果を表示中」+ 再試行CTA。

## 遷移・状態受け渡し変更点
- 主CTA: `/candidates/[id]` に遷移し `selectedCandidateId`, `priorityRank` を渡す。
- 副CTA: `/candidates?view=pipeline` へ遷移し `followReasonLabel` を渡す。

## 実装対象ファイル
- `app/page.tsx`
- `components/dashboard-candidate-card.tsx`
- `components/demo-kpi-strip.tsx`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 初見ユーザーが30秒以内に優先1件を開ける。
- 主CTA押下後、候補者詳細で対象者が選択済みになる。
- 文言に「推奨トップ」「詳細へ」が残っていない。

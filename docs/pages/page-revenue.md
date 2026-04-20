# `/revenue` 収益ダッシュボード仕様

## 1. ページの役割（意思決定）
- 紹介ビジネスの収益健全性を短時間で判断するページ。

## 2. 想定ユーザー/利用タイミング
- 経営層報告前、週次レビュー時。

## 3. 画面構成（セクション）
- ヘッダー
- KPI 4枚（売上、CAC、継続率、損益分岐）
- 月次売上チャート
- 回収/返金リスク2カラム
- CAC内訳/損益分岐2カラム

## 4. 掲載コンテンツ
- 前月比、回収率、保証残日数、想定返金額。
- 候補者リンク付きリスクテーブル。
- デモ注釈（ダミー値/一部実データ連動）。

## 5. 演出仕様
- `loading`: チャートはスケルトン + 遅延マウント。
- `success`: KPI数値カウントアップ、前月比の色分岐。
- `retry`: チャート描画失敗時にテーブル表示へフォールバック。

## 6. 操作と遷移
- 返金リスク候補者 -> `/candidates/[id]`
- 候補者一覧誘導 -> `/candidates`

## 7. モックデータ要件
- 月次トレンド6ヶ月以上。
- 返金リスク3件以上（high/medium/low相当）。
- CAC内訳4項目以上。

## 8. デモ訴求トーク
- 「採用の量だけでなく、利益が残るかまで可視化します。」

## 9. 実装メモ
- 対象: `app/revenue/page.tsx`
- 関連: `components/revenue-charts.tsx`, `lib/revenue-demo.ts`

## 10. 業務完了導線
- 返金リスク上位候補を1件確認し、フォロー対象として `/candidates/[id]` に送ったら完了。
- 完了後に「今週の重点案件」メモを残す導線を入れる。

## 11. 状態の受け渡し
- 受け取り: `proposalDraftStatus`、`opsHealthScore`、`selectedCandidateId`。
- 渡し: `riskPriorityCandidateId`、`grossMarginImpactManYen` を `/home` と `/candidates/[id]` へ渡す。

## 12. 効果KPI（経営言語）
- `grossMarginImpactManYen`: 月次粗利インパクト。
- `proposalCycleHours`: 成約までのリードタイム短縮。
- `followLeakageRate`: 高リスク案件の見落とし率低下。

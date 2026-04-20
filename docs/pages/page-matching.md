# `/matching` マッチング一覧仕様

## 1. ページの役割（意思決定）
- 求人別に「次に進める候補者」を決める提案一覧。

## 2. 想定ユーザー/利用タイミング
- 書類選考後、面談設定前の採用判断時。

## 3. 画面構成（セクション）
- ヘッダー
- 企業ごとのAI候補カード（PC）
- 折りたたみカード（モバイル）

## 4. 掲載コンテンツ
- 候補者名、適合率、理由テキスト。
- MUST一致率 / WANT一致率 / GAP（不足要件） / 面談確認質問。
- 根拠3点（要件一致）と不足要件。
- 企業詳細リンク、候補者詳細リンク。

## 5. 演出仕様
- `loading`: 企業単位でカードを遅延表示。
- `success`: 折りたたみ開閉時に矢印回転 + 滑らか展開。
- `retry`: 候補0件時に空状態文言を表示。

## 6. 操作と遷移
- 企業名 -> `/clients/[id]`
- 候補者名 -> `/candidates/[id]`

## 7. モックデータ要件
- 企業ごとにTop3候補を表示。
- 理由文は `MUST一致` `WANT一致` `根拠` `GAP` `確認質問` の構造を含む。

## 8. デモ訴求トーク
- 「提案理由と不足要件まで自動で出るので、採用判断の品質が揃います。」

## 9. 実装メモ
- 対象: `app/matching/page.tsx`, `app/matching/matching-section.tsx`

## 10. 業務完了導線
- 企業ごとにTop3を確認し、1名を `提案確定` にしたら完了。
- `提案確定` 後に `/clients/[id]` の案件進捗へ反映し、面談確認質問まで引き渡す。

## 11. 状態の受け渡し
- 受け取り: `selectedCandidateId`、`recommendedClientIds`、`knowledgeTags`。
- 渡し: `selectedClientId`、`matchScore`、`proposalDraftStatus` を `/clients/[id]` と `/revenue` へ渡す。

## 12. 効果KPI（経営言語）
- `proposalCycleHours`: 提案作成時間の削減。
- `knowledgeReuseRate`: 推薦理由テンプレートの再利用率。
- `grossMarginImpactManYen`: 高適合提案による成約期待値。

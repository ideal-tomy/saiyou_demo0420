# `/candidates` 候補者一覧仕様

## 1. ページの役割（意思決定）
- フォロー対象の発見と、詳細査定への最短遷移。

## 2. 想定ユーザー/利用タイミング
- 朝の架電前、午後の絞り込み提案時。

## 3. 画面構成（セクション）
- ヘッダー
- タブ（一覧 / パイプライン）
- 検索 + JLPTフィルタ
- 候補者カードグリッド
- モバイル用クイックシート

## 4. 掲載コンテンツ
- 一覧タブ: 名前、国籍、JLPT、AIスコア、ステータス。
- パイプラインタブ: ステータス別件数カード。
- クイックシート: 要約、アラート、詳細導線。

## 5. 演出仕様
- `loading`: タブ内スケルトン表示。
- `success`: 検索/フィルタ時にカードを150msで差し替え。
- `retry`: フィルタ失敗時に「条件をリセット」ボタン。

## 6. 操作と遷移
- カードクリック -> `/candidates/[id]`
- パイプライン確認 -> `/candidates?view=pipeline`
- 不備候補者導線 -> `/documents`

## 7. モックデータ要件
- 候補者20名以上、ステータス全種を網羅。
- 検索ヒット0件時の空状態コピーを用意。

## 8. デモ訴求トーク
- 「候補者管理ではなく、今動くべき案件候補の探索画面です。」

## 9. 実装メモ
- 対象: `app/candidates/page.tsx`, `app/candidates/candidates-section.tsx`

## 10. 業務完了導線
- フィルタで対象を3名以内に絞り、1名を詳細ページへ送ったら完了。
- `pipeline` タブで停滞ステータスを確認し、優先フォロー対象を決定する。

## 11. 状態の受け渡し
- 受け取り: `priorityRank`、`followReasonLabel`（ホームから）。
- 渡し: `selectedCandidateId`、`currentPipelineStatus` を `/candidates/[id]` と `/documents` へ渡す。

## 12. 効果KPI（経営言語）
- `timeSavedMinutesPerDay`: 絞り込み工数削減。
- `followLeakageRate`: 停滞候補の見落とし率低下。
- `proposalCycleHours`: 詳細査定着手までの時間短縮。

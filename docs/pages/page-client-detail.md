# `/clients/[id]` 案件詳細仕様

## 1. ページの役割（意思決定）
- この企業に誰を推薦すべきかを確定するページ。

## 2. 想定ユーザー/利用タイミング
- 提案前の最終確認、商談直前。

## 3. 画面構成（セクション）
- 戻る + ヘッダー（企業名、地域、業種）
- 次の操作ショートカット
- 社風・環境カード
- 募集・稼働カード
- AIおすすめ候補リスト

## 4. 掲載コンテンツ
- 代表コメント、現場課題、採用要件、LTV目安。
- AI候補: 候補者名、適合率%、理由文。

## 5. 演出仕様
- `loading`: AI候補行を順次プレースホルダ表示。
- `success`: 適合率を上位から順に強調。
- `retry`: 候補0件時に「条件を広げて再計算（デモ）」ボタン。

## 6. 操作と遷移
- 候補者名クリック -> `/candidates/[id]`
- ショートカット -> `/matching`, `/documents`, `/operations`（業種設定に従う）

## 7. モックデータ要件
- 企業ごとに上位3候補が変わること。
- 適合率60-95の幅を持たせること。

## 8. デモ訴求トーク
- 「企業ごとの勝ち筋をテンプレ化し、誰でも同品質で提案できます。」

## 9. 実装メモ
- 対象: `app/clients/[id]/page.tsx`
- 関連: `getMatchesForClient()` in `lib/demo-data.ts`

## 10. 業務完了導線
- 上位候補を1名確定し、候補者詳細に遷移したら完了。
- `提案送付（デモ）` 操作で次工程に進む見せ方を入れる。

## 11. 状態の受け渡し
- 受け取り: `selectedClientId`、`recommendedClientIds`。
- 渡し: `selectedCandidateId`、`matchScore`、`proposalDraftStatus` を `/candidates/[id]` と `/matching` へ渡す。

## 12. 効果KPI（経営言語）
- `proposalCycleHours`: 案件検討から提案確定までの時間。
- `knowledgeReuseRate`: 案件別勝ち筋の再利用率。
- `grossMarginImpactManYen`: 高適合提案による定着率寄与。

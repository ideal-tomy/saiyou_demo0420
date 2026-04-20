# redesign `/candidates/[id]`

## ページの意思決定目的
候補者の提案可否を即決し、次アクションを確定する。

## 現状課題
- タブ情報量が多く、最終判断に必要な情報が散らばる。
- AI根拠と次アクションの結びつきが弱い。
- 書類不備時の復帰導線が補助的で見落としやすい。

## 新情報設計（主役/準主役/補助）
- 主役: 推薦可否パネル（適合率、主根拠3点、主CTA）。
- 準主役: 不足要件/GAP、面談確認質問、書類状態。
- 補助: 職歴タイムライン、評価履歴、プロフィール詳細。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 左8カラムに判断パネル、右4カラムに次アクション。
- Tablet: 判断パネルを先頭、詳細はアコーディオン。
- Mobile: 判断サマリー固定、詳細はタブ下シート展開。

## 主要コンポーネント差し替え案
- `DecisionPanel`（新規）: 提案可/保留/差戻しを1箇所で実行。
- `AiEvidenceList`（新規）: 根拠を3点固定フォーマットで表示。
- `NextActionDock`（新規）: 面談調整/書類確認/提案確定を並列表示。

## マイクロコピー置換表
- AI分析 -> 提案判断サマリー
- 再解析 -> 査定を再計算する
- 主アクション -> 次に進める操作

## 状態演出（idle/loading/success/retry）
- idle: 最終査定時刻と参照ナレッジ数を表示。
- loading: 「抽出中 -> 査定中 -> 提案先算出中」段階表示。
- success: 適合率カウントアップ + 根拠逐次表示。
- retry: 再計算CTAと「前回結果で進む」代替導線を表示。

## 遷移・状態受け渡し変更点
- 提案確定: `/matching` へ `recommendedClientIds`, `matchScore` を渡す。
- 書類確認: `/documents` へ `selectedCandidateId`, `documentCheckStatus` を渡す。
- 学習反映: `/knowledge` へ `knowledgeNoteId` 候補を渡す。

## 実装対象ファイル
- `app/candidates/[id]/page.tsx`
- `lib/demo-data-selector.ts`
- `components/demo-complete-button.tsx`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 90秒以内に提案可否を確定できる。
- 提案確定時に `/matching` へ候補企業情報が引き継がれる。
- 書類不備がある場合、書類導線が主役領域で必ず視認できる。

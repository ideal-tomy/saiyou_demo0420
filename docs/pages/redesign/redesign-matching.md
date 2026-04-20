# redesign `/matching`

## ページの意思決定目的
企業ごとに提案候補を確定し、提案ドラフト作成へ繋ぐ。

## 現状課題
- カードごとの情報密度差が大きく比較がしづらい。
- MUST/WANT/GAPが読めても確定操作が遠い。
- 候補0件時の次アクションが弱い。

## 新情報設計（主役/準主役/補助）
- 主役: 企業別候補比較テーブル（Top3固定）。
- 準主役: MUST/WANT/GAPと確認質問の要約。
- 補助: 企業詳細リンク、候補者詳細リンク、履歴。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 上段比較テーブル、下段に企業別詳細カード。
- Tablet: 比較テーブル簡易版 + 詳細2列。
- Mobile: 企業アコーディオン + 候補比較シート。

## 主要コンポーネント差し替え案
- `MatchingDecisionTable`（新規）: 企業横断比較を可能にする。
- `GapQuestionPanel`（新規）: 面談確認質問を固定表示。
- `ProposalConfirmBar`（新規）: 提案確定CTAを下部固定。

## マイクロコピー置換表
- マッチング一覧 -> 提案候補比較
- この提案を確定 -> 提案を確定してドラフト作成へ進む
- 候補がありません -> 要件を広げて再抽出する

## 状態演出（idle/loading/success/retry）
- idle: 参照した評価観点数と更新時刻を表示。
- loading: 企業行ごとに候補を段階表示。
- success: 確定行をハイライトしドラフト状態を更新。
- retry: 候補なし時に要件緩和候補を表示。

## 遷移・状態受け渡し変更点
- 確定後: `/clients/[id]` と `/revenue` に `proposalDraftStatus`, `matchScore` を渡す。
- 候補詳細: `/candidates/[id]` へ `selectedCandidateId` を渡す。

## 実装対象ファイル
- `app/matching/page.tsx`
- `app/matching/matching-section.tsx`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 企業ごとに60秒以内で提案候補1名を確定できる。
- 確定操作後に `proposalDraftStatus` が更新される。
- 候補0件時でも次アクションが明示される。

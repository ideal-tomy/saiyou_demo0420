# redesign `/clients/[id]`

## ページの意思決定目的
この企業に提案する候補者を1名以上確定する。

## 現状課題
- 企業情報と候補者候補の優先度が混在して見える。
- 適合理由は読めるが、確定操作までの導線が弱い。
- 次工程（提案書作成/面談設定）への接続が明確でない。

## 新情報設計（主役/準主役/補助）
- 主役: 候補者比較ボード（Top3、適合率、主根拠、確定CTA）。
- 準主役: MUST/WANT/GAP比較、確認質問、提案リスク。
- 補助: 企業概要、現場課題、社風、履歴。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 左7カラム比較ボード、右5カラム企業情報/次工程。
- Tablet: 比較ボード先頭、企業情報を折りたたみ。
- Mobile: Top3カードをスワイプ表示、確定CTAは下部固定。

## 主要コンポーネント差し替え案
- `MatchComparisonBoard`（新規）: Top3同時比較。
- `ProposalActionPanel`（新規）: 提案確定/保留/差戻し。
- `ClientContextCard`（既存情報統合）: 企業要件を1カード化。

## マイクロコピー置換表
- AIおすすめ候補 -> 提案優先候補
- 提案送付（デモ） -> 提案を確定して次へ進む
- 企業詳細 -> 企業要件の確認

## 状態演出（idle/loading/success/retry）
- idle: 直近の提案成功パターン参照数を表示。
- loading: 候補比較行を上位から順次表示。
- success: 確定候補の行を固定表示 + 完了トースト。
- retry: 候補0件時は要件緩和提案と再計算CTA。

## 遷移・状態受け渡し変更点
- 提案確定: `/matching` へ `selectedClientId`, `selectedCandidateId`, `matchScore`。
- 候補者確認: `/candidates/[id]` へ `selectedCandidateId`, `selectedClientId`。
- 次工程: `/operations` へ `proposalDraftStatus=ready` を渡す。

## 実装対象ファイル
- `app/clients/[id]/page.tsx`
- `lib/demo-data.ts`（`getMatchesForClient` まわり）
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 60秒以内にTop3比較から1名を確定できる。
- 確定後、`/matching` に確定情報が反映される。
- 企業文脈（要件/課題）を見ずに確定してしまう操作ミスが減る。

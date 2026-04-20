# redesign `/knowledge`

## ページの意思決定目的
評価品質の不足を特定し、面接判断の再現性を上げる。

## 現状課題
- 評価品質の問題が一覧化されるが優先順位が弱い。
- 面接官差分の情報が行動に繋がりにくい。
- 次導線（matching/messages）が補助扱いになっている。

## 新情報設計（主役/準主役/補助）
- 主役: 品質アラートキュー（未記入、根拠不足、評価ブレ）。
- 準主役: 面接官別傾向（甘辛、提出速度、修正率）。
- 補助: FAQ、履歴、通知連携。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 左7カラム品質キュー、右5カラム面接官傾向。
- Tablet: 品質キュー先頭 + 傾向カード2列。
- Mobile: 品質キュー縦積み、傾向はタブ切替。

## 主要コンポーネント差し替え案
- `QualityAlertQueue`（新規）: 重要度順で修正対象を提示。
- `InterviewerBiasCard`（新規）: 甘辛傾向を可視化。
- `ReviewCompleteBar`（新規）: 確定後の次導線を提示。

## マイクロコピー置換表
- 評価レビューを確定 -> 品質確認を完了して次へ進む
- 学習ログを同期中 -> 評価観点を更新中
- ナレッジ更新完了 -> 評価基準を更新しました

## 状態演出（idle/loading/success/retry）
- idle: 未処理アラート件数と最終更新時刻を表示。
- loading: 「評価項目を照合中 -> ブレを計算中」。
- success: 解消済み行をたたみ、KPIを即時更新。
- retry: 解析失敗時はルールベースFAQへ自動切替。

## 遷移・状態受け渡し変更点
- 次工程: `/matching` へ `adviceRevision`, `knowledgeNoteId` を渡す。
- 通知: `/messages` へ `qualityAlertLevel` を渡す。

## 実装対象ファイル
- `app/knowledge/page.tsx`
- `app/knowledge/knowledge-page-client.tsx`
- `lib/industry-page-hints.ts`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 60秒以内に修正優先1件を確定できる。
- 品質確認完了後、`/matching` 側で改定版助言が参照される。
- 面接官傾向を見ずに確認完了できないUI構成になっている。

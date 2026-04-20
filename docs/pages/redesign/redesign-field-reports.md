# redesign `/field-reports`

## ページの意思決定目的
報告書を生成・共有し、改善アクションを次工程へ渡す。

## 現状課題
- 生成一覧中心で、次の共有行動が目立たない。
- KPIが作業結果と紐づいて見えにくい。
- 共有完了後の遷移が弱い。

## 新情報設計（主役/準主役/補助）
- 主役: 本日共有すべきレポートキュー。
- 準主役: 生成KPI（未送信、改善提案数、直近生成）。
- 補助: 生成履歴、PDF/Slackリンク。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 左共有キュー、右KPI+履歴。
- Tablet: 共有キュー先頭 + KPI2列。
- Mobile: キュー縦積み、履歴は折りたたみ。

## 主要コンポーネント差し替え案
- `ReportShareQueue`（新規）: 期限と共有先を明示。
- `ReportKpiPanel`（既存KPI再編）: 共有遅延を強調。
- `ShareActionButtons`（新規）: PDF/Slackを主CTA化。

## マイクロコピー置換表
- 週次レポートを生成 -> 週次レポートを生成して共有する
- 提出完了 -> 共有完了
- レポート一覧 -> 共有待ちレポート

## 状態演出（idle/loading/success/retry）
- idle: 今日の共有目標件数を表示。
- loading: 生成中に進捗バーと対象期間表示。
- success: 共有済みバッジへ変化 + 完了トースト。
- retry: 共有失敗時に再送と別経路共有を表示。

## 遷移・状態受け渡し変更点
- 共有後: `/operations` に `reportSubmissionStatus=shared` を渡す。
- 不備確認: `/documents` に `reportRelatedCandidateIds` を渡す。

## 実装対象ファイル
- `app/field-reports/page.tsx`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 60秒以内に1件を生成から共有まで完了できる。
- 共有完了後に関連ページへ自然に遷移できる。
- 未共有案件が先頭に表示される。

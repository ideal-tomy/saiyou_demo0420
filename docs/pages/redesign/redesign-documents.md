# redesign `/documents`

## ページの意思決定目的
書類不備を特定し、停止案件を当日中に復帰させる。

## 現状課題
- OCR結果が表示中心で、復帰判断に直結しづらい。
- 不備候補者の優先度が不明瞭。
- 解消後の次導線が弱い。

## 新情報設計（主役/準主役/補助）
- 主役: 不備復帰キュー（候補者、不備種別、期限、主CTA）。
- 準主役: OCR抽出結果 + 差分（手入力修正箇所）。
- 補助: 完了件数、要確認件数、履歴。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 左8カラム不備キュー、右4カラムOCR結果。
- Tablet: 不備キュー先頭、OCRは展開表示。
- Mobile: 不備キュー縦積み + OCRボトムシート。

## 主要コンポーネント差し替え案
- `DocumentRecoveryQueue`（新規）: 期限順に不備対応を表示。
- `OcrDiffPanel`（新規）: 抽出結果と修正差分を表示。
- `RecoveryActionBar`（新規）: 再提出依頼/確認完了CTAを固定。

## マイクロコピー置換表
- OCR実行 -> 書類を再抽出する
- 不備候補者を見る -> 停止案件を優先確認する
- 抽出完了（デモ） -> 抽出完了。確認して復帰を進めてください

## 状態演出（idle/loading/success/retry）
- idle: 当日復帰目標件数を表示。
- loading: 「画像抽出中 -> 項目照合中」。
- success: 復帰完了行を下段へ移動し件数を更新。
- retry: 抽出失敗時に手入力モードへフォールバック。

## 遷移・状態受け渡し変更点
- 復帰確認: `/candidates/[id]` に `documentCheckStatus=ready` を渡す。
- 一覧確認: `/candidates?view=pipeline` に `currentPipelineStatus` を渡す。

## 実装対象ファイル
- `app/documents/page.tsx`
- `components/ui/sheet.tsx`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 不備案件を90秒以内に1件復帰できる。
- 復帰後に候補者詳細で状態更新が確認できる。
- 不備キューの先頭が常に最優先案件になる。

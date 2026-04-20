# redesign `/revenue`

## ページの意思決定目的
粗利とリスクの両面から、今週の重点対応案件を決める。

## 現状課題
- KPIが並列で、何を優先判断すべきか伝わりにくい。
- リスク候補者導線が補助的で行動に繋がりにくい。
- 経営向け説明文脈が弱い。

## 新情報設計（主役/準主役/補助）
- 主役: 粗利インパクト + 返金リスクの重点案件パネル。
- 準主役: 売上推移、CAC内訳、回収率の根拠。
- 補助: 詳細テーブル、候補者リンク、注釈。

## レイアウト仕様（PC/Tablet/Mobile）
- PC: 上段重点案件、下段2カラム（推移/内訳）。
- Tablet: 重点案件1段 + KPI2列。
- Mobile: 重点案件固定、グラフはタブ切替。

## 主要コンポーネント差し替え案
- `RevenueFocusPanel`（新規）: 今週重点案件を固定表示。
- `RiskCandidateTable`（既存拡張）: 優先順位列を追加。
- `CacBreakdownCard`（既存再編）: 意思決定向け要約を追加。

## マイクロコピー置換表
- 収益画面へ -> 粗利とリスクを確認する
- 想定返金額 -> 返金見込みリスク
- 今週の重点案件メモ -> 今週優先で対応する案件

## 状態演出（idle/loading/success/retry）
- idle: 参照期間と最終更新時刻を表示。
- loading: KPI先出し -> グラフ遅延描画。
- success: 前週比を色と矢印で強調。
- retry: グラフ失敗時にテーブルへ自動フォールバック。

## 遷移・状態受け渡し変更点
- 重点候補者: `/candidates/[id]` へ `riskPriorityCandidateId` を渡す。
- ホーム反映: `/` に `grossMarginImpactManYen` を返す。

## 実装対象ファイル
- `app/revenue/page.tsx`
- `components/revenue-charts.tsx`
- `lib/revenue-demo.ts`
- `lib/demo-state/types.ts`

## 受け入れ基準（操作ベース）
- 60秒以内に重点案件を1件選定できる。
- 選定候補が候補者詳細に引き継がれる。
- 経営向けに「粗利影響の理由」を画面のみで説明できる。

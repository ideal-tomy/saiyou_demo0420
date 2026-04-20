# ページ構成書インデックス

このディレクトリは「1ページ = 1md」で、デモ画面の掲載内容と演出仕様を管理するための仕様書です。  
対象は既存ルート13ページです。

## デモ実演順（推奨）
1. `page-home.md`（トップ）
2. `page-candidate-detail.md`（AI爆速プロファイリング）
3. `page-knowledge.md`（AIナレッジ・インキュベーター）
4. `page-candidates.md`
5. `page-matching.md`
6. `page-client-detail.md`
7. `page-documents.md`
8. `page-operations.md`
9. `page-revenue.md`
10. `page-messages.md`
11. `page-clients.md`
12. `page-field-reports.md`
13. `page-more.md`

## ファイル一覧（ルート対応）
- `/` -> `page-home.md`
- `/candidates` -> `page-candidates.md`
- `/candidates/[id]` -> `page-candidate-detail.md`
- `/clients` -> `page-clients.md`
- `/clients/[id]` -> `page-client-detail.md`
- `/documents` -> `page-documents.md`
- `/field-reports` -> `page-field-reports.md`
- `/knowledge` -> `page-knowledge.md`
- `/matching` -> `page-matching.md`
- `/messages` -> `page-messages.md`
- `/more` -> `page-more.md`
- `/operations` -> `page-operations.md`
- `/revenue` -> `page-revenue.md`

## 実装進行ガイド
- フェーズ単位の進め方: `implementation-phased-roadmap.md`
- データ再作成時の置換規約: `data-redaction-dictionary.md`

## 各ページmdの共通テンプレート
以下の章立てを全ページで統一します。

1. ページの役割（意思決定）
2. 想定ユーザー/利用タイミング
3. 画面構成（セクション）
4. 掲載コンテンツ（見出し、文言、指標、空状態）
5. 演出仕様（`idle/loading/success/retry`、アニメーション、トースト）
6. 操作と遷移（CTAと遷移先）
7. モックデータ要件（件数、分岐）
8. デモ訴求トーク（営業向け）
9. 実装メモ（既存ファイル/コンポーネント）
10. 業務完了導線（このページで何を完了扱いにするか）
11. 状態の受け渡し（前ページから受け取り/次ページへ渡す）
12. 効果KPI（経営言語）

## 命名規則
- ファイル名は `page-<route>.md`
- 動的ルートは `page-candidate-detail.md` など意味名で管理
- マイクロコピーは「AIが学習した」「同期完了」などトーンを統一

## 更新ルール
- 画面変更時は必ず対応mdを同時更新
- 文言変更は「掲載コンテンツ」と「デモ訴求トーク」の両方を更新
- 演出変更は「演出仕様」章に明記
- 業務完了導線の変更時は、必ず前後ページの「状態の受け渡し」も更新

## 実装一括着手の優先順
1. 共通ステート定義（`idle/loading/success/retry`、`selectedCandidateId`、`lastActionAt`）
2. コア3ページ（`home` -> `candidate-detail` -> `knowledge`）の受け渡し実装
3. 業務ページ（`candidates`, `matching`, `client-detail`, `documents`）の導線接続
4. 補助ページ（`operations`, `revenue`, `messages`, `field-reports`, `more`）のKPI連動

## 主要KPI辞書（全ページ共通）
- `timeSavedMinutesPerDay`: 1日あたり削減時間（分）
- `followLeakageRate`: フォロー漏れ率（%）
- `proposalCycleHours`: 候補者提案までの平均時間（h）
- `knowledgeReuseRate`: ナレッジ再利用率（%）
- `grossMarginImpactManYen`: 粗利インパクト（万円/月）

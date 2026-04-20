# UIUX再設計（HRMOS参考 / staffing）

このディレクトリは、既存13ページを「高級SaaS水準の意思決定UI」に再設計するための実装用仕様です。  
各mdはページ単位で、課題・新構成・文言置換・遷移・受け入れ基準まで記載しています。

## 0. 共通原則
- `redesign-common-principles.md`

## 1. コア導線
- `/` -> `redesign-home.md`
- `/candidates` -> `redesign-candidates.md`
- `/candidates/[id]` -> `redesign-candidate-detail.md`
- `/clients` -> `redesign-clients.md`
- `/clients/[id]` -> `redesign-client-detail.md`

## 2. 業務導線
- `/matching` -> `redesign-matching.md`
- `/documents` -> `redesign-documents.md`
- `/knowledge` -> `redesign-knowledge.md`
- `/operations` -> `redesign-operations.md`

## 3. 補助導線
- `/revenue` -> `redesign-revenue.md`
- `/messages` -> `redesign-messages.md`
- `/field-reports` -> `redesign-field-reports.md`
- `/more` -> `redesign-more.md`

## 利用手順（実装チーム向け）
1. `redesign-common-principles.md` を先に読み、共通ルールを確認する。
2. 改修対象ページの `redesign-*.md` を読み、主役領域と主CTAを先に実装する。
3. 次にマイクロコピー置換と状態演出（idle/loading/success/retry）を反映する。
4. 最後に受け入れ基準の操作シナリオを検証する。

## 完了確認チェック
- 各ページで「3秒理解・10秒判断・1クリック行動」を満たしている。
- 主要文言が業務行動語へ置換されている。
- 状態受け渡しキーがページ遷移と整合している。

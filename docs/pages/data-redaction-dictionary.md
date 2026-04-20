# デモデータ匿名化辞書

このドキュメントは、実データ風の固有情報を除去し、デモ専用データを一貫した命名で再作成するための置換ルールです。

## 基本方針
- 実在個人・実在企業・実在地名を使わない。
- 画面横断で同じID/名前を使い、状態受け渡しの整合を保つ。
- UI演出に必要な業務文脈は残す（例: 書類不備、提案確定、再試行）。

## 命名ルール
- 候補者名: 仮の日本人名（例: `山田 太郎`, `佐藤 花子`）
- 企業名: 仮の企業名（例: `青葉ソリューションズ`, `みらいキャリアデザイン`）
- 現場/拠点名: `現場K01` / `拠点M01` / `配送エリアL01` 形式
- 担当者名: `担当者01` / `責任者01` 形式

## 連絡先ルール
- メール: `demo+candidate01@example.com` / `demo+client01@example.com`
- 電話: `000-0000-0000`
- 住所: `エリア1 ゾーン1` + `匿名住所-01`

## 書類IDルール
- パスポート/識別番号: `P-010001` 形式
- 顧客/案件番号: `C-010001` 形式

## 置換対象キー（優先）
- `displayName`, `legalNameFull`, `nameKatakana`
- `legalNameJa`, `tradeNameJa`
- `prefectureJa`, `cityJa`, `addressLineJa`, `birthPlace`, `residence.city`
- `contact.email`, `contact.phone`, `contact.contactPersonJa`
- `passportNumber` など識別可能な番号

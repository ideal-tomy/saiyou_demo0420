import {
  defaultIndustryKey,
  getIndustryProfile,
} from "@/lib/industry-profiles";
import type { DashboardExtensionSlotBase } from "@/lib/dashboard-extension-types";

const defaultProfile = getIndustryProfile(defaultIndustryKey);

/**
 * アプリ全体の「テンプレート設定」— 別デモ・別業種に差し替える主入口。
 * 派遣デモの文言・ナビはここを編集するか、別ファイルにコピーして import を差し替える。
 */

/** ナビで使う Lucide アイコン名（components/template-nav-icons.tsx と一致させる） */
export type TemplateNavIconName =
  | "LayoutDashboard"
  | "Users"
  | "Building2"
  | "TrendingUp"
  | "Sparkles"
  | "Home"
  | "MoreHorizontal"
  | "ClipboardList"
  | "FileText"
  | "GitBranch"
  | "Clock"
  | "MessageSquare";

export type TemplateNavItem = {
  href: string;
  label: string;
  icon: TemplateNavIconName;
};

export const appTemplateConfig = {
  branding: {
    productName: defaultProfile.productName,
    /** ヘッダー横バッジ。不要なら null */
    badgeLabel: defaultProfile.badgeLabel as string | null,
    metadata: {
      title: defaultProfile.metadataTitle,
      description: defaultProfile.metadataDescription,
    },
  },

  /** トップダッシュ（/）のコピー */
  dashboard: {
    pageTitle: defaultProfile.dashboardTitle,
    pageSubtitle: defaultProfile.dashboardSubtitle,
    /**
     * メインカード群の列数（PC 想定）。3 = 従来の 3×2＋拡張行、4 = 1行4枚を優先。
     */
    gridColumns: 3 as 3 | 4,
    /**
     * 拡張枠（下段フル幅内で 2×2 / 4 列）。enabled で個別に消せる。
     * 業種別の文言差し替えは `industry-page-hints` の `dashboardExtensionOverrides`。
     */
    extensionSlots: [
      {
        id: "attendanceBilling",
        enabled: true,
        path: "/operations",
        icon: "Clock",
        title: "採用オペレーション",
        subtitle: "面談調整・評価入力・連絡",
        desktopTitle: "採用オペレーション（拡張枠）",
        desktopBody:
          "面談調整、評価入力、候補者連絡など採用実務をまとめて確認できます。",
        desktopCta: "開く",
      },
      {
        id: "knowledgeAi",
        enabled: true,
        path: "/knowledge",
        icon: "Sparkles",
        title: "ナレッジAI",
        subtitle: "評価観点と成功パターン共有",
        desktopTitle: "ナレッジAI（拡張枠）",
        desktopBody:
          "面接評価観点や採用判断の成功パターンをチャットで参照します。",
        desktopCta: "ナレッジへ",
      },
      {
        id: "fieldReports",
        enabled: true,
        path: "/field-reports",
        icon: "Camera",
        title: "活動レポート",
        subtitle: "面談メモ・選考ログ集約",
        desktopTitle: "活動レポート（拡張枠）",
        desktopBody:
          "面談メモ、評価コメント、選考ログを時系列で確認できるレポートハブです。",
        desktopCta: "開く",
      },
      {
        id: "customInsight",
        enabled: true,
        path: "/more",
        icon: "LayoutGrid",
        title: "ショートカット",
        subtitle: "よく使う機能へ即移動",
        desktopTitle: "ショートカット（拡張枠）",
        desktopBody:
          "採用管理でよく使う画面へワンタップで遷移するためのショートカット集です。",
        desktopCta: "その他へ",
      },
    ] satisfies DashboardExtensionSlotBase[],
  },

  /** シェル周り */
  shell: {
    topNav: [
      { href: "/", label: "ダッシュボード", icon: "LayoutDashboard" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/operations", label: "実務・収益", icon: "TrendingUp" },
      { href: "/knowledge", label: "ナレッジ", icon: "Sparkles" },
    ] satisfies TemplateNavItem[],
    bottomNav: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/revenue", label: "収益", icon: "TrendingUp" },
      { href: "/more", label: "その他", icon: "MoreHorizontal" },
    ] satisfies TemplateNavItem[],
    /** メッセージ（ベル）リンク */
    showMessagesLink: true,
    /** 右下 FAB（OCR デモ等） */
    showDemoFab: true,
  },
} as const;

export type AppTemplateConfig = typeof appTemplateConfig;

/** ダッシュボードグリッド用 Tailwindクラス */
export function dashboardGridClass(columns: 3 | 4): string {
  if (columns === 3) {
    return "grid min-w-0 grid-cols-3 items-stretch gap-1.5 md:gap-4 xl:gap-6";
  }
  return "grid min-w-0 grid-cols-3 md:grid-cols-4 items-stretch gap-1.5 md:gap-4 xl:gap-6";
}

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
        title: "日程調整",
        subtitle: "面接枠を確定し、調整停滞を防ぐ",
        desktopTitle: "日程調整（拡張枠）",
        desktopBody:
          "候補者・面接官・求人担当の空き枠を照合し、期限内に面接枠を確定します。未調整案件を一括で潰せる運用ハブです。",
        desktopCta: "日程調整を開く",
      },
      {
        id: "knowledgeAi",
        enabled: true,
        path: "/knowledge",
        icon: "Sparkles",
        title: "面接評価品質管理",
        subtitle: "評価の抜け漏れとブレを減らす",
        desktopTitle: "面接評価品質管理（拡張枠）",
        desktopBody:
          "必須評価項目の未記入、根拠不足、面接官ごとの評価偏差を可視化し、採用判断の再現性を上げます。",
        desktopCta: "評価品質を確認する",
      },
      {
        id: "fieldReports",
        enabled: true,
        path: "/field-reports",
        icon: "Camera",
        title: "レポート自動作成",
        subtitle: "週次・月次の共有レポートを自動生成",
        desktopTitle: "レポート自動作成（拡張枠）",
        desktopBody:
          "選考進捗と評価コメントを要約し、週次・月次のレポートを即時生成します。PDF出力と共有まで1画面で完結します。",
        desktopCta: "レポートを作成する",
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

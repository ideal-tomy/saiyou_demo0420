"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { appTemplateConfig } from "@/lib/app-template-config";
import { DemoFab } from "@/components/demo-fab";
import { templateNavIcons } from "@/components/template-nav-icons";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { useIndustry } from "@/components/industry-context";
import { IndustrySecretModal } from "@/components/industry-secret-modal";
import { withIndustryQuery } from "@/lib/industry-selection";

const SECRET_TAP_WINDOW_MS = 2000;
const SECRET_TAP_COUNT = 5;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { industry } = useIndustry();
  const profile = getIndustryProfile(industry);
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretModalKey, setSecretModalKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  function handleSecretTitleTap() {
    const now = Date.now();
    if (now - lastTapRef.current > SECRET_TAP_WINDOW_MS) {
      tapCountRef.current = 0;
    }
    lastTapRef.current = now;
    tapCountRef.current += 1;
    if (tapCountRef.current >= SECRET_TAP_COUNT) {
      tapCountRef.current = 0;
      setSecretModalKey((k) => k + 1);
      setSecretOpen(true);
    }
  }
  const { branding, shell } = appTemplateConfig;
  const topNavLabelByHref: Record<string, string> = {
    "/": profile.dashboardTitle,
    "/candidates": profile.labels.candidate,
    "/clients": profile.labels.client,
    "/operations": profile.labels.operations,
    "/knowledge": profile.labels.knowledge,
  };
  const bottomNavLabelByHref: Record<string, string> = {
    "/": "Home",
    "/candidates": profile.labels.candidate,
    "/matching": profile.labels.matching,
    "/operations": profile.labels.operations,
    "/more": "その他",
  };
  const desktopNavItems: Array<{
    href: string;
    label: string;
    icon: keyof typeof templateNavIcons;
  }> = [
    { href: "/", label: "採用ダッシュボード", icon: "LayoutDashboard" },
    { href: "/candidates", label: "候補者一覧", icon: "Users" },
    { href: "/clients", label: "求人案件", icon: "Building2" },
    { href: "/matching", label: "AIマッチング", icon: "ClipboardList" },
    { href: "/documents", label: "応募書類", icon: "FileText" },
    { href: "/operations", label: "採用オペレーション", icon: "Clock" },
    { href: "/revenue", label: "採用KPI", icon: "TrendingUp" },
    { href: "/knowledge", label: "ナレッジAI", icon: "Sparkles" },
    { href: "/field-reports", label: "レポート自動作成", icon: "FileText" },
    { href: "/more", label: "目的別ショートカット", icon: "MoreHorizontal" },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSecretTitleTap}
              className="min-w-0 truncate text-left text-sm font-semibold text-primary-alt bg-transparent p-0 border-0 cursor-pointer"
            >
              {profile.productName || branding.productName}
            </button>
            {(profile.badgeLabel ?? branding.badgeLabel) ? (
              <Link
                href={withIndustryQuery("/", industry)}
                className="shrink-0"
              >
                <Badge variant="ai" className="hidden sm:inline-flex">
                  {profile.badgeLabel ?? branding.badgeLabel}
                </Badge>
              </Link>
            ) : null}
          </div>
          <nav className="hidden md:flex flex-1 items-center justify-center gap-1 overflow-x-auto">
            {shell.topNav.map(({ href, label, icon }) => {
              const Icon = templateNavIcons[icon];
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={withIndustryQuery(href, industry)}
                  className={cn(
                    "hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-surface text-primary"
                      : "text-muted hover:text-foreground hover:bg-surface/80"
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-80" />
                  {topNavLabelByHref[href] ?? label}
                </Link>
              );
            })}
          </nav>
          <div className="w-10 shrink-0" aria-hidden />
        </div>
        <div className="h-0.5 w-full bg-primary" aria-hidden />
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-4 px-4 pb-24 pt-6 md:pb-8">
        <aside
          className={cn(
            "hidden md:block",
            sidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className="sticky top-20 rounded-xl border border-border bg-card p-2">
            <div className="mb-2 flex items-center justify-between px-2">
              {!sidebarCollapsed ? (
                <p className="text-xs font-semibold text-muted">メニュー</p>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:bg-surface hover:text-foreground"
                aria-label={sidebarCollapsed ? "メニューを展開" : "メニューを折りたたむ"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="size-4" />
                ) : (
                  <ChevronLeft className="size-4" />
                )}
              </button>
            </div>
            <nav className="space-y-1">
              {desktopNavItems.map(({ href, label, icon }) => {
                const Icon = templateNavIcons[icon];
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={withIndustryQuery(href, industry)}
                    className={cn(
                      "flex items-center rounded-lg px-2.5 py-2 text-sm transition-colors",
                      sidebarCollapsed ? "justify-center" : "gap-2.5",
                      active
                        ? "bg-surface text-primary"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    )}
                    title={sidebarCollapsed ? label : undefined}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!sidebarCollapsed ? <span className="truncate">{label}</span> : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {shell.bottomNav.map(({ href, label, icon }) => {
            const Icon = templateNavIcons[icon];
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={withIndustryQuery(href, industry)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted"
                )}
              >
                <Icon className="size-5" />
                {bottomNavLabelByHref[href] ?? label}
              </Link>
            );
          })}
        </div>
      </nav>

      {shell.showDemoFab ? <DemoFab /> : null}

      <IndustrySecretModal
        key={secretModalKey}
        open={secretOpen}
        onOpenChange={setSecretOpen}
      />
    </div>
  );
}

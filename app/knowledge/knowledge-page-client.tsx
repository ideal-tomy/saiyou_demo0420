"use client";

import Link from "next/link";
import {
  Bot,
  Briefcase,
  Database,
  GaugeCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { useDemoState } from "@/components/demo-state-context";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";

type Props = {
  industry: EnabledIndustryKey;
};

export function KnowledgePageClient({ industry }: Props) {
  const hints = getIndustryPageHints(industry).knowledge;
  const { state } = useDemoState();
  const knowledgeFeed = [
    {
      type: "企業ナレッジ",
      title: "△△社は「主体性あるコミュニケーション」を高評価する傾向",
      detail:
        "面接フィードバック 18件を統合し、技術力よりも連携姿勢の評価ウェイトが高いとAIが学習。",
      source: "学習元: 面接F/B 18件",
    },
    {
      type: "成約パターン",
      title: "「元営業職 -> 事務スタッフ」転換層の成約率が高い",
      detail:
        "直近3ヶ月の成約統計で、スキル一致のみよりキャリア転換適性を重視した提案の歩留まりが向上。",
      source: "学習元: 成約統計 42件",
    },
    {
      type: "失注回避パターン",
      title: "初回提案で「定着支援計画」を添付すると辞退率が低下",
      detail:
        "失注案件の共通要因を分析し、提案時に定着支援の具体策を含めることで改善余地を検出。",
      source: "学習元: 失注ログ 27件",
    },
  ] as const;
  const interviewerTrend = [
    {
      name: "面接官A",
      speciality: "ITエンジニア案件の目利き",
      speed: "提出速度: 平均 7h",
      variance: "評価ブレ: 低",
      assign: "優先アサイン: 技術職の最終面接",
    },
    {
      name: "面接官B",
      speciality: "営業 -> 事務転換候補の見極め",
      speed: "提出速度: 平均 12h",
      variance: "評価ブレ: 中",
      assign: "優先アサイン: キャリアチェンジ層",
    },
    {
      name: "面接官C",
      speciality: "若手ポテンシャル採用の見極め",
      speed: "提出速度: 平均 18h",
      variance: "評価ブレ: 高",
      assign: "優先アサイン: 育成前提ポジション",
    },
  ] as const;
  const qualityKpis = [
    {
      label: "AI構造化ナレッジ数",
      value: "1,248件",
      sub: "前週比 +12件（現場の知恵が蓄積中）",
      icon: Database,
    },
    {
      label: "自社専用AIの目利き力スコア",
      value: "Aクラス",
      sub: "学習反映で継続上昇",
      icon: Bot,
    },
    {
      label: "ナレッジ活用による成約率向上見込み",
      value: "+3.5%",
      sub: "直近90日シミュレーション",
      icon: Target,
    },
  ] as const;

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="knowledge"
        highlightedKpiKeys={["knowledgeReuseRate", "timeSavedMinutesPerDay"]}
      />
      <TemplatePageHeader
        title="ナレッジAI・コックピット（自社専用AI学習センター）"
        description="現場の知恵をAIが継続学習し、会社独自の勝ち筋を資産化するページです。使うほど『稼ぐ脳』が育ちます。"
      />
      <div className="flex flex-wrap items-center gap-2">
        <DemoCompleteButton
          label="本日の学習反映を確定"
          patch={{
            knowledgeNoteId: `knowledge-${state.adviceRevision + 1}`,
            adviceRevision: state.adviceRevision + 1,
            qualityAlertLevel: "low",
            uiStates: { knowledgeSync: "success" },
          }}
          successMessage="学習ログを反映しました。自社AIの目利き力が更新されました。"
        />
        <Button variant="secondary" size="sm" asChild>
          <Link href={withIndustryQuery("/matching", industry)}>AIマッチングで活用する</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {qualityKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <kpi.icon className="size-3.5 text-primary" />
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold tabular-nums">{kpi.value}</p>
              <p className="mt-1 text-xs text-muted">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-5 text-primary" />
            AIナレッジ・フィード（今日の学習ログ）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {knowledgeFeed.map((row) => (
            <div
              key={row.title}
              className="rounded-lg border border-border/80 bg-surface/30 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <Badge variant="ai" className="text-[11px]">
                  {row.type}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{row.detail}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted">{row.source}</p>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={withIndustryQuery("/matching", industry)}>構造化ナレッジへ</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GaugeCircle className="size-5 text-primary" />
            面接官別の目利きサマリ（AIアサイン提案付き）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {interviewerTrend.map((row) => (
            <div
              key={row.name}
              className="grid gap-2 rounded-lg border border-border/80 p-3 text-sm sm:grid-cols-5"
            >
              <p className="font-medium">{row.name}</p>
              <p className="text-muted">得意領域: {row.speciality}</p>
              <p className="text-muted">{row.speed}</p>
              <p className="text-muted">{row.variance}</p>
              <p className="text-primary">{row.assign}</p>
            </div>
          ))}
          <p className="text-xs text-muted">{hints.staticReply}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="size-5 text-primary" />
            関連アクション
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href={withIndustryQuery("/matching", industry)}>AIマッチング</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href={withIndustryQuery("/candidates", industry)}>候補者へ戻る</Link>
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted">
        評価の管理ではなく、現場知見の学習と再利用を継続し、採用の競争優位を積み上げるためのコックピットです。
      </p>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">次にやること</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Link href={withIndustryQuery("/matching", industry)} className="text-primary underline-offset-2 hover:underline">
            提案候補を確定する
          </Link>
          <span className="text-muted">/</span>
          <Link href={withIndustryQuery("/operations", industry)} className="text-primary underline-offset-2 hover:underline">
            面接日程を調整する
          </Link>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}

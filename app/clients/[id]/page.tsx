import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { Separator } from "@/components/ui/separator";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints, quickLinkHref } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const data = getIndustryDemoData(industry);
  const client = data.getClientById(id);
  if (!client) notFound();

  const matches = data.getMatchesForClient(client.id);
  const quickLinks = getIndustryPageHints(industry).clientDetail.quickLinks;

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="client-detail"
        selectedClientId={client.id}
        recommendedClientIds={[client.id]}
        matchScore={matches[0]?.pct ?? null}
        proposalDraftStatus={matches.length > 0 ? "drafting" : "idle"}
      />
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 self-start">
        <Link href={withIndustryQuery("/clients", industry)}>
          <ArrowLeft className="size-4" />
          {profile.labels.client}一覧
        </Link>
      </Button>

      <TemplatePageHeader
        title={client.legalNameJa}
        description={`${client.industryJa} · ${client.prefectureJa}${
          client.cityJa ? ` ${client.cityJa}` : ""
        }`}
      />

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface/50 p-3">
        <span className="w-full text-xs font-medium text-muted">次の操作</span>
        {quickLinks.map((q) => (
          <Button key={q.path} variant="secondary" size="sm" asChild>
            <Link href={quickLinkHref(q.path, industry)}>{q.label}</Link>
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">企業紹介・採用背景</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {client.companySummaryJa ? <p>{client.companySummaryJa}</p> : null}
            {client.hiringContextJa ? (
              <p className="rounded-lg border border-border bg-surface p-3 text-foreground">
                採用背景: {client.hiringContextJa}
              </p>
            ) : null}
            <p>{client.cultureJa}</p>
            <p className="text-muted">{client.workplaceEnvironmentJa}</p>
            {client.teamStructureJa ? (
              <p className="text-xs text-muted">組織体制: {client.teamStructureJa}</p>
            ) : null}
            {client.currentChallengesJa && (
              <p className="text-warning text-xs">{client.currentChallengesJa}</p>
            )}
            {client.representative && (
              <p className="text-xs text-muted">
                代表: {client.representative.nameJa}{" "}
                {client.representative.age ? `（${client.representative.age}歳）` : ""}{" "}
                — {client.representative.noteJa}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">採用条件・募集要件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{client.recruitmentJa}</p>
            {client.offerConditionJa ? (
              <p className="text-xs text-muted">オファー条件: {client.offerConditionJa}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {client.urgencyLabelJa ? <Badge variant="warning">{client.urgencyLabelJa}</Badge> : null}
              {client.hiringPriority ? (
                <Badge variant="secondary">
                  優先度: {client.hiringPriority === "high" ? "高" : client.hiringPriority === "medium" ? "中" : "低"}
                </Badge>
              ) : null}
            </div>
            {client.roleRequirements ? (
              <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">Must（必須）</p>
                  <p className="text-xs text-muted">{client.roleRequirements.must.join(" / ")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Want（歓迎）</p>
                  <p className="text-xs text-muted">{client.roleRequirements.want.join(" / ")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">NG（ミスマッチ）</p>
                  <p className="text-xs text-muted">{client.roleRequirements.ng.join(" / ")}</p>
                </div>
              </div>
            ) : null}
            {client.selectionProcessJa && client.selectionProcessJa.length > 0 ? (
              <div className="rounded-lg border border-border bg-surface p-3">
                <p className="text-xs font-semibold text-foreground">選考フロー</p>
                <ol className="list-decimal space-y-1 pl-4 text-xs text-muted">
                  {client.selectionProcessJa.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : null}
            <Separator />
            <dl className="grid grid-cols-2 gap-2">
              <div>
                <dt className="text-muted text-xs">稼働中</dt>
                <dd className="font-semibold">
                  {client.operations.currentAssignees} 名
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs">欠員枠</dt>
                <dd className="font-semibold text-warning">
                  {client.operations.openSlots} 名
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs">定着率</dt>
                <dd>{client.operations.retentionRatePct}%</dd>
              </div>
              <div>
                <dt className="text-muted text-xs">満足度</dt>
                <dd>{client.operations.satisfactionScore} / 5</dd>
              </div>
            </dl>
            {client.ltMonthlyProfitPerHeadJpy != null && (
              <p className="text-xs text-muted">
                LTV 目安: 1 人あたり月{" "}
                {client.ltMonthlyProfitPerHeadJpy.toLocaleString()} 円（デモ値）
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-5 text-primary" />
            AI おすすめ候補（デモ）
          </CardTitle>
          <Badge variant="ai">タグ照合</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted">
            AI推奨ターゲット: {client.aiTargetProfileJa}
          </p>
          <ul className="space-y-4">
            {matches.map(({ candidate, pct, reason }, i) => (
              <li
                key={candidate.id}
                className="rounded-lg border border-border bg-surface/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={withIndustryQuery(`/candidates/${candidate.id}`, industry)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {i + 1}. {candidate.displayName}
                  </Link>
                  <span className="text-lg font-bold tabular-nums text-primary">
                    {pct}%
                  </span>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  {reason.split(" / ").map((block) => (
                    <p key={block} className="text-muted">
                      {block}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}

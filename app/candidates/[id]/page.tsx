import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoKpiStrip } from "@/components/demo-kpi-strip";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CandidateDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const cd = getIndustryPageHints(industry).candidateDetail;
  const data = getIndustryDemoData(industry);
  const c = data.getCandidateById(id);
  if (!c) notFound();

  const assigned = c.plannedAssignment
    ? data.getClientById(c.plannedAssignment.clientId)
    : undefined;
  const match = assigned
    ? data.scoreCandidateForClient(c, assigned)
    : null;

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="candidate-detail"
        selectedCandidateId={c.id}
        selectedClientId={assigned?.id ?? null}
        recommendedClientIds={assigned ? [assigned.id] : []}
        matchScore={match?.pct ?? null}
        proposalDraftStatus={match ? "ready" : "idle"}
        highlightedKpiKeys={["proposalCycleHours"]}
      />
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 self-start">
        <Link href={withIndustryQuery("/candidates", industry)}>
          <ArrowLeft className="size-4" />
          {profile.labels.candidate}一覧
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src={c.photoUrl}
          alt=""
          width={120}
          height={120}
          className="rounded-2xl border border-border bg-surface"
          unoptimized
        />
        <div className="flex-1 space-y-2">
          <TemplatePageHeader title={c.displayName} />
          <p className="text-sm text-muted">
            {c.legalNameFull} / {c.nameKatakana}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">
              <Sparkles className="mr-1 size-3" />
              AI {c.aiScore}
            </Badge>
            <Badge>{c.pipelineStatusLabelJa}</Badge>
            {cd.showJlptBadge ? (
              <Badge variant="secondary">{c.jlpt}</Badge>
            ) : null}
          </div>
          {c.aiScoreRationale && (
            <p className="text-sm text-muted">{c.aiScoreRationale}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <DemoCompleteButton
              label="AI査定を確定"
              patch={{
                selectedCandidateId: c.id,
                selectedClientId: assigned?.id ?? null,
                matchScore: match?.pct ?? null,
                recommendedClientIds: assigned ? [assigned.id] : [],
                proposalDraftStatus: "ready",
                uiStates: { candidateProfiling: "success" },
              }}
              successMessage="査定結果を次導線へ引き渡しました"
            />
            <DemoKpiStrip keys={["proposalCycleHours"]} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">選考履歴</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { step: "応募受付", at: "2026-04-10", status: "完了" },
              { step: "書類選考", at: "2026-04-12", status: "完了" },
              { step: "一次面談", at: "2026-04-15", status: "完了" },
              { step: "最終面談", at: "2026-04-18", status: "調整中" },
            ].map((row) => (
              <div
                key={row.step}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <p className="font-medium">{row.step}</p>
                  <p className="text-xs text-muted">{row.at}</p>
                </div>
                <Badge variant={row.status === "調整中" ? "warning" : "success"}>
                  {row.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">次アクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="font-medium text-foreground">候補者側</p>
              <p className="text-muted">面談可能日時を本日中に3枠回答する。</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="font-medium text-foreground">企業側</p>
              <p className="text-muted">一次面談評価を入力し、最終面談候補日を確定する。</p>
            </div>
            <DemoCompleteButton
              label="次アクションを確定"
              patch={{
                selectedCandidateId: c.id,
                selectedClientId: assigned?.id ?? null,
                followReasonLabel: "面談調整中",
                proposalDraftStatus: "drafting",
              }}
              successMessage="選考ToDoを更新しました"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1">
          <TabsTrigger value="basic">{cd.tabBasic}</TabsTrigger>
          <TabsTrigger value="docs">{cd.tabDocs}</TabsTrigger>
          <TabsTrigger value="history">{cd.tabHistory}</TabsTrigger>
          <TabsTrigger value="ai">{cd.tabAi}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.profileCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <dl className="grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-muted">年齢 / 性別</dt>
                  <dd>
                    {c.age} / {c.gender === "male" ? "男性" : "女性"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">国籍</dt>
                  <dd>{c.nationality}</dd>
                </div>
                <div>
                  <dt className="text-muted">居住地</dt>
                  <dd>
                    {c.residence.country} {c.residence.city}{" "}
                    {c.residence.note ? `（${c.residence.note}）` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">連絡先</dt>
                  <dd className="break-all">{c.contact.email}</dd>
                </div>
              </dl>
              <div>
                <p className="text-muted">背景</p>
                <p>{c.backgroundSummary}</p>
              </div>
              <div>
                <p className="text-muted">学歴・職歴</p>
                <p>{c.educationWorkHistory}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.skillTags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.docsCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted">{cd.docsPrimaryLabel}</span>{" "}
                {c.passportNumber} / {cd.docsExpiryLabel} {c.passportExpiry}
              </p>
              <p>
                <span className="text-muted">{cd.docsSecondaryLabel}</span>{" "}
                {c.coeStatusJa}
              </p>
              {c.documentAlertJa && (
                <p className="font-medium text-danger">{c.documentAlertJa}</p>
              )}
              <p className="text-xs text-muted">{cd.docsOcrNote}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.historyCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              <p>{cd.historyPlaceholder}</p>
              {c.plannedAssignment && assigned && (
                <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-foreground">
                  <p className="font-medium">{assigned.tradeNameJa}</p>
                  <p>{c.plannedAssignment.jobTitleJa}</p>
                  <p className="text-muted">
                    {cd.plannedAssignmentSalaryLabel}{" "}
                    {c.plannedAssignment.monthlySalaryJpy.toLocaleString()} 円（想定）
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.aiCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {assigned && match ? (
                <>
                  <p>
                    <span className="font-semibold">{assigned.tradeNameJa}</span>{" "}
                    との適合目安:{" "}
                    <span className="text-lg font-bold text-primary">
                      {match.pct}%
                    </span>
                  </p>
                  <p className="leading-relaxed text-muted">{match.reason}</p>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted">{cd.aiEmptyAssignment}</p>
                  <Button variant="link" className="h-auto p-0 text-primary" asChild>
                    <Link href={withIndustryQuery("/matching", industry)}>
                      {cd.aiMatchingLinkLabel}
                    </Link>
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted">{cd.aiFooterNote}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TemplatePageStack>
  );
}

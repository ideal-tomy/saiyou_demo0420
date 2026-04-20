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
  const screeningTimeline =
    c.screeningTimeline ??
    [
      { step: "応募受付", at: "2026-04-10", status: "done" as const },
      { step: "書類選考", at: "2026-04-12", status: "done" as const },
      { step: "一次面談", at: "2026-04-15", status: "done" as const },
      { step: "最終面談", at: "2026-04-18", status: "in_progress" as const },
    ];
  const actionLabel = c.actionPlan?.primaryAction ?? "次アクションを確定";
  const tabPanelFrameClass =
    "h-[65vh] min-h-[520px] max-h-[760px] overflow-y-auto rounded-xl border border-border bg-background";
  const tabPanelCardClass = "h-full border-0 shadow-none";

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
              label="AI評価を確定"
              patch={{
                selectedCandidateId: c.id,
                selectedClientId: assigned?.id ?? null,
                matchScore: match?.pct ?? null,
                recommendedClientIds: assigned ? [assigned.id] : [],
                proposalDraftStatus: "ready",
                uiStates: { candidateProfiling: "success" },
              }}
              successMessage="AI評価を次導線へ引き渡しました"
            />
            <DemoKpiStrip keys={["proposalCycleHours"]} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">提案判断サマリー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted">
              本日の判断: {assigned ? "提案先候補あり" : "提案先要再計算"}
            </p>
            {match ? (
              <div className="rounded-lg border border-border bg-surface p-3">
                <p className="text-xs text-muted">適合率</p>
                <p className="text-2xl font-bold text-primary">{match.pct}%</p>
                <p className="mt-1 text-xs text-muted">{match.reason}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-surface p-3 text-xs text-muted">
                提案候補が未設定です。マッチング画面で再抽出してください。
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" asChild>
                <Link href={withIndustryQuery("/matching", industry)}>提案候補を再抽出</Link>
              </Button>
              {c.documentAlertJa ? (
                <Button size="sm" variant="secondary" asChild>
                  <Link href={withIndustryQuery("/documents", industry)}>書類を確認</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">選考履歴</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {screeningTimeline.map((row) => (
              <div
                key={row.step}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <p className="font-medium">{row.step}</p>
                  <p className="text-xs text-muted">{row.at}</p>
                </div>
                <Badge
                  variant={
                    row.status === "in_progress"
                      ? "warning"
                      : row.status === "done"
                        ? "success"
                        : "secondary"
                  }
                >
                  {row.status === "done"
                    ? "完了"
                    : row.status === "in_progress"
                      ? "進行中"
                      : "未着手"}
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
              <p className="text-muted">
                {c.actionPlan?.candidateTask ?? "面談可能日時を本日中に3枠回答する。"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="font-medium text-foreground">企業側</p>
              <p className="text-muted">
                {c.actionPlan?.companyTask ??
                  "一次面談評価を入力し、最終面談候補日を確定する。"}
              </p>
            </div>
            <DemoCompleteButton
              label={actionLabel}
              patch={{
                selectedCandidateId: c.id,
                selectedClientId: assigned?.id ?? null,
                followReasonLabel: c.actionPlan?.primaryAction ?? "面談調整中",
                proposalDraftStatus: "drafting",
              }}
              successMessage="次アクションを更新しました"
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

        <TabsContent value="basic" className="animate-in fade-in-0 duration-200">
          <div className={tabPanelFrameClass}>
          <Card className={tabPanelCardClass}>
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
                {c.personaHeadline ? (
                  <>
                    <p className="text-muted">人物像</p>
                    <p>{c.personaHeadline}</p>
                  </>
                ) : null}
              </div>
              <div>
                <p className="text-muted">背景</p>
                <p>{c.backgroundSummary}</p>
              </div>
              <div>
                <p className="text-muted">学歴・職歴</p>
                <p>{c.educationWorkHistory}</p>
              </div>
              {c.achievementHighlights && c.achievementHighlights.length > 0 ? (
                <div>
                  <p className="text-muted">定量実績</p>
                  <ul className="list-disc space-y-1 pl-4">
                    {c.achievementHighlights.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {c.preferredConditions ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-muted">希望年収</p>
                    <p>{c.preferredConditions.desiredAnnualIncomeManYen ?? "-"} 万円</p>
                  </div>
                  <div>
                    <p className="text-muted">働き方</p>
                    <p>{c.preferredConditions.preferredWorkStyle ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted">希望勤務地</p>
                    <p>{c.preferredConditions.preferredLocationJa ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted">入社可能時期</p>
                    <p>{c.preferredConditions.availableFrom ?? "-"}</p>
                  </div>
                </div>
              ) : null}
              {c.riskNotes && c.riskNotes.length > 0 ? (
                <div>
                  <p className="text-muted">懸念点</p>
                  <ul className="list-disc space-y-1 pl-4">
                    {c.riskNotes.map((risk) => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-1">
                {c.skillTags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="animate-in fade-in-0 duration-200">
          <div className={tabPanelFrameClass}>
          <Card className={tabPanelCardClass}>
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
          </div>
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in-0 duration-200">
          <div className={tabPanelFrameClass}>
          <Card className={tabPanelCardClass}>
            <CardHeader>
              <CardTitle className="text-base">{cd.historyCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              <p>{cd.historyPlaceholder}</p>
              {c.careerTimeline && c.careerTimeline.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {c.careerTimeline.map((timeline) => (
                    <div
                      key={`${timeline.period}-${timeline.companyJa}`}
                      className="rounded-lg border border-border bg-surface p-3 text-foreground"
                    >
                      <p className="text-xs text-muted">{timeline.period}</p>
                      <p className="font-medium">
                        {timeline.companyJa} / {timeline.roleJa}
                      </p>
                      <p className="text-sm text-muted">{timeline.summaryJa}</p>
                    </div>
                  ))}
                </div>
              ) : null}
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
          </div>
        </TabsContent>

        <TabsContent value="ai" className="animate-in fade-in-0 duration-200">
          <div className={tabPanelFrameClass}>
          <Card className={tabPanelCardClass}>
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
                  {c.recommendationCommentJa ? (
                    <div className="rounded-lg border border-border bg-surface p-3">
                      <p className="text-xs text-muted">推薦コメント</p>
                      <p className="text-sm">{c.recommendationCommentJa}</p>
                    </div>
                  ) : null}
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
          </div>
        </TabsContent>
      </Tabs>
    </TemplatePageStack>
  );
}

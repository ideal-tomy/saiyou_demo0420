"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { useDemoState } from "@/components/demo-state-context";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { useIndustry } from "@/components/industry-context";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";
import { nextUiAsyncState } from "@/lib/ui-feedback";

export default function DocumentsPage() {
  const { state, patchState } = useDemoState();
  const { industry } = useIndustry();
  const profile = getIndustryProfile(industry);
  const hints = getIndustryPageHints(industry);
  const docHints = hints.documents;
  const data = getIndustryDemoData(industry);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const alerts = data.countDocumentAlerts();

  function runScan() {
    const nextState = nextUiAsyncState(
      state.uiStates.documentScan ?? "idle",
      "start",
    );
    patchState({
      documentCheckStatus: "checking",
      uiStates: {
        ...state.uiStates,
        documentScan: nextState,
      },
      lastActionAt: new Date().toISOString(),
    });
    setOpen(true);
    setLoading(true);
    setScanFailed(false);
    toast.info("書類を解析中です（デモ）");
    setTimeout(() => {
      const shouldFail = state.documentCheckStatus !== "needs_retry" && alerts > 0;
      if (shouldFail) {
        patchState({
          documentCheckStatus: "needs_retry",
          uiStates: {
            ...state.uiStates,
            documentScan: nextUiAsyncState(state.uiStates.documentScan ?? "loading", "fail"),
          },
          lastActionAt: new Date().toISOString(),
        });
        setLoading(false);
        setScanFailed(true);
        toast.error("同期で競合が発生しました。再試行してください。");
        return;
      }
      const resolvedState = nextUiAsyncState(
        state.uiStates.documentScan ?? "loading",
        "resolve",
      );
      patchState({
        documentCheckStatus: "ok",
        uiStates: {
          ...state.uiStates,
          documentScan: resolvedState,
        },
        lastActionAt: new Date().toISOString(),
      });
      setLoading(false);
      setScanFailed(false);
      toast.success("書類チェックが同期完了しました");
    }, 1000);
  }

  const blocked = data.candidates.filter(
    (c) => c.pipelineStatus === "document_blocked"
  );
  const actionRows = blocked.map((candidate) => ({
    candidate,
    reason: candidate.documentAlertJa ?? "選考停滞のため再確認が必要",
    dueDate: candidate.actionPlan?.dueDate ?? "2026-04-25",
    nextAction: candidate.actionPlan?.primaryAction ?? "不備解消を依頼",
  }));

  return (
    <TemplatePageStack>
      <DemoStateBridge
        page="documents"
        documentCheckStatus={state.documentCheckStatus}
        highlightedKpiKeys={["followLeakageRate", "proposalCycleHours"]}
      />
      <TemplatePageHeader
        title={`${profile.labels.documents}管理`}
        description={docHints.pageSubtitle}
      />

      <div className="flex flex-wrap gap-3">
        <DemoCompleteButton
          label="不備復帰を完了"
          patch={{
            documentCheckStatus: "ok",
            uiStates: {
              ...state.uiStates,
              documentScan: "success",
            },
            followReasonLabel: "書類不備を復帰",
          }}
          successMessage="不備解消から進行復帰を反映しました（次工程は候補者確認）"
          className="min-h-11"
        />
        <Button onClick={runScan} className="gap-2 min-h-11" variant="secondary">
          <ScanLine className="size-4" />
          {docHints.ocrButtonLabel}
        </Button>
        <Button variant="secondary" asChild className="min-h-11">
          <Link href={withIndustryQuery("/candidates?view=pipeline", industry)}>
            {profile.statusLabels.document_blocked}の{profile.labels.candidate}を見る
          </Link>
        </Button>
        {scanFailed ? (
          <Button variant="secondary" onClick={runScan} className="min-h-11">
            再試行して同期を復帰
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">生成完了</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{docHints.kpiComplete}</p>
            <Badge variant="success" className="mt-2">
              デモ値
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">要確認</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{docHints.kpiReview}</p>
            <Badge variant="warning" className="mt-2">
              レビュー待ち
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">要フォロー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-danger">{alerts}</p>
            <Badge variant="danger" className="mt-2">
              パイプライン連動
            </Badge>
          </CardContent>
        </Card>
      </div>

      {actionRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5" />
              不備復帰キュー（期限順）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionRows.map((row) => (
              <div
                key={row.candidate.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{row.candidate.displayName}</p>
                  <p className="text-xs text-danger">{row.reason}</p>
                </div>
                <div className="text-xs text-muted">
                  期限: {row.dueDate}
                </div>
                <div className="text-xs text-muted">
                  次アクション: {row.nextAction}
                </div>
                <Button size="sm" variant="secondary" asChild className="min-h-9">
                  <Link href={withIndustryQuery(`/candidates/${row.candidate.id}`, industry)}>
                    対応する
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Sheet
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setLoading(false);
        }}
      >
        <SheetContent title={docHints.sheetTitle}>
          {loading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{docHints.ocrSampleName}</p>
              <ul className="list-inside list-disc text-muted">
                {docHints.ocrSampleLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">次にやること</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Link href={withIndustryQuery("/candidates?view=pipeline", industry)} className="text-primary underline-offset-2 hover:underline">
            停滞候補の進行状況を確認する
          </Link>
          <span className="text-muted">/</span>
          <Link href={withIndustryQuery("/matching", industry)} className="text-primary underline-offset-2 hover:underline">
            提案候補を再確認する
          </Link>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoStateBridge } from "@/components/demo-state-bridge";
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

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const clients = getIndustryDemoData(industry).clients;
  const priorityClients = [...clients]
    .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
    .slice(0, 5);
  const emphasis = getIndustryPageHints(industry).clients.listCardEmphasis;

  return (
    <TemplatePageStack>
      <DemoStateBridge page="clients" highlightedKpiKeys={["proposalCycleHours"]} />
      <TemplatePageHeader
        title={profile.labels.client}
        description={`${clients.length} 件のデモデータ。本日優先の提案先から順に確定できます。`}
      />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">優先提案先（本日）</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="py-2 pr-3">企業</th>
                <th className="py-2 pr-3">募集人数</th>
                <th className="py-2 pr-3">緊急度</th>
                <th className="py-2 pr-3">紹介実績</th>
                <th className="py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {priorityClients.map((c) => (
                <tr key={c.id} className="border-b border-border/70">
                  <td className="py-2.5 pr-3 font-medium">{c.tradeNameJa}</td>
                  <td className="py-2.5 pr-3">{c.operations.openSlots}</td>
                  <td className="py-2.5 pr-3">{c.urgencyLabelJa ?? "通常"}</td>
                  <td className="py-2.5 pr-3">{c.operations.currentAssignees}</td>
                  <td className="py-2.5">
                    <Link
                      href={withIndustryQuery(`/clients/${c.id}`, industry)}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      提案候補を確認
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((c) => (
          <Link
            key={c.id}
            href={withIndustryQuery(`/clients/${c.id}`, industry)}
            className="group block"
          >
            <Card className="h-full min-h-[120px] transition-all group-hover:border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2 text-base">
                  <Building2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="leading-snug">{c.tradeNameJa}</span>
                </CardTitle>
                {emphasis !== "region" ? (
                  <p className="text-xs text-muted">
                    {c.industryJa} / {c.prefectureJa}
                    {c.cityJa ? ` ${c.cityJa}` : ""}
                  </p>
                ) : null}
              </CardHeader>
              {emphasis === "region" ? (
                <div className="px-6 pb-2">
                  <p className="text-sm font-medium text-foreground">
                    {c.prefectureJa}
                    {c.cityJa ? ` ${c.cityJa}` : ""}
                  </p>
                  <p className="text-xs text-muted">{c.industryJa}</p>
                </div>
              ) : null}
              <CardContent className="space-y-3 text-sm">
                {c.roleRequirements?.must?.length ? (
                  <p className="line-clamp-1 text-xs font-medium text-foreground">
                    Must: {c.roleRequirements.must.join(" / ")}
                  </p>
                ) : null}
                {emphasis === "openSlots" ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning">募集人数 {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        紹介実績 {c.operations.currentAssignees}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted">
                      {c.hiringContextJa ?? c.cultureJa}
                    </p>
                  </>
                ) : emphasis === "culture" ? (
                  <>
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                      {c.companySummaryJa ?? c.cultureJa}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning">募集人数 {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        紹介実績 {c.operations.currentAssignees}
                      </Badge>
                      {c.urgencyLabelJa ? <Badge>{c.urgencyLabelJa}</Badge> : null}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2 text-sm text-muted">
                      {c.hiringContextJa ?? c.cultureJa}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning">募集人数 {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        紹介実績 {c.operations.currentAssignees}
                      </Badge>
                      {c.urgencyLabelJa ? <Badge>{c.urgencyLabelJa}</Badge> : null}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TemplatePageStack>
  );
}

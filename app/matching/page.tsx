import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { getIndustryFromSearchParams, withIndustryQuery } from "@/lib/industry-selection";
import { MatchingSection } from "./matching-section";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);

  return (
    <TemplatePageStack>
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 self-start">
        <Link href={withIndustryQuery("/candidates", industry)}>
          <ArrowLeft className="size-4" />
          候補者一覧へ戻る
        </Link>
      </Button>
      <TemplatePageHeader
        title={profile.labels.matching}
        description={`${profile.matchingDescription} 提案候補を比較し、1名を確定して次工程へ進めます。`}
      />
      <MatchingSection industry={industry} />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">次にやること</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Link href={withIndustryQuery("/clients", industry)} className="text-primary underline-offset-2 hover:underline">
            提案先企業を確認する
          </Link>
          <span className="text-muted">/</span>
          <Link href={withIndustryQuery("/documents", industry)} className="text-primary underline-offset-2 hover:underline">
            書類不備の有無を確認する
          </Link>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}

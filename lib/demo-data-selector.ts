import type { Candidate, CandidatePipelineStatus, ClientCompany } from "@data/types";
import * as staffing from "@/lib/demo-data.staffing";
import * as realEstate from "@/lib/demo-data.real-estate";
import * as professional from "@/lib/demo-data.professional";
import * as construction from "@/lib/demo-data.construction";
import * as medical from "@/lib/demo-data.medical";
import * as sales from "@/lib/demo-data.sales";
import * as logistics from "@/lib/demo-data.logistics";
import * as education from "@/lib/demo-data.education";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";

type DemoDataModule = {
  clients: ClientCompany[];
  candidates: Candidate[];
  getClientById: (id: string) => ClientCompany | undefined;
  getCandidateById: (id: string) => Candidate | undefined;
  getPipelineCounts: () => Record<CandidatePipelineStatus, number>;
  countN3OrAbove: () => number;
  getTopCandidatesByAiScore: (limit: number) => Candidate[];
  countDocumentAlerts: () => number;
  totalOpenSlots: () => number;
  monthlyRevenueTrend: () => { month: string; amountManYen: number }[];
  scoreCandidateForClient: (
    candidate: Candidate,
    client: ClientCompany
  ) => { pct: number; reason: string };
  getMatchesForClient: (
    clientId: string
  ) => { candidate: Candidate; pct: number; reason: string }[];
};

const demoCandidateNames = [
  { displayName: "山田 太郎", legalNameFull: "山田 太郎", nameKatakana: "ヤマダ タロウ" },
  { displayName: "佐藤 花子", legalNameFull: "佐藤 花子", nameKatakana: "サトウ ハナコ" },
  { displayName: "鈴木 健太", legalNameFull: "鈴木 健太", nameKatakana: "スズキ ケンタ" },
  { displayName: "高橋 美咲", legalNameFull: "高橋 美咲", nameKatakana: "タカハシ ミサキ" },
  { displayName: "伊藤 翔", legalNameFull: "伊藤 翔", nameKatakana: "イトウ ショウ" },
  { displayName: "渡辺 彩", legalNameFull: "渡辺 彩", nameKatakana: "ワタナベ アヤ" },
  { displayName: "中村 大輔", legalNameFull: "中村 大輔", nameKatakana: "ナカムラ ダイスケ" },
  { displayName: "小林 真央", legalNameFull: "小林 真央", nameKatakana: "コバヤシ マオ" },
  { displayName: "加藤 直人", legalNameFull: "加藤 直人", nameKatakana: "カトウ ナオト" },
  { displayName: "吉田 里奈", legalNameFull: "吉田 里奈", nameKatakana: "ヨシダ リナ" },
  { displayName: "山本 悠斗", legalNameFull: "山本 悠斗", nameKatakana: "ヤマモト ユウト" },
  { displayName: "松本 優奈", legalNameFull: "松本 優奈", nameKatakana: "マツモト ユウナ" },
  { displayName: "井上 拓海", legalNameFull: "井上 拓海", nameKatakana: "イノウエ タクミ" },
  { displayName: "木村 千尋", legalNameFull: "木村 千尋", nameKatakana: "キムラ チヒロ" },
  { displayName: "林 恒一", legalNameFull: "林 恒一", nameKatakana: "ハヤシ コウイチ" },
  { displayName: "清水 葵", legalNameFull: "清水 葵", nameKatakana: "シミズ アオイ" },
  { displayName: "阿部 颯太", legalNameFull: "阿部 颯太", nameKatakana: "アベ ソウタ" },
  { displayName: "森 優衣", legalNameFull: "森 優衣", nameKatakana: "モリ ユイ" },
  { displayName: "池田 亮", legalNameFull: "池田 亮", nameKatakana: "イケダ リョウ" },
  { displayName: "橋本 結衣", legalNameFull: "橋本 結衣", nameKatakana: "ハシモト ユイ" },
];

const demoClientNames = [
  { legalNameJa: "株式会社青葉ソリューションズ", tradeNameJa: "青葉ソリューションズ" },
  { legalNameJa: "株式会社みらいキャリアデザイン", tradeNameJa: "みらいキャリアデザイン" },
  { legalNameJa: "株式会社東都ビジネスサポート", tradeNameJa: "東都ビジネスサポート" },
  { legalNameJa: "株式会社ネクストリンクパートナーズ", tradeNameJa: "ネクストリンクパートナーズ" },
  { legalNameJa: "株式会社フロントラインワークス", tradeNameJa: "フロントラインワークス" },
  { legalNameJa: "株式会社シティブリッジ", tradeNameJa: "シティブリッジ" },
  { legalNameJa: "株式会社ライトハウスコンサルティング", tradeNameJa: "ライトハウスコンサルティング" },
  { legalNameJa: "株式会社グロースフィールド", tradeNameJa: "グロースフィールド" },
];

function normalizeText(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[、。,.()\[\]/\-]/g, " ")
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

function buildJobBasedReason(candidate: Candidate, client: ClientCompany): {
  pct: number;
  reason: string;
  evidence: string[];
  gaps: string[];
} {
  const mustTokens = client.roleRequirements?.must ?? client.matchingHintTags.slice(0, 3);
  const wantTokens =
    client.roleRequirements?.want ?? [...client.matchingHintTags.slice(3), ...normalizeText(client.recruitmentJa)].slice(0, 3);
  const requirementTokens = [...mustTokens, ...wantTokens];
  const candidateTokens = [
    ...candidate.skillTags,
    ...normalizeText(candidate.backgroundSummary),
    ...normalizeText(candidate.educationWorkHistory),
  ];

  const requirementSet = new Set(requirementTokens);
  const candidateSet = new Set(candidateTokens);
  const matched = [...requirementSet].filter((token) => candidateSet.has(token));
  const unmatched = [...requirementSet].filter((token) => !candidateSet.has(token));

  const base = Math.round(candidate.aiScore * 0.55);
  const coverage = requirementSet.size > 0 ? Math.round((matched.length / requirementSet.size) * 45) : 20;
  const pct = Math.max(35, Math.min(98, base + coverage));
  const evidence = matched.slice(0, 3).map((token) => `要件「${token}」と職務経歴が一致`);
  const fallbackEvidence = [
    `候補者の強みタグ(${candidate.skillTags.slice(0, 2).join(" / ")})が求人軸に近い`,
    "面談前評価で要件理解の深さが確認しやすい",
    "初期オンボーディング期間を短縮できる見込み",
  ];
  const gaps = unmatched.slice(0, 2).map((token) => `要件「${token}」は面談で補足確認が必要`);
  const mustMatched = mustTokens.filter((token) => candidateSet.has(token));
  const wantMatched = wantTokens.filter((token) => candidateSet.has(token));
  const firstGap = gaps[0] ?? "不足要件は見当たりません";
  const followupQuestion =
    gaps.length > 0
      ? `面談確認: ${unmatched[0]}の実務経験を具体案件で確認`
      : "面談確認: 直近成果の再現条件を確認";

  return {
    pct,
    reason: [
      `MUST一致:${mustMatched.length}/${mustTokens.length}`,
      `WANT一致:${wantMatched.length}/${wantTokens.length}`,
      `根拠:${(evidence.length > 0 ? evidence : fallbackEvidence).join(" | ")}`,
      `GAP:${firstGap}`,
      `確認質問:${followupQuestion}`,
    ].join(" / "),
    evidence: evidence.length > 0 ? evidence : fallbackEvidence,
    gaps: gaps.length > 0 ? gaps : ["不足要件は見当たりません"],
  };
}

function createAnonymizedClient(client: ClientCompany, index: number): ClientCompany {
  const no = String(index + 1).padStart(2, "0");
  const demoName = demoClientNames[index % demoClientNames.length];
  return {
    ...client,
    legalNameJa: demoName.legalNameJa,
    tradeNameJa: demoName.tradeNameJa,
    prefectureJa: `エリア${(index % 4) + 1}`,
    cityJa: `ゾーン${(index % 8) + 1}`,
    addressLineJa: `匿名住所-${no}`,
    contact: {
      ...client.contact,
      email: `demo+client${no}@example.com`,
      phone: "000-0000-0000",
      contactPersonJa: `担当者${no}`,
    },
    representative: client.representative
      ? {
          ...client.representative,
          nameJa: `責任者${no}`,
        }
      : undefined,
  };
}

function createAnonymizedCandidate(
  candidate: Candidate,
  index: number,
  clientIdMap: Map<string, string>,
): Candidate {
  const no = String(index + 1).padStart(2, "0");
  const demoName = demoCandidateNames[index % demoCandidateNames.length];
  const plannedClientId = candidate.plannedAssignment?.clientId;
  const mappedClientId = plannedClientId
    ? clientIdMap.get(plannedClientId) ?? plannedClientId
    : undefined;
  return {
    ...candidate,
    displayName: demoName.displayName,
    legalNameFull: demoName.legalNameFull,
    nameKatakana: demoName.nameKatakana,
    birthPlace: `出身エリア${(index % 6) + 1}`,
    residence: {
      ...candidate.residence,
      city: `居住ゾーン${(index % 10) + 1}`,
      note: candidate.residence.note ? `補足情報-${no}` : candidate.residence.note,
    },
    passportNumber: `P-${no}0001`,
    contact: {
      ...candidate.contact,
      email: `demo+candidate${no}@example.com`,
      phone: "000-0000-0000",
    },
    plannedAssignment: candidate.plannedAssignment && mappedClientId
      ? {
          ...candidate.plannedAssignment,
          clientId: mappedClientId,
        }
      : undefined,
  };
}

function anonymizeModule(module: DemoDataModule): DemoDataModule {
  const anonymizedClients = module.clients.map(createAnonymizedClient);
  const clientIdMap = new Map<string, string>();
  module.clients.forEach((client, index) => {
    clientIdMap.set(client.id, anonymizedClients[index].id);
  });
  const anonymizedCandidates = module.candidates.map((candidate, index) =>
    createAnonymizedCandidate(candidate, index, clientIdMap),
  );
  const clientById = new Map(anonymizedClients.map((client) => [client.id, client]));
  const candidateById = new Map(anonymizedCandidates.map((candidate) => [candidate.id, candidate]));

  function sanitizeReason(reason: string): string {
    return reason
      .replace(/[A-Z]\s?社/g, "採用先企業")
      .replace(/株式会社[^\s、。]+/g, "採用先企業");
  }

  return {
    ...module,
    clients: anonymizedClients,
    candidates: anonymizedCandidates,
    getClientById: (id: string) => clientById.get(id),
    getCandidateById: (id: string) => candidateById.get(id),
    getTopCandidatesByAiScore: (limit: number) =>
      [...anonymizedCandidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit),
    scoreCandidateForClient: (candidate: Candidate, client: ClientCompany) => {
      const targetCandidate = candidateById.get(candidate.id) ?? candidate;
      const targetClient = clientById.get(client.id) ?? client;
      const scored = buildJobBasedReason(targetCandidate, targetClient);
      return { pct: scored.pct, reason: sanitizeReason(scored.reason) };
    },
    getMatchesForClient: (clientId: string) => {
      const targetClient = clientById.get(clientId);
      if (!targetClient) return [];
      return anonymizedCandidates
        .map((candidate) => {
          const scored = buildJobBasedReason(candidate, targetClient);
          return {
            candidate,
            pct: scored.pct,
            reason: sanitizeReason(scored.reason),
          };
        })
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 5);
    },
  };
}

const registry: Record<EnabledIndustryKey, DemoDataModule> = {
  staffing: anonymizeModule(staffing),
  "real-estate": anonymizeModule(realEstate),
  professional: anonymizeModule(professional),
  construction: anonymizeModule(construction),
  medical: anonymizeModule(medical),
  sales: anonymizeModule(sales),
  logistics: anonymizeModule(logistics),
  education: anonymizeModule(education),
};

export function getIndustryDemoData(industry: EnabledIndustryKey): DemoDataModule {
  return registry[industry];
}

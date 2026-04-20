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
  const requirementTokens = [
    ...client.matchingHintTags,
    ...normalizeText(client.recruitmentJa),
  ];
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

  return {
    pct,
    reason: [...(evidence.length > 0 ? evidence : fallbackEvidence), ...gaps].join(" / "),
    evidence: evidence.length > 0 ? evidence : fallbackEvidence,
    gaps: gaps.length > 0 ? gaps : ["不足要件は見当たりません"],
  };
}

function createAnonymizedClient(client: ClientCompany, index: number): ClientCompany {
  const no = String(index + 1).padStart(2, "0");
  return {
    ...client,
    legalNameJa: `取引先法人${no}`,
    tradeNameJa: `取引先C${no}`,
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
  const mappedClientId = candidate.plannedAssignment
    ? clientIdMap.get(candidate.plannedAssignment.clientId) ?? candidate.plannedAssignment.clientId
    : undefined;
  return {
    ...candidate,
    displayName: `候補者A${no}`,
    legalNameFull: `候補者A${no} 正式名`,
    nameKatakana: `コウホシャA${no}`,
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
    plannedAssignment: candidate.plannedAssignment
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
      .replace(/[A-Z]\s?社/g, "取引先")
      .replace(/株式会社[^\s、。]+/g, "取引先法人")
      .replace(/[一-龠々〆ヵヶぁ-んァ-ヴー]+\s?[一-龠々〆ヵヶぁ-んァ-ヴー]+/g, "担当候補");
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

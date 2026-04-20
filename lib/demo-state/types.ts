import type { KpiKey } from "@/lib/kpi-dictionary";

export type UiAsyncState = "idle" | "loading" | "success" | "retry";

export type DemoPageKey =
  | "home"
  | "candidate-detail"
  | "knowledge"
  | "candidates"
  | "matching"
  | "clients"
  | "client-detail"
  | "documents"
  | "operations"
  | "revenue"
  | "messages"
  | "field-reports"
  | "more";

export type DocumentCheckStatus = "unchecked" | "checking" | "ok" | "needs_retry";
export type ProposalDraftStatus = "idle" | "drafting" | "ready" | "retry";
export type ReportSubmissionStatus = "idle" | "generated" | "shared" | "retry";
export type MessageRiskLevel = "normal" | "warning" | "danger";

export type DemoSharedState = {
  selectedCandidateId: string | null;
  selectedClientId: string | null;
  riskPriorityCandidateId: string | null;
  followReasonLabel: string | null;
  priorityRank: number | null;
  shortcutIntent: string | null;
  recommendedClientIds: string[];
  matchScore: number | null;
  knowledgeNoteId: string | null;
  adviceRevision: number;
  qualityAlertLevel: "low" | "medium" | "high" | null;
  messageRiskLevel: MessageRiskLevel;
  messageResolvedAt: string | null;
  documentCheckStatus: DocumentCheckStatus;
  reportSubmissionStatus: ReportSubmissionStatus;
  proposalDraftStatus: ProposalDraftStatus;
  opsHealthScore: number | null;
  currentPage: DemoPageKey | null;
  lastActionAt: string | null;
  uiStates: Partial<Record<string, UiAsyncState>>;
  highlightedKpiKeys: KpiKey[];
};

export const initialDemoSharedState: DemoSharedState = {
  selectedCandidateId: null,
  selectedClientId: null,
  riskPriorityCandidateId: null,
  followReasonLabel: null,
  priorityRank: null,
  shortcutIntent: null,
  recommendedClientIds: [],
  matchScore: null,
  knowledgeNoteId: null,
  adviceRevision: 0,
  qualityAlertLevel: null,
  messageRiskLevel: "normal",
  messageResolvedAt: null,
  documentCheckStatus: "unchecked",
  reportSubmissionStatus: "idle",
  proposalDraftStatus: "idle",
  opsHealthScore: null,
  currentPage: null,
  lastActionAt: null,
  uiStates: {},
  highlightedKpiKeys: [],
};

export type DemoSharedStatePatch = Partial<DemoSharedState>;

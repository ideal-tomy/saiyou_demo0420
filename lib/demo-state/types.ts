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

export type DemoSharedState = {
  selectedCandidateId: string | null;
  selectedClientId: string | null;
  followReasonLabel: string | null;
  recommendedClientIds: string[];
  matchScore: number | null;
  knowledgeNoteId: string | null;
  adviceRevision: number;
  documentCheckStatus: DocumentCheckStatus;
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
  followReasonLabel: null,
  recommendedClientIds: [],
  matchScore: null,
  knowledgeNoteId: null,
  adviceRevision: 0,
  documentCheckStatus: "unchecked",
  proposalDraftStatus: "idle",
  opsHealthScore: null,
  currentPage: null,
  lastActionAt: null,
  uiStates: {},
  highlightedKpiKeys: [],
};

export type DemoSharedStatePatch = Partial<DemoSharedState>;

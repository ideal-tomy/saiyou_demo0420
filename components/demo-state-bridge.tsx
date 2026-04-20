"use client";

import { useEffect, useMemo, useRef } from "react";
import type { DemoPageKey, DemoSharedStatePatch } from "@/lib/demo-state/types";
import type { KpiKey } from "@/lib/kpi-dictionary";
import { useDemoState } from "@/components/demo-state-context";

type Props = {
  page: DemoPageKey;
  selectedCandidateId?: string | null;
  selectedClientId?: string | null;
  followReasonLabel?: string | null;
  recommendedClientIds?: string[];
  matchScore?: number | null;
  knowledgeNoteId?: string | null;
  adviceRevision?: number;
  documentCheckStatus?: "unchecked" | "checking" | "ok" | "needs_retry";
  proposalDraftStatus?: "idle" | "drafting" | "ready" | "retry";
  opsHealthScore?: number | null;
  highlightedKpiKeys?: KpiKey[];
};

export function DemoStateBridge({
  page,
  selectedCandidateId,
  selectedClientId,
  followReasonLabel,
  recommendedClientIds,
  matchScore,
  knowledgeNoteId,
  adviceRevision,
  documentCheckStatus,
  proposalDraftStatus,
  opsHealthScore,
  highlightedKpiKeys,
}: Props) {
  const { patchState } = useDemoState();
  const lastPayload = useRef<string>("");

  const payload = useMemo<DemoSharedStatePatch>(
    () => ({
      currentPage: page,
      selectedCandidateId,
      selectedClientId,
      followReasonLabel,
      recommendedClientIds,
      matchScore,
      knowledgeNoteId,
      adviceRevision,
      documentCheckStatus,
      proposalDraftStatus,
      opsHealthScore,
      highlightedKpiKeys,
    }),
    [
      adviceRevision,
      documentCheckStatus,
      followReasonLabel,
      highlightedKpiKeys,
      knowledgeNoteId,
      matchScore,
      opsHealthScore,
      page,
      proposalDraftStatus,
      recommendedClientIds,
      selectedCandidateId,
      selectedClientId,
    ],
  );

  useEffect(() => {
    const stablePayload = JSON.stringify(payload);
    if (stablePayload === lastPayload.current) return;
    lastPayload.current = stablePayload;
    patchState(payload);
  }, [patchState, payload]);

  return null;
}

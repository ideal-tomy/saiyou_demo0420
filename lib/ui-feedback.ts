import type { UiAsyncState } from "@/lib/demo-state/types";

export function nextUiAsyncState(
  _current: UiAsyncState,
  event: "start" | "resolve" | "fail" | "reset",
): UiAsyncState {
  if (event === "reset") return "idle";
  if (event === "start") return "loading";
  if (event === "resolve") return "success";
  return "retry";
}

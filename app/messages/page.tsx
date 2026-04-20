"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoCompleteButton } from "@/components/demo-complete-button";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { useDemoState } from "@/components/demo-state-context";
import type { DemoMessage } from "@/lib/demo-messages";
import { demoMessages } from "@/lib/demo-messages";
import { cn } from "@/lib/utils";

function sentimentBadge(s?: DemoMessage["sentiment"]) {
  if (s === "danger") return <Badge variant="danger">要注意</Badge>;
  if (s === "warning") return <Badge variant="warning">確認</Badge>;
  return null;
}

export default function MessagesPage() {
  const { patchState } = useDemoState();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const rankedMessages = [...demoMessages].sort((a, b) => {
    const rank = (value?: DemoMessage["sentiment"]) =>
      value === "danger" ? 0 : value === "warning" ? 1 : 2;
    return rank(a.sentiment) - rank(b.sentiment);
  });

  function toggle(id: string) {
    const target = demoMessages.find((message) => message.id === id);
    patchState({
      uiStates: { translation: "success" },
      messageRiskLevel:
        target?.sentiment === "danger"
          ? "danger"
          : target?.sentiment === "warning"
            ? "warning"
            : "normal",
      lastActionAt: new Date().toISOString(),
    });
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  return (
    <div className="space-y-6">
      <DemoStateBridge page="messages" highlightedKpiKeys={["timeSavedMinutesPerDay"]} />
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">
          メッセージ優先対応
        </h1>
        <p className="mt-1 text-sm text-muted">
          危険/警告メッセージを優先順で表示します。訳文と要約を見て対応方針を確定してください。
        </p>
      </div>
      <DemoCompleteButton
        label="優先対応を完了"
        patch={{
          followReasonLabel: "メッセージ優先対応",
          messageResolvedAt: new Date().toISOString(),
          uiStates: { translation: "success" },
        }}
        successMessage="翻訳と優先度判定の完了を記録しました"
      />

      <ul className="space-y-3">
        {rankedMessages.map((m) => (
          <li key={m.id}>
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {m.category ?? "メッセージ"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {sentimentBadge(m.sentiment)}
                  {m.unread && <Badge variant="primary">未読</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-surface p-3 text-sm">
                    <p className="text-xs text-muted">原文</p>
                    <p className="mt-1 font-medium">{m.si}</p>
                    {m.readingJa && (
                      <p className="mt-1 text-xs text-muted">
                        読み: {m.readingJa}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-border p-3 text-sm">
                    <p className="text-xs text-muted">日本語</p>
                    <p className={cn("mt-1", !revealed[m.id] && "blur-sm select-none")}>
                      {m.ja}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={() => toggle(m.id)}
                >
                  <Languages className="size-4" />
                  {revealed[m.id] ? "訳を隠す" : "訳文を表示して対応を判断する"}
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import {
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { DemoStateBridge } from "@/components/demo-state-bridge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  { href: "/messages?fromMore=true&shortcutIntent=urgent-message", label: "優先対応", icon: MessageSquare, desc: "危険/警告メッセージを先に処理" },
  { href: "/matching?fromMore=true&shortcutIntent=proposal", label: "提案確定", icon: ClipboardList, desc: "案件別の候補比較と確定" },
  { href: "/documents?fromMore=true&shortcutIntent=document-recovery", label: "書類復帰", icon: FileText, desc: "停止案件の不備対応" },
  { href: "/knowledge?fromMore=true&shortcutIntent=quality-review", label: "品質確認", icon: Sparkles, desc: "評価ブレと未記入を確認" },
  { href: "/operations?fromMore=true&shortcutIntent=schedule", label: "日程調整", icon: Settings, desc: "期限順で調整案件を処理" },
] as const;

export default function MorePage() {
  return (
    <div className="space-y-6">
      <DemoStateBridge page="more" />
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">目的別ショートカット</h1>
        <p className="mt-1 text-sm text-muted">現場の本日対応を2タップ以内で開始</p>
      </div>
      <div className="grid gap-3">
        {links.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <Card className="transition-all hover:border-primary/30">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <Icon className="size-5 text-primary" />
                <div>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-primary">すぐに対応を始める →</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

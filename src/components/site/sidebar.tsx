"use client";
import {
  Home,
  Search,
  UserCog,
  FolderKanban,
  Users,
  GitBranch,
  BellRing,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import type { AppView } from "@/lib/types";

const ITEMS: {
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}[] = [
  { id: "home", label: "Home", icon: Home, desc: "Platform overview" },
  {
    id: "ai-search",
    label: "AI Legal Search",
    icon: Search,
    desc: "Public AI Q&A engine",
  },
  {
    id: "client-portal",
    label: "Client Portal",
    icon: UserCog,
    desc: "Secure sign-in",
  },
  {
    id: "case-management",
    label: "Cases",
    icon: FolderKanban,
    desc: "Open & closed files",
  },
  {
    id: "parties",
    label: "Parties & Evidence",
    icon: Users,
    desc: "Parties & documents",
  },
  {
    id: "case-tracking",
    label: "Case Tracking",
    icon: GitBranch,
    desc: "Milestones & timeline",
  },
  {
    id: "reminders",
    label: "Reminders",
    icon: BellRing,
    desc: "Hearings & deadlines",
  },
  { id: "billing", label: "Billing", icon: Wallet, desc: "Invoices & fees" },
];

export function SidebarNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const session = useAppStore((s) => s.session);

  return (
    <nav className="flex flex-col gap-1 py-2" aria-label="Primary">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const locked =
          !session &&
          ["case-management", "parties", "case-tracking", "reminders", "billing"].includes(
            item.id,
          );
        const isActive = activeView === item.id;
        return (
          <Button
            key={item.id}
            variant={isActive ? "secondary" : "ghost"}
            className={`group h-auto justify-start gap-3 px-3 py-2.5 text-left ${
              isActive ? "bg-primary/10 font-medium text-primary" : ""
            }`}
            onClick={() => {
              setActiveView(item.id);
              onNavigate?.();
            }}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={`h-4 w-4 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="flex flex-1 flex-col">
              <span className="text-sm leading-tight">{item.label}</span>
              <span className="text-[11px] text-muted-foreground">
                {item.desc}
              </span>
            </span>
            {locked ? (
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/60" />
            ) : null}
          </Button>
        );
      })}
    </nav>
  );
}

export function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar ${className}`}
    >
      <div className="px-3 py-4">
        <SidebarNav />
      </div>
      <div className="mt-auto px-4 py-4">
        <div className="rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Pro tip</p>
          <p className="mt-1">
            Counsel, judges and litigants each sign in with a Client Code{" "}
            <em>and</em> a Case Code. The two together bind your session to a
            single file.
          </p>
        </div>
      </div>
    </aside>
  );
}

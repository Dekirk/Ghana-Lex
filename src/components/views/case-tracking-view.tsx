"use client";
import {
  GitBranch,
  Lock,
  Loader2,
  CheckCircle2,
  Circle,
  CircleDot,
  ArrowRight,
  Gavel,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useCases, formatDateTime, formatDate } from "@/lib/hooks";
import type { MilestoneStatus } from "@/lib/types";
import { LockedNotice } from "./case-management-view";

const MILESTONE_LABELS: Record<MilestoneStatus, string> = {
  DONE: "Completed",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
  SKIPPED: "Skipped",
};

const MILESTONE_TONES: Record<MilestoneStatus, string> = {
  DONE: "bg-emerald-100 text-emerald-900 border-emerald-300",
  IN_PROGRESS: "bg-sky-100 text-sky-900 border-sky-300",
  PENDING: "bg-stone-100 text-stone-700 border-stone-300",
  SKIPPED: "bg-rose-100 text-rose-900 border-rose-300",
};

const MILESTONE_ICONS: Record<MilestoneStatus, React.ComponentType<{ className?: string }>> = {
  DONE: CheckCircle2,
  IN_PROGRESS: CircleDot,
  PENDING: Circle,
  SKIPPED: Circle,
};

export function CaseTrackingView() {
  const session = useAppStore((s) => s.session);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const activeCaseCode = useAppStore((s) => s.activeCaseCode);
  const { cases, loading } = useCases();

  if (!session) return <LockedNotice onSignIn={() => setActiveView("client-portal")} />;

  const activeCase = activeCaseCode
    ? cases.find((c) => c.caseCode === activeCaseCode)
    : cases[0];

  if (loading || !activeCase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      </div>
    );
  }

  const milestones = activeCase.milestones ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Tracking</h1>
          <p className="mt-1 text-muted-foreground">
            <code className="text-xs">{activeCase.caseCode}</code> — {activeCase.title}
          </p>
        </div>
        <Select
          value={activeCase.caseCode}
          onValueChange={(v) => useAppStore.setState({ activeCaseCode: v })}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cases.map((c) => (
              <SelectItem key={c.id} value={c.caseCode}>
                {c.caseCode} — {c.title.slice(0, 36)}…
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Filed" value={formatDate(activeCase.filedAt)} icon={Calendar} />
        <SummaryTile
          label="Next hearing"
          value={activeCase.nextHearingAt ? formatDateTime(activeCase.nextHearingAt) : "—"}
          icon={Gavel}
        />
        <SummaryTile
          label="Milestones"
          value={`${milestones.filter((m) => m.status === "DONE").length}/${milestones.length} done`}
          icon={CheckCircle2}
        />
        <SummaryTile label="Status" value={activeCase.status} icon={ArrowRight} />
      </div>

      {/* Timeline */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="h-4 w-4 text-primary" /> Matter timeline
          </CardTitle>
          <CardDescription>
            From filing to judgment — milestones, hearings and procedural events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No milestones recorded for this matter yet.
            </p>
          ) : (
            <ol className="relative ml-3 border-l-2 border-border pl-6">
              {milestones.map((m, idx) => {
                const Icon = MILESTONE_ICONS[m.status];
                const isLast = idx === milestones.length - 1;
                return (
                  <li
                    key={m.id}
                    className={`relative pb-6 ${isLast ? "pb-2" : ""}`}
                  >
                    <span
                      className={`absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-background ${
                        m.status === "DONE"
                          ? "text-emerald-600"
                          : m.status === "IN_PROGRESS"
                            ? "text-sky-600"
                            : "text-stone-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="rounded-md border border-border bg-background p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm font-medium">{m.title}</p>
                        <Badge className={`${MILESTONE_TONES[m.status]} border`}>
                          {MILESTONE_LABELS[m.status]}
                        </Badge>
                      </div>
                      {m.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {m.description}
                        </p>
                      )}
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {formatDate(m.eventDate)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Reminders tied to this case */}
      {activeCase.reminders && activeCase.reminders.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Pending procedural deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              {activeCase.reminders.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {formatDateTime(r.dueAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {r.priority}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

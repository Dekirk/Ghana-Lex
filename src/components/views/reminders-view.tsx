"use client";
import {
  BellRing,
  Lock,
  Loader2,
  Circle,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useCases, formatDateTime, relativeDays } from "@/lib/hooks";
import { PRIORITY_TONES, type ReminderPriority } from "@/lib/types";
import { LockedNotice } from "./case-management-view";
import { toast } from "sonner";

export function RemindersView() {
  const session = useAppStore((s) => s.session);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const { cases, loading, refresh } = useCases();

  if (!session) return <LockedNotice onSignIn={() => setActiveView("client-portal")} />;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Flatten reminders across all the user's cases.
  const allReminders = cases.flatMap((c) =>
    (c.reminders ?? []).map((r) => ({
      ...r,
      caseCode: c.caseCode,
      caseTitle: c.title,
    })),
  );

  const upcoming = allReminders
    .filter((r) => !r.isDone)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const completed = allReminders
    .filter((r) => r.isDone)
    .sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime());

  const overdue = upcoming.filter(
    (r) => new Date(r.dueAt).getTime() < Date.now(),
  );
  const next24h = upcoming.filter((r) => {
    const t = new Date(r.dueAt).getTime();
    return t >= Date.now() && t <= Date.now() + 24 * 60 * 60 * 1000;
  });

  async function toggle(id: string, done: boolean, caseCode: string) {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: done }),
      });
      if (!res.ok) throw new Error("Could not update.");
      toast.success(done ? "Marked complete." : "Reopened.", {
        description: `${caseCode}`,
      });
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Update failed.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reminders &amp; Deadlines</h1>
        <p className="mt-1 text-muted-foreground">
          Hearings, limitation periods, filing deadlines and procedural tasks
          across all your case files.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryTile
          label="Overdue"
          value={overdue.length}
          icon={AlertTriangle}
          tone="text-rose-600"
        />
        <SummaryTile
          label="Due in 24h"
          value={next24h.length}
          icon={Calendar}
          tone="text-amber-600"
        />
        <SummaryTile
          label="Outstanding"
          value={upcoming.length}
          icon={BellRing}
          tone="text-primary"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BellRing className="h-4 w-4 text-primary" /> Upcoming reminders
          </CardTitle>
          <CardDescription>
            Sorted by due date — closest first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have no outstanding reminders. You&apos;re up to date.
            </p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {upcoming.map((r) => (
                <ReminderRow
                  key={r.id}
                  title={r.title}
                  dueAt={r.dueAt}
                  priority={r.priority}
                  caseCode={r.caseCode}
                  caseTitle={r.caseTitle}
                  isDone={false}
                  onToggle={() => toggle(r.id, true, r.caseCode)}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {completed.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Completed
            </CardTitle>
            <CardDescription>
              Recently completed reminders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              {completed.slice(0, 8).map((r) => (
                <ReminderRow
                  key={r.id}
                  title={r.title}
                  dueAt={r.dueAt}
                  priority={r.priority}
                  caseCode={r.caseCode}
                  caseTitle={r.caseTitle}
                  isDone
                  onToggle={() => toggle(r.id, false, r.caseCode)}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReminderRow({
  title,
  dueAt,
  priority,
  caseCode,
  caseTitle,
  isDone,
  onToggle,
}: {
  title: string;
  dueAt: string;
  priority: ReminderPriority;
  caseCode: string;
  caseTitle: string;
  isDone: boolean;
  onToggle: () => void;
}) {
  const t = new Date(dueAt).getTime();
  const isOverdue = !isDone && t < Date.now();
  const rel = relativeDays(dueAt);
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <button
          onClick={onToggle}
          aria-label={isDone ? "Reopen reminder" : "Mark complete"}
          className="mt-0.5"
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-medium ${
              isDone ? "text-muted-foreground line-through" : ""
            }`}
          >
            {title}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            <code>{caseCode}</code> · {caseTitle}
          </p>
          <p
            className={`mt-0.5 text-[11px] ${
              isOverdue ? "font-semibold text-rose-600" : "text-muted-foreground"
            }`}
          >
            {formatDateTime(dueAt)} {rel && `· ${rel}`}
            {isOverdue ? " · OVERDUE" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={`${PRIORITY_TONES[priority]} border`} variant="outline">
          {priority}
        </Badge>
      </div>
    </li>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <Icon className={`h-4 w-4 ${tone}`} />
        </div>
        <p className={`mt-1 text-3xl font-bold ${tone}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

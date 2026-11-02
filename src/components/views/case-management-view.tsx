"use client";
import { useMemo, useState } from "react";
import {
  FolderKanban,
  Search,
  Lock,
  Loader2,
  ChevronRight,
  Calendar,
  Gavel,
  Building2,
  ArrowLeft,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { useCases, formatGHS, formatDate, formatDateTime } from "@/lib/hooks";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_TONES,
  CASE_TYPE_LABELS,
  SUIT_LABELS,
  PARTY_LABELS,
  type CaseLite,
} from "@/lib/types";

export function CaseManagementView() {
  const session = useAppStore((s) => s.session);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const { cases, loading, error } = useCases();
  const [query, setQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const selected = useMemo(
    () => cases.find((c) => c.caseCode === selectedCode) ?? null,
    [cases, selectedCode],
  );

  if (!session) {
    return <LockedNotice onSignIn={() => setActiveView("client-portal")} />;
  }

  if (selected) {
    return (
      <CaseDetail
        caseItem={selected}
        onBack={() => setSelectedCode(null)}
      />
    );
  }

  const filtered = cases.filter(
    (c) =>
      !query ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.caseCode.toLowerCase().includes(query.toLowerCase()) ||
      c.court.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Management</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome, <strong>{session.fullName}</strong>. You have{" "}
            <strong>{cases.length}</strong> case file{cases.length === 1 ? "" : "s"} on your docket.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by case code, title or court…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total files"
          value={cases.length.toString()}
          icon={FolderKanban}
        />
        <StatCard
          label="Active"
          value={cases.filter((c) => c.status === "ACTIVE").length.toString()}
          icon={Gavel}
        />
        <StatCard
          label="Filed (pending)"
          value={cases.filter((c) => c.status === "FILED").length.toString()}
          icon={FileText}
        />
        <StatCard
          label="On appeal"
          value={cases.filter((c) => c.status === "APPEALED").length.toString()}
          icon={Building2}
        />
      </div>

      {loading && (
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading case files…
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-10 text-center text-muted-foreground">
            No case files match your search.
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <CaseCard
            key={c.id}
            caseItem={c}
            onOpen={() => setSelectedCode(c.caseCode)}
          />
        ))}
      </div>
    </div>
  );
}

function CaseCard({
  caseItem,
  onOpen,
}: {
  caseItem: CaseLite;
  onOpen: () => void;
}) {
  return (
    <Card
      className="group cursor-pointer transition hover:border-primary/40 hover:shadow-md"
      onClick={onOpen}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <code className="text-[11px] font-mono text-muted-foreground">
            {caseItem.caseCode}
          </code>
          <Badge className={`${CASE_STATUS_TONES[caseItem.status]} border`}>
            {CASE_STATUS_LABELS[caseItem.status]}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug">{caseItem.title}</CardTitle>
        <CardDescription className="text-xs">
          {CASE_TYPE_LABELS[caseItem.caseType]} ·{" "}
          {SUIT_LABELS[caseItem.suitType]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5" />
          <span>{caseItem.court}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Filed {formatDate(caseItem.filedAt)}</span>
        </div>
        {caseItem.nextHearingAt && (
          <div className="flex items-center gap-2">
            <Gavel className="h-3.5 w-3.5" />
            <span>
              Next hearing {formatDateTime(caseItem.nextHearingAt)}
            </span>
          </div>
        )}
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {caseItem.parties.length} parties
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> {caseItem.documents.length} docs
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CaseDetail({
  caseItem,
  onBack,
}: {
  caseItem: CaseLite;
  onBack: () => void;
}) {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const setActiveCaseCode = useAppStore((s) => s.setActiveCaseCode);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to cases
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <code className="text-xs font-mono text-muted-foreground">
            {caseItem.caseCode}
          </code>
          <h1 className="text-2xl font-bold tracking-tight">{caseItem.title}</h1>
          <p className="text-sm text-muted-foreground">
            {CASE_TYPE_LABELS[caseItem.caseType]} ·{" "}
            {SUIT_LABELS[caseItem.suitType]} · {caseItem.court}
            {caseItem.division ? ` — ${caseItem.division}` : ""}
          </p>
        </div>
        <Badge className={`${CASE_STATUS_TONES[caseItem.status]} border`}>
          {CASE_STATUS_LABELS[caseItem.status]}
        </Badge>
      </div>

      {caseItem.description && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Nature of the matter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {caseItem.description}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard title="Court & Division">
          <DetailRow label="Court" value={caseItem.court} />
          {caseItem.division && (
            <DetailRow label="Division" value={caseItem.division} />
          )}
          <DetailRow label="Filed" value={formatDate(caseItem.filedAt)} />
          {caseItem.nextHearingAt && (
            <DetailRow
              label="Next hearing"
              value={formatDateTime(caseItem.nextHearingAt)}
            />
          )}
        </InfoCard>

        <InfoCard title="Counsel & Bench">
          <DetailRow
            label="Lead counsel"
            value={caseItem.owner?.fullName ?? "—"}
          />
          {caseItem.firm && (
            <DetailRow label="Firm" value={caseItem.firm.name} />
          )}
          <DetailRow
            label="Presiding judge"
            value={caseItem.judge?.fullName ?? "Unassigned"}
          />
          {caseItem.judge && (
            <DetailRow
              label="Judge code"
              value={caseItem.judge.userCode}
              mono
            />
          )}
        </InfoCard>

        <InfoCard title="File summary">
          <DetailRow
            label="Parties"
            value={`${caseItem.parties.length}`}
          />
          <DetailRow
            label="Documents"
            value={`${caseItem.documents.length}`}
          />
          <DetailRow
            label="Evidence items"
            value={`${caseItem.documents.filter((d) => d.isEvidence).length}`}
          />
          <DetailRow
            label="Reminders"
            value={`${caseItem.reminders?.length ?? 0}`}
          />
        </InfoCard>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <ActionButton
          icon={Users}
          label="Parties & Evidence"
          onClick={() => {
            setActiveCaseCode(caseItem.caseCode);
            setActiveView("parties");
          }}
        />
        <ActionButton
          icon={Gavel}
          label="Case Tracking"
          onClick={() => {
            setActiveCaseCode(caseItem.caseCode);
            setActiveView("case-tracking");
          }}
        />
        <ActionButton
          icon={Calendar}
          label="Reminders"
          onClick={() => {
            setActiveCaseCode(caseItem.caseCode);
            setActiveView("reminders");
          }}
        />
        <ActionButton
          icon={FileText}
          label="Billing"
          onClick={() => {
            setActiveCaseCode(caseItem.caseCode);
            setActiveView("billing");
          }}
        />
      </div>

      {/* Parties overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" /> Parties to the suit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {caseItem.parties.map((p) => (
              <div
                key={p.id}
                className="rounded-md border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/40 text-[10px] text-primary"
                  >
                    {PARTY_LABELS[p.partyRole]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm font-medium">{p.fullName}</p>
                {p.legalCounsel && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Counsel: {p.legalCounsel}
                  </p>
                )}
                {p.contact && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent documents */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> Documents on file
          </CardTitle>
        </CardHeader>
        <CardContent>
          {caseItem.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents yet.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {caseItem.documents.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{d.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.fileName} · {d.fileSizeKb} KB · {formatDate(d.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.isEvidence && (
                      <Badge variant="outline" className="border-primary/40 text-[10px] text-primary">
                        Evidence
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px]">
                      {d.docType}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent invoices */}
      {caseItem.invoices && caseItem.invoices.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" /> Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              {caseItem.invoices.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-medium">{i.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.description} · due {formatDate(i.dueAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatGHS(i.amountCedi)}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {i.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto flex-col items-center justify-center gap-1.5 py-4"
      onClick={onClick}
    >
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs">{label}</span>
      <ChevronRight className="h-3 w-3 text-muted-foreground" />
    </Button>
  );
}

function StatCard({
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
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}

export function LockedNotice({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Lock className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Sign in required</h1>
      <p className="mt-2 text-muted-foreground">
        The case file area is reserved for counsel, litigants, firms and judges
        with a valid client code and case code.
      </p>
      <Button className="mt-6" onClick={onSignIn}>
        <Lock className="mr-2 h-4 w-4" /> Go to Client Portal
      </Button>
    </div>
  );
}

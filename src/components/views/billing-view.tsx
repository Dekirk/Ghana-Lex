"use client";
import {
  Wallet,
  Lock,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useCases, formatGHS, formatDate } from "@/lib/hooks";
import {
  INVOICE_STATUS_TONES,
  type InvoiceStatus,
} from "@/lib/types";
import { LockedNotice } from "./case-management-view";
import { toast } from "sonner";

export function BillingView() {
  const session = useAppStore((s) => s.session);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const activeCaseCode = useAppStore((s) => s.activeCaseCode);
  const { cases, loading, refresh } = useCases();

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

  const invoices = activeCase.invoices ?? [];
  const totalBilled = invoices.reduce((s, i) => s + i.amountCedi, 0);
  const collected = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + i.amountCedi, 0);
  const outstanding = totalBilled - collected;
  const overdue = invoices
    .filter((i) => i.status === "OVERDUE" || (i.status !== "PAID" && new Date(i.dueAt).getTime() < Date.now()))
    .reduce((s, i) => s + i.amountCedi, 0);

  async function markPaid(id: string, number: string) {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (!res.ok) throw new Error("Could not update invoice.");
      toast.success("Invoice marked paid.", { description: number });
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Update failed.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing &amp; Fees</h1>
          <p className="mt-1 text-muted-foreground">
            Invoices for <code className="text-xs">{activeCase.caseCode}</code> — billed in
            Ghana Cedis (GHS).
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

      {/* Totals */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Total billed"
          value={formatGHS(totalBilled)}
          icon={Wallet}
          tone="text-foreground"
        />
        <StatTile
          label="Collected"
          value={formatGHS(collected)}
          icon={CheckCircle2}
          tone="text-emerald-600"
        />
        <StatTile
          label="Outstanding"
          value={formatGHS(outstanding)}
          icon={Clock}
          tone="text-amber-600"
        />
        <StatTile
          label="Overdue"
          value={formatGHS(overdue)}
          icon={AlertTriangle}
          tone="text-rose-600"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-primary" /> Invoices
          </CardTitle>
          <CardDescription>
            {invoices.length} invoice{invoices.length === 1 ? "" : "s"} issued on this matter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No invoices have been issued on this matter yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {invoices.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono">{i.number}</code>
                      <Badge className={`${INVOICE_STATUS_TONES[i.status as InvoiceStatus]} border`}>
                        {i.status}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">
                      {i.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Issued {formatDate(i.issuedAt)} · due {formatDate(i.dueAt)}
                      {i.paidAt && ` · paid ${formatDate(i.paidAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatGHS(i.amountCedi)}
                    </span>
                    {i.status !== "PAID" && i.status !== "VOID" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markPaid(i.id, i.number)}
                      >
                        Mark paid
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Billing notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            All amounts are denominated in Ghana Cedis (GHS) and exclude VAT and
            the National Health Insurance Levy unless otherwise stated on the
            individual invoice.
          </p>
          <p>
            Litigants may download a printable PDF copy of any invoice from the
            client portal. Counsel may issue, void and reconcile invoices from
            the same screen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
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
        <p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

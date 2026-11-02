"use client";
import {
  Search,
  ShieldCheck,
  FolderKanban,
  Users,
  GitBranch,
  BellRing,
  Wallet,
  Scale,
  ArrowRight,
  Gavel,
  FileText,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import type { AppView } from "@/lib/types";

const FEATURES: {
  id: AppView;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "ai-search",
    title: "AI Legal Search",
    desc: "Ask a Ghana-law question and get an answer with verified / unverified markers and statutory citations.",
    icon: Search,
  },
  {
    id: "client-portal",
    title: "Secure Client Portal",
    desc: "Lawyers, litigants, law firms and judges sign in with a Client Code and a Case Code.",
    icon: ShieldCheck,
  },
  {
    id: "case-management",
    title: "Case Management",
    desc: "Track every matter from filing to judgment — pleadings, hearings, judges, parties and counsel.",
    icon: FolderKanban,
  },
  {
    id: "parties",
    title: "Parties & Evidence Vault",
    desc: "Plaintiff/Defendant, Appellant/Respondent, Petitioner/Respondent — with parallel document & evidence uploads.",
    icon: Users,
  },
  {
    id: "case-tracking",
    title: "Case Tracking",
    desc: "Milestones, case-management conferences, hearings and judgment — on a clear timeline.",
    icon: GitBranch,
  },
  {
    id: "reminders",
    title: "Reminders & Deadlines",
    desc: "Never miss a hearing, filing or limitation date. Critical-priority alerts for next-of-day items.",
    icon: BellRing,
  },
  {
    id: "billing",
    title: "Billing & Fees",
    desc: "Issue invoices in Ghana Cedis, track partial payments, dues and overdue balances per file.",
    icon: Wallet,
  },
];

const ROLES = [
  {
    label: "Lawyers",
    icon: Gavel,
    bullets: [
      "Open, manage and close files from a single dashboard",
      "Draft pleadings with AI-assisted research",
      "Track every fee and invoice in GHS",
    ],
  },
  {
    label: "Litigants",
    icon: Users,
    bullets: [
      "See the status of your own case from any device",
      "Upload evidence and supporting documents securely",
      "Pay invoices and message your lawyer",
    ],
  },
  {
    label: "Law Firms",
    icon: Scale,
    bullets: [
      "Manage associates, paralegals & matter allocations",
      "Firm-wide reporting on cases, fees & deadlines",
      "Role-based access for partners and staff",
    ],
  },
  {
    label: "Judges",
    icon: ShieldCheck,
    bullets: [
      "Review case files, pleadings and evidence in one view",
      "Manage your cause list and adjournments",
      "Issue directions and reserve judgments",
    ],
  },
];

export function HomeView() {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const session = useAppStore((s) => s.session);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-kente-stripe">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                AI-powered legal research &amp; case management for Ghana
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                <strong>GhanaLex AI</strong> brings AI-assisted legal research,
                secure client portals, and end-to-end case management to the
                Ghanaian legal fraternity — lawyers, litigants, law firms and
                judges — on one secure cloud-deployable application.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => setActiveView("ai-search")}
                >
                  <Search className="mr-2 h-4 w-4" /> Try the AI Legal Search
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setActiveView("client-portal")}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Enter Client Portal
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Demo codes — Lawyer <code className="rounded bg-muted px-1.5 py-0.5">GH-LX-1042</code>,
                Judge <code className="rounded bg-muted px-1.5 py-0.5">GH-JD-2031</code>,
                Litigant <code className="rounded bg-muted px-1.5 py-0.5">GH-LG-5520</code> ·
                Case <code className="rounded bg-muted px-1.5 py-0.5">GLX-CS-2026-0014</code>
              </p>
            </div>

            <Card className="border-primary/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" /> Two-code security
                </CardTitle>
                <CardDescription>
                  Every session binds a user to a specific case file. No code,
                  no entry — for any role.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <SecurityRow
                  code="Client Code"
                  example="GH-LX-1042"
                  who="Issued to lawyers, litigants, firms, judges"
                />
                <SecurityRow
                  code="Case Code"
                  example="GLX-CS-2026-0014"
                  who="Unique per case file — public-facing reference"
                />
                <SecurityRow
                  code="Bar / Bench No."
                  example="GBA/ACC/2014/0387"
                  who="Required of practitioners and justices"
                />
                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Verified answers
                  </p>
                  <p className="mt-1 text-emerald-800">
                    AI answers carry a{" "}
                    <strong>Verified</strong> or{" "}
                    <strong>Unverified</strong> badge based on whether they cite
                    Ghanaian statute or case authority.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything a modern Ghanaian practice needs
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Eight modules, one workflow — from AI-assisted research through to
            invoices paid in Ghana Cedis.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const locked =
              !session &&
              ["case-management", "parties", "case-tracking", "reminders", "billing"].includes(
                f.id,
              );
            return (
              <Card
                key={f.id}
                className="group cursor-pointer transition hover:border-primary/40 hover:shadow-md"
                onClick={() => setActiveView(f.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    {locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground/60" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    )}
                  </div>
                  <CardTitle className="mt-3 text-base">{f.title}</CardTitle>
                  <CardDescription className="text-sm">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ROLES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for every member of the legal fraternity
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Each role gets a tailored, secure view of the same case file.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.label}
                  className="rounded-lg border border-border bg-background p-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold">{r.label}</h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {r.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY GHANA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Grounded in Ghanaian law
            </h2>
            <p className="mt-3 text-muted-foreground">
              GhanaLex AI is trained to recognise Ghanaian authorities — the
              1992 Constitution, Acts of Parliament, NRCD/SMCD/PNDCL decrees,
              C.I. 47 / C.I. 19 / C.I. 16 procedural rules, and the SCGLR / HGLR
              case reports — and to cite them in standard Ghanaian form.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="mt-2 font-semibold">Statute-aware answers</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Answers that cite a Ghanaian Act, Decree, C.I. or rule are
              auto-flagged <Badge className="ml-1 bg-emerald-600">Verified</Badge>.
              Anything else is clearly marked{" "}
              <Badge className="ml-1 bg-amber-600">Unverified</Badge>.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="mt-2 font-semibold">Counsel-reviewed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified answers are reviewed by counsel before being marked
              authoritative. Unverified answers carry a clear disclaimer and
              must not be relied upon as legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-primary p-8 text-primary-foreground sm:p-12">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to see GhanaLex AI in action?
              </h2>
              <p className="mt-2 max-w-2xl text-primary-foreground/80">
                Try the public AI legal search, then sign in to the client
                portal with the demo codes above to walk through a sample
                Ghanaian land, commercial and probate matter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setActiveView("ai-search")}
              >
                <Search className="mr-2 h-4 w-4" /> Try AI Search
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                onClick={() => setActiveView("client-portal")}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Enter Portal
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SecurityRow({
  code,
  example,
  who,
}: {
  code: string;
  example: string;
  who: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-background p-3">
      <Lock className="mt-0.5 h-4 w-4 text-primary" />
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">{code}</span>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            {example}
          </code>
        </div>
        <p className="text-xs text-muted-foreground">{who}</p>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Scale,
  Loader2,
  Info,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { ROLE_LABELS, type SessionUser } from "@/lib/types";
import { toast } from "sonner";

const DEMO_ACCOUNTS = [
  {
    role: "LAWYER",
    userCode: "GH-LX-1042",
    barNumber: "GBA/ACC/2014/0387",
    caseCode: "GLX-CS-2026-0014",
    label: "Nana Adwoa Agyei — Agyei & Marful Legal Consult",
  },
  {
    role: "JUDGE",
    userCode: "GH-JD-2031",
    barNumber: "JSC/ACC/2018-014",
    caseCode: "GLX-CS-2026-0014",
    label: "Hon. Justice Kweku Marful — Accra High Court",
  },
  {
    role: "LITIGANT",
    userCode: "GH-LG-5520",
    barNumber: "",
    caseCode: "GLX-CS-2026-0014",
    label: "Akosua Mensah — Plaintiff",
  },
  {
    role: "LITIGANT",
    userCode: "GH-LG-7733",
    barNumber: "",
    caseCode: "GLX-CS-2026-0014",
    label: "Kofi Boateng — Defendant",
  },
];

export function ClientPortalView() {
  const setSession = useAppStore((s) => s.setSession);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const setActiveCaseCode = useAppStore((s) => s.setActiveCaseCode);

  const [userCode, setUserCode] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCode, caseCode, barNumber }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error ?? "Sign-in failed.");
      }
      setSession(body.session as SessionUser);
      setActiveCaseCode(body.caseCode);
      toast.success(`Welcome, ${body.session.fullName.split(" ")[0]}.`, {
        description: `Access granted to ${body.caseCode}.`,
      });
      setActiveView("case-management");
    } catch (e: any) {
      setError(e?.message ?? "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(d: (typeof DEMO_ACCOUNTS)[number]) {
    setUserCode(d.userCode);
    setCaseCode(d.caseCode);
    setBarNumber(d.barNumber);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
          <Lock className="mr-1 h-3 w-3" /> Two-code secure access
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Client Portal</h1>
        <p className="text-muted-foreground">
          For <strong>lawyers, litigants, law firms and judges</strong>. Sign in
          with your Client / Practitioner Code <em>and</em> the Case Code of the
          matter you wish to access.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LogIn className="h-4 w-4 text-primary" /> Sign in to a case file
            </CardTitle>
            <CardDescription>
              Practitioners and justices must also enter their Bar / Bench number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={signIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userCode" className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" /> Client / Practitioner Code
                </Label>
                <Input
                  id="userCode"
                  placeholder="e.g. GH-LX-1042"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  autoCapitalize="characters"
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseCode" className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" /> Case Code
                </Label>
                <Input
                  id="caseCode"
                  placeholder="e.g. GLX-CS-2026-0014"
                  value={caseCode}
                  onChange={(e) => setCaseCode(e.target.value)}
                  autoCapitalize="characters"
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barNumber" className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Bar / Bench Number
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                    (lawyers &amp; judges only)
                  </span>
                </Label>
                <Input
                  id="barNumber"
                  placeholder="e.g. GBA/ACC/2014/0387"
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {loading ? "Authenticating…" : "Enter portal"}
              </Button>
              <p className="text-[11px] text-muted-foreground">
                By signing in you confirm you are authorised to view this case
                file. Sessions are bound to the case code entered above.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-primary" /> How access control works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <RoleRow role="LAWYER">
                Lawyers sign in with their firm-issued client code plus the case
                code of the matter. The bar number must match the General Legal
                Council register.
              </RoleRow>
              <RoleRow role="JUDGE">
                Justices sign in with their bench code plus a case code assigned
                to their docket. The bench number is verified against the
                Judicial Service register.
              </RoleRow>
              <RoleRow role="LITIGANT">
                Litigants sign in with the client code issued by their lawyer,
                plus the case code of their own matter. They see only the file
                of cases where they are a recorded party.
              </RoleRow>
              <RoleRow role="ADMIN">
                Firm administrators manage users, codes and reporting across the
                firm&apos;s entire portfolio.
              </RoleRow>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Demo accounts — click to fill</CardTitle>
              <CardDescription className="text-xs">
                Use these to explore the platform without setting up an account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {DEMO_ACCOUNTS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => fillDemo(d)}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-background p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-[10px] text-primary"
                      >
                        {ROLE_LABELS[d.role as keyof typeof ROLE_LABELS]}
                      </Badge>
                      <span className="text-xs font-medium">{d.label}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span>Client: <code className="text-foreground">{d.userCode}</code></span>
                      <span>Case: <code className="text-foreground">{d.caseCode}</code></span>
                      {d.barNumber && (
                        <span>Bar: <code className="text-foreground">{d.barNumber}</code></span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoleRow({
  role,
  children,
}: {
  role: keyof typeof ROLE_LABELS;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-background p-3">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {ROLE_LABELS[role]}
        </p>
        <p className="mt-1 text-xs">{children}</p>
      </div>
    </div>
  );
}

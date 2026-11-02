"use client";
import { useMemo, useState } from "react";
import {
  Users,
  Lock,
  Loader2,
  Upload,
  FileText,
  ShieldAlert,
  Paperclip,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { useCases, formatDate } from "@/lib/hooks";
import {
  PARTY_LABELS,
  SUIT_LABELS,
  type CaseLite,
  type DocType,
  type PartyRole,
} from "@/lib/types";
import { LockedNotice } from "./case-management-view";
import { toast } from "sonner";

const DOC_TYPES: DocType[] = [
  "PLEADING",
  "EVIDENCE",
  "AFFIDAVIT",
  "EXHIBIT",
  "JUDGMENT",
  "RULING",
  "WRIT",
  "CORRESPONDENCE",
  "OTHER",
];

// For each suit type, the two opposing party roles.
const SUIT_PARTIES: Record<
  string,
  { first: PartyRole; second: PartyRole }
> = {
  PLAINTIFF_DEFENDANT: { first: "PLAINTIFF", second: "DEFENDANT" },
  APPELLANT_RESPONDENT: { first: "APPELLANT", second: "RESPONDENT" },
  PETITIONER_RESPONDENT: { first: "PETITIONER", second: "RESPONDENT" },
};

export function PartiesView() {
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
        <p className="mt-3 text-sm">Loading case file…</p>
      </div>
    );
  }

  const roles = SUIT_PARTIES[activeCase.suitType] ?? SUIT_PARTIES.PLAINTIFF_DEFENDANT;
  const firstParty = activeCase.parties.find((p) => p.partyRole === roles.first);
  const secondParty = activeCase.parties.find((p) => p.partyRole === roles.second);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parties & Evidence</h1>
          <p className="mt-1 text-muted-foreground">
            {SUIT_LABELS[activeCase.suitType]} ·{" "}
            <code className="text-xs">{activeCase.caseCode}</code>
          </p>
        </div>
        <Select
          value={activeCase.caseCode}
          onValueChange={(v) =>
            useAppStore.setState({ activeCaseCode: v })
          }
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Switch case" />
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

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PartyCard
          caseItem={activeCase}
          partyRole={roles.first}
          party={firstParty}
          accent="primary"
        />
        <PartyCard
          caseItem={activeCase}
          partyRole={roles.second}
          party={secondParty}
          accent="amber"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> All documents &amp; evidence on file
          </CardTitle>
          <CardDescription>
            Documents are grouped by the filing party. Evidence items are
            flagged automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeCase.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents have been filed yet.
            </p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {activeCase.documents.map((d) => {
                const filingParty = activeCase.parties.find((p) => p.id === d.partyId);
                return (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md ${
                          d.isEvidence
                            ? "bg-amber-100 text-amber-700"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Paperclip className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{d.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.fileName} · {d.fileSizeKb} KB ·{" "}
                          {formatDate(d.uploadedAt)}
                          {filingParty
                            ? ` · filed by ${filingParty.fullName}`
                            : ""}
                        </p>
                        {d.notes && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {d.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {d.isEvidence && (
                        <Badge variant="outline" className="border-amber-400 text-[10px] text-amber-700">
                          Evidence
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-[10px]">
                        {d.docType}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PartyCard({
  caseItem,
  partyRole,
  party,
  accent,
}: {
  caseItem: CaseLite;
  partyRole: PartyRole;
  party: CaseLite["parties"][number] | undefined;
  accent: "primary" | "amber";
}) {
  const session = useAppStore((s) => s.session);
  const [showUpload, setShowUpload] = useState(false);

  const partyDocs = caseItem.documents.filter((d) =>
    party ? d.partyId === party.id : false,
  );

  const accentClasses =
    accent === "primary"
      ? {
          icon: "bg-primary text-primary-foreground",
          badge: "border-primary/40 text-primary",
          ring: "ring-primary/20",
        }
      : {
          icon: "bg-amber-600 text-white",
          badge: "border-amber-500/40 text-amber-700",
          ring: "ring-amber-500/20",
        };

  return (
    <Card className={`ring-1 ${accentClasses.ring}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-10 w-10 place-items-center rounded-md ${accentClasses.icon}`}
            >
              <Users className="h-5 w-5" />
            </span>
            <div>
              <Badge
                variant="outline"
                className={`mb-1 text-[10px] ${accentClasses.badge}`}
              >
                {PARTY_LABELS[partyRole]}
              </Badge>
              <CardTitle className="text-base leading-tight">
                {party?.fullName ?? `No ${PARTY_LABELS[partyRole].toLowerCase()} recorded`}
              </CardTitle>
              <CardDescription className="text-xs">
                {party?.legalCounsel ?? "Counsel not on record"}
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowUpload((v) => !v)}
          >
            <Upload className="mr-1 h-3.5 w-3.5" /> Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {party?.contact && (
          <p className="text-xs text-muted-foreground">{party.contact}</p>
        )}

        {showUpload && party && (
          <UploadForm
            caseId={caseItem.id}
            partyId={party.id}
            userCode={session?.userCode ?? ""}
            onDone={() => setShowUpload(false)}
          />
        )}

        <Separator />

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Documents filed by this party ({partyDocs.length})
          </p>
          {partyDocs.length === 0 ? (
            <p className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
              No documents filed yet by the {PARTY_LABELS[partyRole].toLowerCase()}.
            </p>
          ) : (
            <ul className="space-y-2">
              {partyDocs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-background p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{d.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {d.fileName} · {formatDate(d.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {d.isEvidence && (
                      <Badge variant="outline" className="border-amber-400 text-[9px] text-amber-700">
                        Evidence
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-[9px]">
                      {d.docType}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UploadForm({
  caseId,
  partyId,
  userCode,
  onDone,
}: {
  caseId: string;
  partyId: string;
  userCode: string;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSizeKb, setFileSizeKb] = useState(0);
  const [docType, setDocType] = useState<DocType>("PLEADING");
  const [isEvidence, setIsEvidence] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSizeKb(Math.max(1, Math.round(file.size / 1024)));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    // Heuristic — flagged as evidence if the file is an image or pdf with "exhibit"/"evidence".
    const lower = file.name.toLowerCase();
    if (
      /\.(jpg|jpeg|png|gif|bmp|mp4|mov|wav|mp3)$/.test(lower) ||
      /exhibit|evidence|proof/.test(lower)
    ) {
      setIsEvidence(true);
      setDocType("EVIDENCE");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          partyId,
          userCode,
          title,
          docType,
          fileName: fileName || "untitled.pdf",
          fileSizeKb,
          notes,
          isEvidence,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Upload failed.");
      }
      toast.success("Document lodged.", {
        description: `${title} has been added to the matter file.`,
      });
      onDone();
      // Trigger a refresh of cases in the parent by reloading the page state.
      setTimeout(() => window.location.reload(), 800);
    } catch (e: any) {
      toast.error("Could not lodge document", { description: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-primary/30 bg-primary/5 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="title" className="text-xs">Document title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Statement of Claim — Annex A"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="docType" className="text-xs">Type</Label>
          <Select value={docType} onValueChange={(v) => setDocType(v as DocType)}>
            <SelectTrigger id="docType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="file" className="text-xs">File</Label>
          <Input
            id="file"
            type="file"
            onChange={onFile}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4,.wav"
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Certified true copy issued by the Lands Commission."
          />
        </div>
        <label className="col-span-2 flex items-center gap-2 rounded-md border border-border bg-background p-2.5 text-xs">
          <input
            type="checkbox"
            checked={isEvidence}
            onChange={(e) => setIsEvidence(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>
            Mark as <strong>evidence</strong> — exhibits, photos, recordings,
            original documents tendered in proof.
          </span>
        </label>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {fileName
            ? `${fileName} · ${fileSizeKb || "?"} KB`
            : "No file selected (metadata will still be recorded)."}
        </p>
        <Button type="submit" size="sm" disabled={loading || !title}>
          {loading ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          )}
          Lodge document
        </Button>
      </div>
    </form>
  );
}

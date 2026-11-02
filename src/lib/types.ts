// Shared TypeScript types used by client + server for GhanaLex AI.
// These mirror the Prisma models but stay runtime-light for the client.

export type UserRole = "ADMIN" | "LAWYER" | "JUDGE" | "LITIGANT";

export type CaseType =
  | "CIVIL"
  | "CRIMINAL"
  | "FAMILY"
  | "LAND"
  | "COMMERCIAL"
  | "CONSTITUTIONAL"
  | "ADMINISTRATIVE"
  | "PROBATE";

export type SuitType =
  | "PLAINTIFF_DEFENDANT"
  | "APPELLANT_RESPONDENT"
  | "PETITIONER_RESPONDENT";

export type PartyRole =
  | "PLAINTIFF"
  | "DEFENDANT"
  | "APPELLANT"
  | "RESPONDENT"
  | "PETITIONER";

export type CaseStatus =
  | "FILED"
  | "ACTIVE"
  | "ADJOURNED"
  | "JUDGMENT"
  | "CLOSED"
  | "APPEALED";

export type DocType =
  | "PLEADING"
  | "EVIDENCE"
  | "AFFIDAVIT"
  | "EXHIBIT"
  | "JUDGMENT"
  | "RULING"
  | "WRIT"
  | "CORRESPONDENCE"
  | "OTHER";

export type MilestoneStatus = "DONE" | "IN_PROGRESS" | "PENDING" | "SKIPPED";

export type ReminderPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type InvoiceStatus =
  | "UNPAID"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE"
  | "VOID";

export type AppView =
  | "home"
  | "ai-search"
  | "client-portal"
  | "case-management"
  | "parties"
  | "case-tracking"
  | "reminders"
  | "billing";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  userCode: string;
  barNumber?: string | null;
  phone?: string | null;
  firm?: { name: string } | null;
}

export interface PartyLite {
  id: string;
  partyRole: PartyRole;
  fullName: string;
  contact?: string | null;
  legalCounsel?: string | null;
}

export interface DocLite {
  id: string;
  title: string;
  docType: DocType;
  fileName: string;
  fileSizeKb: number;
  isEvidence: boolean;
  notes?: string | null;
  uploadedAt: string;
  partyId?: string | null;
}

export interface CaseLite {
  id: string;
  caseCode: string;
  title: string;
  caseType: CaseType;
  suitType: SuitType;
  court: string;
  division?: string | null;
  status: CaseStatus;
  filedAt: string;
  nextHearingAt?: string | null;
  description?: string | null;
  judge?: { fullName: string; userCode: string } | null;
  owner?: { fullName: string; userCode: string } | null;
  firm?: { name: string } | null;
  parties: PartyLite[];
  documents: DocLite[];
  milestones?: {
    id: string;
    title: string;
    description?: string | null;
    status: MilestoneStatus;
    eventDate: string;
  }[];
  reminders?: {
    id: string;
    title: string;
    dueAt: string;
    priority: ReminderPriority;
    isDone: boolean;
  }[];
  invoices?: {
    id: string;
    number: string;
    description: string;
    amountCedi: number;
    status: InvoiceStatus;
    issuedAt: string;
    dueAt: string;
    paidAt?: string | null;
  }[];
}

export interface AiAnswer {
  question: string;
  answer: string;
  verified: boolean;
  sources?: string | null;
  disclaimer: string;
  createdAt: string;
}

// ── Lookup tables (UI labels) ────────────────────────────────────────────────
export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "System Administrator",
  LAWYER: "Legal Practitioner",
  JUDGE: "Judge / Justice",
  LITIGANT: "Litigant / Party",
};

export const PARTY_LABELS: Record<PartyRole, string> = {
  PLAINTIFF: "Plaintiff",
  DEFENDANT: "Defendant",
  APPELLANT: "Appellant",
  RESPONDENT: "Respondent",
  PETITIONER: "Petitioner",
};

export const SUIT_LABELS: Record<SuitType, string> = {
  PLAINTIFF_DEFENDANT: "Plaintiff v. Defendant",
  APPELLANT_RESPONDENT: "Appellant v. Respondent",
  PETITIONER_RESPONDENT: "Petitioner v. Respondent",
};

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  CIVIL: "Civil",
  CRIMINAL: "Criminal",
  FAMILY: "Family & Matrimonial",
  LAND: "Land",
  COMMERCIAL: "Commercial",
  CONSTITUTIONAL: "Constitutional",
  ADMINISTRATIVE: "Administrative",
  PROBATE: "Probate & Administration",
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  FILED: "Filed",
  ACTIVE: "Active",
  ADJOURNED: "Adjourned",
  JUDGMENT: "Judgment Reserved",
  CLOSED: "Closed",
  APPEALED: "On Appeal",
};

export const CASE_STATUS_TONES: Record<CaseStatus, string> = {
  FILED: "bg-amber-100 text-amber-900 border-amber-300",
  ACTIVE: "bg-emerald-100 text-emerald-900 border-emerald-300",
  ADJOURNED: "bg-orange-100 text-orange-900 border-orange-300",
  JUDGMENT: "bg-purple-100 text-purple-900 border-purple-300",
  CLOSED: "bg-stone-200 text-stone-700 border-stone-400",
  APPEALED: "bg-rose-100 text-rose-900 border-rose-300",
};

export const INVOICE_STATUS_TONES: Record<InvoiceStatus, string> = {
  UNPAID: "bg-rose-100 text-rose-900 border-rose-300",
  PARTIAL: "bg-amber-100 text-amber-900 border-amber-300",
  PAID: "bg-emerald-100 text-emerald-900 border-emerald-300",
  OVERDUE: "bg-red-200 text-red-900 border-red-400",
  VOID: "bg-stone-200 text-stone-700 border-stone-400",
};

export const PRIORITY_TONES: Record<ReminderPriority, string> = {
  LOW: "bg-stone-100 text-stone-700 border-stone-300",
  MEDIUM: "bg-sky-100 text-sky-900 border-sky-300",
  HIGH: "bg-amber-100 text-amber-900 border-amber-300",
  CRITICAL: "bg-rose-100 text-rose-900 border-rose-300",
};

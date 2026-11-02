import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CaseLite } from "@/lib/types";

const caseInclude = {
  judge: { select: { fullName: true, userCode: true } },
  owner: { select: { fullName: true, userCode: true } },
  firm: { select: { name: true } },
  parties: true,
  documents: { orderBy: { uploadedAt: "desc" } },
  milestones: { orderBy: { eventDate: "asc" } },
  reminders: { orderBy: { dueAt: "asc" } },
  invoices: { orderBy: { issuedAt: "desc" } },
} as const;

function toCaseLite(c: any): CaseLite {
  return {
    id: c.id,
    caseCode: c.caseCode,
    title: c.title,
    caseType: c.caseType,
    suitType: c.suitType,
    court: c.court,
    division: c.division,
    status: c.status,
    filedAt: c.filedAt.toISOString(),
    nextHearingAt: c.nextHearingAt?.toISOString() ?? null,
    description: c.description,
    judge: c.judge,
    owner: c.owner,
    firm: c.firm,
    parties: c.parties.map((p: any) => ({
      id: p.id,
      partyRole: p.partyRole,
      fullName: p.fullName,
      contact: p.contact,
      legalCounsel: p.legalCounsel,
    })),
    documents: c.documents.map((d: any) => ({
      id: d.id,
      title: d.title,
      docType: d.docType,
      fileName: d.fileName,
      fileSizeKb: d.fileSizeKb,
      isEvidence: d.isEvidence,
      notes: d.notes,
      uploadedAt: d.uploadedAt.toISOString(),
      partyId: d.partyId,
    })),
    milestones: c.milestones.map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      status: m.status,
      eventDate: m.eventDate.toISOString(),
    })),
    reminders: c.reminders.map((r: any) => ({
      id: r.id,
      title: r.title,
      dueAt: r.dueAt.toISOString(),
      priority: r.priority,
      isDone: r.isDone,
    })),
    invoices: c.invoices.map((i: any) => ({
      id: i.id,
      number: i.number,
      description: i.description,
      amountCedi: i.amountCedi,
      status: i.status,
      issuedAt: i.issuedAt.toISOString(),
      dueAt: i.dueAt.toISOString(),
      paidAt: i.paidAt?.toISOString() ?? null,
    })),
  };
}

// GET /api/cases/[caseCode]?userCode=...
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ caseCode: string }> },
) {
  const { caseCode } = await params;
  const url = new URL(req.url);
  const userCode = (url.searchParams.get("userCode") ?? "").toUpperCase();

  if (!userCode) {
    return NextResponse.json(
      { error: "userCode query parameter is required." },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({ where: { userCode } });
  if (!user) {
    return NextResponse.json({ error: "Unknown user code." }, { status: 404 });
  }

  const c = await db.case.findUnique({
    where: { caseCode: caseCode.toUpperCase() },
    include: caseInclude,
  });

  if (!c) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  // Authorisation check (mirror of /api/login).
  let authorised = false;
  if (user.role === "ADMIN") authorised = true;
  else if (user.role === "LAWYER" && c.ownerId === user.id) authorised = true;
  else if (user.role === "LAWYER" && c.firmId && c.firmId === user.firmId)
    authorised = true;
  else if (user.role === "JUDGE" && c.judgeId === user.id) authorised = true;
  else if (user.role === "LITIGANT") {
    const party = await db.caseParty.findFirst({
      where: { caseId: c.id, userId: user.id },
    });
    authorised = !!party;
  }

  if (!authorised) {
    return NextResponse.json(
      { error: "Not authorised to view this case." },
      { status: 403 },
    );
  }

  return NextResponse.json(toCaseLite(c));
}

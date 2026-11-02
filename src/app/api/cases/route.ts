import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CaseLite } from "@/lib/types";

// GET /api/cases?scope=mine|firm|all&userCode=...
// Returns the list of cases the requesting user is authorised to see.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userCode = (url.searchParams.get("userCode") ?? "").toUpperCase();

  if (!userCode) {
    return NextResponse.json(
      { error: "userCode query parameter is required." },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({
    where: { userCode },
    include: { firm: { select: { name: true } } },
  });

  if (!user) {
    return NextResponse.json({ error: "Unknown user code." }, { status: 404 });
  }

  let cases: any[] = [];

  if (user.role === "ADMIN") {
    cases = await db.case.findMany({ include: caseInclude, orderBy: { filedAt: "desc" } });
  } else if (user.role === "LAWYER") {
    cases = await db.case.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          ...(user.firmId ? [{ firmId: user.firmId }] : []),
        ],
      },
      include: caseInclude,
      orderBy: { filedAt: "desc" },
    });
  } else if (user.role === "JUDGE") {
    cases = await db.case.findMany({
      where: { judgeId: user.id },
      include: caseInclude,
      orderBy: { filedAt: "desc" },
    });
  } else {
    // LITIGANT — cases where they are a party.
    const parties = await db.caseParty.findMany({
      where: { userId: user.id },
      select: { caseId: true },
    });
    const ids = parties.map((p) => p.caseId);
    cases = await db.case.findMany({
      where: { id: { in: ids } },
      include: caseInclude,
      orderBy: { filedAt: "desc" },
    });
  }

  return NextResponse.json({ items: cases.map(toCaseLite) });
}

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

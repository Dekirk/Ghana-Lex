import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/documents
// Body: { caseId, partyId?, title, docType, fileName, fileSizeKb, notes?, isEvidence?, userCode }
// Persists a document/evidence record. In production this would also stream
// the file to S3/GCS and persist fileUrl — for the proposed system we record
// the metadata so the matter file is complete.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const caseId = (body?.caseId ?? "").toString();
    const userCode = (body?.userCode ?? "").toString().toUpperCase();
    const title = (body?.title ?? "").toString().trim();
    const docType = (body?.docType ?? "OTHER").toString().toUpperCase();
    const fileName = (body?.fileName ?? "").toString().trim();
    const fileSizeKb = Number(body?.fileSizeKb ?? 0) || 0;
    const notes = (body?.notes ?? "").toString().trim() || null;
    const isEvidence = !!body?.isEvidence;
    const partyId = body?.partyId ? String(body.partyId) : null;

    if (!caseId || !userCode || !title || !fileName) {
      return NextResponse.json(
        {
          error:
            "caseId, userCode, title and fileName are required to lodge a document.",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({ where: { userCode } });
    if (!user) {
      return NextResponse.json(
        { error: "Unknown user code." },
        { status: 404 },
      );
    }

    const c = await db.case.findUnique({
      where: { id: caseId },
      select: { id: true, ownerId: true, firmId: true, judgeId: true },
    });
    if (!c) {
      return NextResponse.json(
        { error: "Case not found." },
        { status: 404 },
      );
    }

    // Authorise: lawyer owner, same-firm lawyer, judge, litigant party, admin.
    let authorised = false;
    if (user.role === "ADMIN") authorised = true;
    else if (user.role === "LAWYER" && c.ownerId === user.id) authorised = true;
    else if (user.role === "LAWYER" && c.firmId && c.firmId === user.firmId)
      authorised = true;
    else if (user.role === "LITIGANT") {
      const party = await db.caseParty.findFirst({
        where: { caseId: c.id, userId: user.id },
      });
      authorised = !!party;
      // Litigants must file against their own party entry if partyId given.
      if (partyId && party && partyId !== party.id) {
        return NextResponse.json(
          {
            error:
              "A litigant may only upload documents on behalf of their own party entry.",
          },
          { status: 403 },
        );
      }
    }

    if (!authorised) {
      return NextResponse.json(
        { error: "Not authorised to upload documents to this case." },
        { status: 403 },
      );
    }

    const doc = await db.document.create({
      data: {
        caseId: c.id,
        partyId,
        title,
        docType,
        fileName,
        fileSizeKb,
        notes,
        isEvidence,
      },
    });

    return NextResponse.json({ document: doc });
  } catch (err) {
    console.error("[documents] fatal:", err);
    return NextResponse.json(
      { error: "Unable to lodge the document." },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { SessionUser } from "@/lib/types";

// Secure client-portal login.
// Requires BOTH a user/client code AND a case code so a session is bound to
// a specific case file. Lawyers and judges additionally need their bar number.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userCode = (body?.userCode ?? "").toString().trim().toUpperCase();
    const caseCode = (body?.caseCode ?? "").toString().trim().toUpperCase();
    const barNumber = (body?.barNumber ?? "").toString().trim();

    if (!userCode || !caseCode) {
      return NextResponse.json(
        {
          error:
            "Both a Client/Practitioner Code and a Case Code are required to enter the portal.",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { userCode },
      include: { firm: { select: { name: true } } },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Client/Practitioner Code not recognised." },
        { status: 404 },
      );
    }

    if (user.role === "LAWYER" || user.role === "JUDGE") {
      if (!barNumber) {
        return NextResponse.json(
          {
            error:
              "Practitioners and judges must also enter their Bar / Bench number for verification.",
          },
          { status: 403 },
        );
      }
      if (
        user.barNumber &&
        user.barNumber.trim().toLowerCase() !== barNumber.trim().toLowerCase()
      ) {
        return NextResponse.json(
          { error: "The Bar / Bench number does not match our records." },
          { status: 403 },
        );
      }
    }

    const caseRecord = await db.case.findUnique({
      where: { caseCode },
      select: { id: true, caseCode: true, ownerId: true, judgeId: true },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { error: "Case Code not recognised." },
        { status: 404 },
      );
    }

    // Authorisation: the user must be related to this case.
    // 1. Lawyer is the case owner.
    // 2. Judge is assigned to the case.
    // 3. Litigant is a party of the case.
    let authorised = false;
    if (user.role === "LAWYER" && caseRecord.ownerId === user.id) {
      authorised = true;
    } else if (user.role === "JUDGE" && caseRecord.judgeId === user.id) {
      authorised = true;
    } else if (user.role === "ADMIN") {
      authorised = true;
    } else if (user.role === "LITIGANT") {
      const party = await db.caseParty.findFirst({
        where: { caseId: caseRecord.id, userId: user.id },
      });
      authorised = !!party;
    } else if (user.role === "LAWYER") {
      // Same-firm lawyer fallback.
      const caseWithFirm = await db.case.findUnique({
        where: { caseCode },
        select: { firmId: true },
      });
      authorised = !!caseWithFirm?.firmId && caseWithFirm.firmId === user.firmId;
    }

    if (!authorised) {
      return NextResponse.json(
        {
          error:
            "This user code is not authorised to access the requested case file.",
        },
        { status: 403 },
      );
    }

    const session: SessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role as SessionUser["role"],
      userCode: user.userCode,
      barNumber: user.barNumber,
      phone: user.phone,
      firm: user.firm,
    };

    return NextResponse.json({ session, caseCode });
  } catch (err) {
    console.error("[login] fatal:", err);
    return NextResponse.json(
      { error: "Unable to authenticate at this time." },
      { status: 500 },
    );
  }
}

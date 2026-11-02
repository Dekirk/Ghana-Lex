// Seed script — populates the database with a realistic Ghanaian legal dataset.
import { db } from "../src/lib/db";

async function main() {
  // ── Firm ────────────────────────────────────────────────────────────────
  const firm = await db.firm.create({
    data: {
      name: "Agyei & Marful Legal Consult",
      address: "22 Kojo Thompson Road, Adabraka, Accra",
      phone: "+233 30 222 1188",
      email: "chambers@agyeimarful.com.gh",
    },
  });

  // ── Users (4 roles) ─────────────────────────────────────────────────────
  const lawyer = await db.user.create({
    data: {
      fullName: "Nana Adwoa Agyei",
      email: "n.agyei@agyeimarful.com.gh",
      role: "LAWYER",
      userCode: "GH-LX-1042",
      firmId: firm.id,
      barNumber: "GBA/ACC/2014/0387",
      phone: "+233 24 411 9087",
    },
  });

  const judge = await db.user.create({
    data: {
      fullName: "Hon. Justice Kweku Marful",
      email: "k.marful@judicial.gov.gh",
      role: "JUDGE",
      userCode: "GH-JD-2031",
      barNumber: "JSC/ACC/2018-014",
      phone: "+233 20 555 0042",
    },
  });

  const plaintiffUser = await db.user.create({
    data: {
      fullName: "Akosua Mensah",
      email: "akosua.mensah@gmail.com",
      role: "LITIGANT",
      userCode: "GH-LG-5520",
      phone: "+233 27 884 2210",
    },
  });

  const defendantUser = await db.user.create({
    data: {
      fullName: "Kofi Boateng",
      email: "kofi.boateng@yahoo.com",
      role: "LITIGANT",
      userCode: "GH-LG-7733",
      phone: "+233 26 119 4477",
    },
  });

  // ── Case 1 — Civil land dispute ────────────────────────────────────────
  const case1 = await db.case.create({
    data: {
      caseCode: "GLX-CS-2026-0014",
      title: "Mensah v. Boateng — Land Title Dispute at East Legon",
      caseType: "LAND",
      suitType: "PLAINTIFF_DEFENDANT",
      court: "Accra High Court (Land Division)",
      division: "Land & Environmental",
      judgeId: judge.id,
      ownerId: lawyer.id,
      firmId: firm.id,
      status: "ACTIVE",
      filedAt: new Date("2026-08-14"),
      nextHearingAt: new Date("2026-11-18T10:00:00Z"),
      description:
        "Suit over the title and beneficial interest in Plot 27, East Legon Hills, Accra. Plaintiff claims through her late father's 1992 allocation; defendant asserts a 2018 statutory declaration.",
    },
  });

  await db.caseParty.create({
    data: {
      caseId: case1.id,
      userId: plaintiffUser.id,
      partyRole: "PLAINTIFF",
      fullName: "Akosua Mensah",
      contact: "+233 27 884 2210 / akosua.mensah@gmail.com",
      legalCounsel: "Nana Adwoa Agyei (GBA/ACC/2014/0387)",
    },
  });

  await db.caseParty.create({
    data: {
      caseId: case1.id,
      userId: defendantUser.id,
      partyRole: "DEFENDANT",
      fullName: "Kofi Boateng",
      contact: "+233 26 119 4477 / kofi.boateng@yahoo.com",
      legalCounsel: "Self-represented (with notice to file appearance)",
    },
  });

  await db.document.create({
    data: {
      caseId: case1.id,
      title: "Writ of Summon & Statement of Claim",
      docType: "PLEADING",
      fileName: "writ-of-summon.pdf",
      fileSizeKb: 312,
      uploadedAt: new Date("2026-08-14"),
      notes: "Issued and served on 16 August 2026.",
      isEvidence: false,
    },
  });

  await db.document.create({
    data: {
      caseId: case1.id,
      title: "1992 Site Allocation Letter — Lands Commission",
      docType: "EVIDENCE",
      fileName: "lands-commission-1992.pdf",
      fileSizeKb: 845,
      uploadedAt: new Date("2026-09-02"),
      notes: "Original allocation in favour of plaintiff's late father.",
      isEvidence: true,
    },
  });

  await db.document.create({
    data: {
      caseId: case1.id,
      title: "2018 Statutory Declaration — Defendant",
      docType: "EVIDENCE",
      fileName: "stat-decl-2018.pdf",
      fileSizeKb: 478,
      uploadedAt: new Date("2026-09-30"),
      notes: "Defendant's declaration filed in opposition.",
      isEvidence: true,
    },
  });

  await db.milestone.create({
    data: {
      caseId: case1.id,
      title: "Case management conference",
      status: "DONE",
      eventDate: new Date("2026-09-20"),
      description: "Pleadings closed; directions given on disclosure.",
    },
  });

  await db.milestone.create({
    data: {
      caseId: case1.id,
      title: "Hearing — Plaintiff's evidence-in-chief",
      status: "IN_PROGRESS",
      eventDate: new Date("2026-11-18"),
      description: "PW1 and PW2 to testify; cross-examination by defendant.",
    },
  });

  await db.reminder.create({
    data: {
      caseId: case1.id,
      userId: lawyer.id,
      title: "File witness statement of PW2",
      dueAt: new Date("2026-11-10T17:00:00Z"),
      priority: "HIGH",
    },
  });

  await db.reminder.create({
    data: {
      caseId: case1.id,
      userId: lawyer.id,
      title: "Hearing — Plaintiff's evidence-in-chief",
      dueAt: new Date("2026-11-18T09:00:00Z"),
      priority: "CRITICAL",
    },
  });

  await db.invoice.create({
    data: {
      caseId: case1.id,
      userId: plaintiffUser.id,
      number: "INV-2026-0042",
      description: "Professional fees — pleadings & case management",
      amountCedi: 8500,
      status: "PARTIAL",
      issuedAt: new Date("2026-09-01"),
      dueAt: new Date("2026-11-30"),
    },
  });

  // ── Case 2 — Appeal ───────────────────────────────────────────────────
  const case2 = await db.case.create({
    data: {
      caseCode: "GLX-CS-2026-0021",
      title: "Apex Logistics Ltd v. Republic — Court of Appeal Appeal",
      caseType: "COMMERCIAL",
      suitType: "APPELLANT_RESPONDENT",
      court: "Court of Appeal, Accra",
      division: "Commercial",
      judgeId: judge.id,
      ownerId: lawyer.id,
      firmId: firm.id,
      status: "FILED",
      filedAt: new Date("2026-09-22"),
      nextHearingAt: new Date("2026-12-04T10:00:00Z"),
      description:
        "Appeal against the decision of the Commercial Division in respect of an arbitral award on a freight-forwarding contract.",
    },
  });

  await db.caseParty.create({
    data: {
      caseId: case2.id,
      partyRole: "APPELLANT",
      fullName: "Apex Logistics Ltd",
      contact: "PMB CT 142, Cantonments, Accra",
      legalCounsel: "Nana Adwoa Agyei",
    },
  });

  await db.caseParty.create({
    data: {
      caseId: case2.id,
      partyRole: "RESPONDENT",
      fullName: "The Republic (Attorney-General's Department)",
      legalCounsel: "Senior State Attorney, Commercial Division",
    },
  });

  await db.document.create({
    data: {
      caseId: case2.id,
      title: "Notice of Appeal & Grounds of Appeal",
      docType: "PLEADING",
      fileName: "notice-of-appeal.pdf",
      fileSizeKb: 220,
      uploadedAt: new Date("2026-09-22"),
      isEvidence: false,
    },
  });

  await db.milestone.create({
    data: {
      caseId: case2.id,
      title: "Compilation of record of appeal",
      status: "IN_PROGRESS",
      eventDate: new Date("2026-11-25"),
    },
  });

  await db.reminder.create({
    data: {
      caseId: case2.id,
      userId: lawyer.id,
      title: "Compile & file record of appeal",
      dueAt: new Date("2026-11-25T12:00:00Z"),
      priority: "HIGH",
    },
  });

  await db.invoice.create({
    data: {
      caseId: case2.id,
      userId: lawyer.id,
      number: "INV-2026-0051",
      description: "Appeal filing & drafting fees",
      amountCedi: 12000,
      status: "UNPAID",
      issuedAt: new Date("2026-10-01"),
      dueAt: new Date("2026-12-15"),
    },
  });

  // ── Case 3 — Family / probate ────────────────────────────────────────
  const case3 = await db.case.create({
    data: {
      caseCode: "GLX-CS-2026-0029",
      title: "In the Estate of the Late Owura Asante — Petition for Letters of Administration",
      caseType: "PROBATE",
      suitType: "PETITIONER_RESPONDENT",
      court: "High Court (Probate Division), Kumasi",
      division: "Probate & Administration",
      ownerId: lawyer.id,
      firmId: firm.id,
      status: "FILED",
      filedAt: new Date("2026-10-12"),
      nextHearingAt: new Date("2026-12-10T10:00:00Z"),
      description:
        "Petition for letters of administration in respect of the estate of the late Owura Asante, deceased 4 March 2026.",
    },
  });

  await db.caseParty.create({
    data: {
      caseId: case3.id,
      partyRole: "PETITIONER",
      fullName: "Adwoa Asante (eldest surviving child)",
      legalCounsel: "Nana Adwoa Agyei",
    },
  });

  await db.caseParty.create({
    data: {
      caseId: case3.id,
      partyRole: "RESPONDENT",
      fullName: "Public Trustees (Ghana)",
    },
  });

  await db.document.create({
    data: {
      caseId: case3.id,
      title: "Petition for Letters of Administration",
      docType: "PLEADING",
      fileName: "petition.pdf",
      fileSizeKb: 188,
      uploadedAt: new Date("2026-10-12"),
      isEvidence: false,
    },
  });

  await db.reminder.create({
    data: {
      caseId: case3.id,
      userId: lawyer.id,
      title: "Lodge death certificate & schedule of assets",
      dueAt: new Date("2026-11-15T12:00:00Z"),
      priority: "MEDIUM",
    },
  });

  await db.invoice.create({
    data: {
      caseId: case3.id,
      userId: lawyer.id,
      number: "INV-2026-0058",
      description: "Probate petition drafting & filing",
      amountCedi: 4200,
      status: "PAID",
      issuedAt: new Date("2026-10-12"),
      dueAt: new Date("2026-11-12"),
      paidAt: new Date("2026-10-28"),
    },
  });

  // ── Sample AI queries ────────────────────────────────────────────────
  await db.aiQuery.create({
    data: {
      question: "What is the limitation period for recovery of land in Ghana?",
      answer:
        "Under Section 12 of the Limitation Decree 1972 (NRCD 54), no action to recover land may be brought after the expiration of 12 years from the date on which the right of action accrued. Where the land is held in trust, the beneficiary's right is not barred by the trustee's possession.",
      verified: true,
      sources:
        "Limitation Decree, 1972 (NRCD 54) s. 12; Mensah v. Aryee [2009-2010] SCGLR 762",
    },
  });

  await db.aiQuery.create({
    data: {
      question: "What are the grounds for setting aside an arbitral award in Ghana?",
      answer:
        "Section 59 of the Alternative Dispute Resolution Act, 2010 (Act 798) lists the grounds for setting aside an arbitral award, including incapacity of a party, invalidity of the arbitration agreement, lack of proper notice, excess of authority, and conflict with the public policy of Ghana. The court may also set aside where the subject matter is not capable of settlement by arbitration under Ghanaian law.",
      verified: true,
      sources:
        "ADR Act, 2010 (Act 798) s. 59; Zoomlion Ghana Ltd v. ARL [2015] SCGLR 901",
    },
  });

  console.log("Seed completed.");
  console.log("Firm:", firm.name);
  console.log("Lawyer:", lawyer.fullName, "code:", lawyer.userCode);
  console.log("Judge:", judge.fullName, "code:", judge.userCode);
  console.log("Litigants:", plaintiffUser.userCode, defendantUser.userCode);
  console.log("Cases:", case1.caseCode, case2.caseCode, case3.caseCode);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

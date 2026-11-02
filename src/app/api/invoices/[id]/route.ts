import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/invoices/[id] — update status.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const status = (body?.status ?? "").toString().toUpperCase();
  const allowed = ["UNPAID", "PARTIAL", "PAID", "OVERDUE", "VOID"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const updated = await db.invoice.update({
    where: { id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });
  return NextResponse.json({ invoice: updated });
}

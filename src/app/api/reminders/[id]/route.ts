import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/reminders/[id] — toggle isDone.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const isDone = !!body?.isDone;
  const updated = await db.reminder.update({
    where: { id },
    data: { isDone },
  });
  return NextResponse.json({ reminder: updated });
}

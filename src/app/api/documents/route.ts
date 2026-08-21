import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { createDocument, listOwnedDocuments, listSharedDocuments } from "@/lib/documents";

export async function GET() {
  const userId = getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No current user" }, { status: 401 });

  const [owned, shared] = await Promise.all([
    listOwnedDocuments(userId),
    listSharedDocuments(userId),
  ]);
  return NextResponse.json({ owned, shared });
}

export async function POST(req: NextRequest) {
  const userId = getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No current user" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title : "Untitled Document";

  const document = await createDocument(userId, title);
  return NextResponse.json({ document }, { status: 201 });
}

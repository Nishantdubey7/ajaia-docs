import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { getDocumentForUser, updateDocument } from "@/lib/documents";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  const document = await getDocumentForUser(params.id, userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  return NextResponse.json({ document });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  const body = await req.json().catch(() => ({}));

  const document = await updateDocument(params.id, userId, {
    title: typeof body?.title === "string" ? body.title : undefined,
    content: typeof body?.content === "string" ? body.content : undefined,
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
  }
  return NextResponse.json({ document });
}

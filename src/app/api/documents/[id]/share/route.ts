import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { listShares, shareDocument } from "@/lib/documents";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  const shares = await listShares(params.id, userId);
  if (shares === null) {
    return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
  }
  return NextResponse.json({ shares });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  const body = await req.json().catch(() => ({}));
  const targetUserId = body?.userId as string | undefined;

  if (!targetUserId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const result = await shareDocument(params.id, userId, targetUserId);

  if ("error" in result) {
  const error = result.error ?? "not_found";

  const status =
    error === "not_found"
      ? 404
      : error === "forbidden"
        ? 403
        : 409;

  const messages: Record<string, string> = {
    not_found: "Document not found.",
    forbidden: "Only the owner can share this document.",
    cannot_share_with_owner: "This user already owns the document.",
    already_shared: "This document is already shared with that user.",
  };

  return NextResponse.json(
    { error: messages[error] },
    { status }
  );
}

  return NextResponse.json({ share: result.share }, { status: 201 });
}

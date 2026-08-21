import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/session";
import { createDocument } from "@/lib/documents";
import { ImportError, parseImportedText } from "@/lib/import";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const userId = getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No current user" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const raw = await file.text();
    const parsed = parseImportedText(file.name, raw);
    const document = await createDocument(userId, parsed.title, parsed.content);
    return NextResponse.json({ document }, { status: 201 });
  } catch (err) {
    if (err instanceof ImportError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to import file." }, { status: 500 });
  }
}

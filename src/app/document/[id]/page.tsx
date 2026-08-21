import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { getDocumentForUser } from "@/lib/documents";
import EditorClient from "./EditorClient";

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const userId = getCurrentUserId();
  // Server-side authorization: this call enforces owner-or-shared access.
  // An unauthorized or unauthenticated request gets the same 404 as a
  // nonexistent document, so private documents can never be confirmed to
  // exist by probing IDs.
  const document = await getDocumentForUser(params.id, userId);
  if (!document) notFound();

  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <EditorClient
      document={{
        id: document.id,
        title: document.title,
        content: document.content,
        ownerId: document.ownerId,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
      }}
      isOwner={document.ownerId === userId}
      users={users}
    />
  );
}

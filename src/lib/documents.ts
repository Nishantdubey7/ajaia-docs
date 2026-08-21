import { prisma } from "@/lib/prisma";
import { canAccessDocument } from "@/lib/authorization";

const EMPTY_DOC = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});

export async function listOwnedDocuments(userId: string) {
  return prisma.document.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function listSharedDocuments(userId: string) {
  const shares = await prisma.documentShare.findMany({
    where: { userId },
    include: { document: { include: { owner: true } } },
  });
  return shares
    .map((s) => s.document)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function createDocument(ownerId: string, title: string, content?: string) {
  return prisma.document.create({
    data: {
      title: title.trim() || "Untitled Document",
      content: content ?? EMPTY_DOC,
      ownerId,
    },
  });
}

/**
 * Loads a document together with its shares and enforces the access rule
 * server-side. Returns null if the document does not exist OR the
 * requesting user is not authorized — callers should treat both cases as
 * "not found" so unauthorized users cannot even confirm existence.
 */
export async function getDocumentForUser(documentId: string, userId: string | null) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { owner: true, shares: { include: { user: true } } },
  });
  if (!document) return null;
  const allowed = canAccessDocument({ document, shares: document.shares, userId });
  if (!allowed) return null;
  return document;
}

export async function updateDocument(
  documentId: string,
  userId: string | null,
  data: { title?: string; content?: string }
) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { shares: true },
  });
  if (!document) return null;
  const allowed = canAccessDocument({ document, shares: document.shares, userId });
  if (!allowed) return null;

  return prisma.document.update({
    where: { id: documentId },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() || "Untitled Document" } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
    },
  });
}

export async function shareDocument(documentId: string, ownerId: string | null, targetUserId: string) {
  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) return { error: "not_found" as const };
  // Only the owner may grant access — sharing itself is an owner-only action.
  if (!ownerId || document.ownerId !== ownerId) return { error: "forbidden" as const };
  if (targetUserId === document.ownerId) return { error: "cannot_share_with_owner" as const };

  const existing = await prisma.documentShare.findUnique({
    where: { documentId_userId: { documentId, userId: targetUserId } },
  });
  if (existing) return { error: "already_shared" as const };

  const share = await prisma.documentShare.create({
    data: { documentId, userId: targetUserId },
  });
  return { share };
}

export async function listShares(documentId: string, userId: string | null) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { shares: true },
  });
  if (!document) return null;
  const allowed = canAccessDocument({ document, shares: document.shares, userId });
  if (!allowed) return null;

  return prisma.documentShare.findMany({
    where: { documentId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

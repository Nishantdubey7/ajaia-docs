/**
 * Central authorization rule for document access.
 *
 * A user may access a document if and only if:
 *   document.ownerId === userId
 *   OR a DocumentShare row exists linking documentId <-> userId
 *
 * This function is intentionally pure (no DB calls) so it can be
 * unit-tested in isolation and reused identically by every server-side
 * entry point (API routes, server actions). All access checks MUST route
 * through this function rather than re-implementing the rule inline.
 */
export interface AccessCheckInput {
  document: { ownerId: string };
  shares: { userId: string }[];
  userId: string | null | undefined;
}

export function canAccessDocument({ document, shares, userId }: AccessCheckInput): boolean {
  if (!userId) return false;
  if (document.ownerId === userId) return true;
  return shares.some((share) => share.userId === userId);
}

export function isOwner(document: { ownerId: string }, userId: string | null | undefined): boolean {
  return !!userId && document.ownerId === userId;
}

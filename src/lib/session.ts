import { cookies } from "next/headers";

export const CURRENT_USER_COOKIE = "ajaia_current_user";

/**
 * Reads the "current user" for this demo session from a cookie.
 *
 * There is no real authentication in this assignment: the spec explicitly
 * calls for a lightweight demo-user switcher instead of OAuth. The cookie
 * is set server-side (see /api/session) so that every server component,
 * server action, and API route reads the SAME trusted value — the client
 * cannot spoof access by simply changing local UI state, since every
 * privileged read/write re-derives the user id from this cookie and runs
 * it through lib/authorization.ts on the server.
 */
export function getCurrentUserId(): string | null {
  const store = cookies();
  return store.get(CURRENT_USER_COOKIE)?.value ?? null;
}

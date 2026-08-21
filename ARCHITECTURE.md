# Architecture

## Diagram

```
Browser (React client components)
   ↓
Next.js App Router (server components + API routes)
   ↓
Server Actions / API Routes  (src/app/api/**)
   ↓
lib/documents.ts + lib/authorization.ts   (data access + access control)
   ↓
Prisma Client
   ↓
PostgreSQL
```

## Frontend

- Next.js App Router. Pages that need authorized data (`/dashboard`,
  `/document/[id]`) are server components that read the current demo user
  from a cookie and pre-check access before rendering, then hand data to a
  thin client component (`DashboardClient.tsx`, `EditorClient.tsx`) for
  interactivity.
- Tiptap (`@tiptap/react` + `starter-kit` + `extension-underline`) provides
  the rich-text editor. Content is stored and round-tripped as Tiptap JSON
  (not HTML), which keeps persistence lossless and avoids HTML-sanitization
  concerns.
- Tailwind CSS for styling; no component library, kept intentionally plain.

## Backend

- Plain Next.js Route Handlers under `src/app/api/**` — no separate backend
  service. Each route is a thin wrapper: read the current user from the
  cookie, delegate to `src/lib/documents.ts`, translate the result to an
  HTTP response.
- All business logic that touches the database lives in
  `src/lib/documents.ts`, so API routes and (if added later) server actions
  can't drift into re-implementing the rules differently.

## Database (Prisma + PostgreSQL)

Three models: `User`, `Document`, `DocumentShare`. `DocumentShare` has a
compound unique index on `(documentId, userId)` so a document can't be
shared with the same user twice (enforced at the DB layer, not just in
application code). Indexes exist on the foreign-key columns
(`Document.ownerId`, `DocumentShare.userId`, `DocumentShare.documentId`)
since those are the columns every list/lookup query filters on.

## Sharing / Access Model

The single source of truth for "can this user open this document" is
`canAccessDocument()` in `src/lib/authorization.ts`:

```ts
function canAccessDocument({ document, shares, userId }) {
  if (!userId) return false;
  if (document.ownerId === userId) return true;
  return shares.some((s) => s.userId === userId);
}
```

This function is pure (no DB calls), which is what makes it unit-testable
in isolation (`tests/authorization.test.ts`) while still being the exact
function every data-access function in `lib/documents.ts` calls before
returning a document, updating it, or listing its shares. There's no
separate "trust the frontend" path — a request for a document the current
user can't access returns 404, identical to a nonexistent document, so an
unauthorized user can't even distinguish "doesn't exist" from "exists but
you can't see it."

Sharing itself (granting new access) is restricted further: only the
document's owner may call the share endpoint successfully — a shared user
can view/edit content but cannot re-share.

## Demo-User "Authentication"

There is no password-based or OAuth authentication. `POST /api/session`
looks up a user by id and sets an httpOnly cookie
(`ajaia_current_user`). Every server component and API route reads that
cookie via `getCurrentUserId()` — the client never sends a user id that the
server just trusts; it only ever sends a *choice* of which seeded user to
become, and the server treats that cookie as the identity for all
subsequent authorization checks. This is explicitly a demo mechanism, not
a security boundary against a malicious client on someone else's machine —
acceptable given the assignment's explicit "no OAuth" scope.

## Persistence

- Document content is autosaved: the editor debounces `onUpdate` (~800ms)
  and PATCHes the document's `content` field as a JSON string. Title edits
  are debounced separately (~600ms).
- Refresh-persistence works because content is always read from Postgres
  on page load (server component), not from client-side state.

## Important Engineering Decisions & Tradeoffs

- **Tiptap JSON over HTML**: avoids re-parsing/sanitizing HTML on every
  load and keeps the storage format aligned with what the editor already
  produces.
- **Cookie-based demo user over localStorage**: keeps the "current user"
  available to server components (which can't read localStorage), which is
  what lets authorization be enforced server-side rather than the client
  just hiding UI.
- **One shared `canAccessDocument` function**: chosen specifically so the
  automated test in Requirement 8 exercises the same code path production
  traffic uses, instead of a parallel reimplementation that could drift.
- **`.md` import is intentionally shallow** (headings, bullets, paragraphs
  only — no tables, nested lists, links, or inline formatting parsing) per
  the assignment's explicit guidance not to over-invest in parsing.

## What Was Intentionally Deprioritized

Per the assignment's constraints: no real-time collaboration, no OAuth, no
comments/version history, no complex DOCX/PDF import, minimal animation.

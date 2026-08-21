# Ajaia Docs — Submission

## Live Application

NOT DEPLOYED

No deployment credentials/hosted database were available in the authoring
environment. The project is deployment-ready — see "Deployment" in
README.md for the exact Vercel + Postgres steps.

## Source Code

Included in this submission package.

## Demo Users

- Nishant Dubey
- Rahul Sharma
- Priya Mehta

## Implemented Features

- Create, rename, edit, save, and reopen documents; content persists across refresh (Prisma/PostgreSQL).
- Tiptap rich-text editor: bold, italic, underline, H1, H2, bullet list, numbered list, undo, redo.
- File import for `.txt` (full) and `.md` (headings/bullets/paragraphs), with validation for unsupported types, empty files, and import failures.
- Demo-user switcher (cookie-based) standing in for OAuth.
- Sharing: owner shares a document with another seeded user; duplicate shares are prevented (DB unique constraint + app-level check); "people with access" list shows owner + shared users.
- Server-side authorization on every document read/write: a user can access a document only if they own it or it's been shared with them — enforced in `lib/authorization.ts` and used by every API route, not just the UI.
- Dashboard with "My Documents" / "Shared With Me", last-updated times, owner/shared badges, empty states, loading states, and error states.
- Automated test (`tests/authorization.test.ts`) covering the exact scenario in Requirement 8, plus import validation.

## Reviewer Test Flow

1. Select Nishant.
2. Create a document.
3. Add formatted text (bold, a heading, a bullet list).
4. Save (autosaves ~800ms after you stop typing).
5. Refresh and verify persistence.
6. Rename the document from the editor header.
7. Go back to the dashboard, click Import, and import a `.txt` file.
8. Open a document you own, click Share, and share it with Rahul.
9. Switch the user dropdown to Rahul.
10. Open "Shared With Me" and confirm the document appears and opens.
11. Switch to Priya and confirm she cannot open that document (and it does not appear in her lists) unless it is explicitly shared with her too.

## Known Limitations

- No real authentication — demo-user switcher only, by design.
- No real-time collaboration, comments, or version history — explicitly out of scope per the assignment.
- `.md` import is a light structural parser (headings, bullets, paragraphs), not a full CommonMark implementation.
- Concurrent edits to the same document from two sessions use last-write-wins; there's no merge or conflict UI.
- **Not machine-verified**: the authoring sandbox had no network access, so `npm install`/`lint`/`typecheck`/`test`/`build` could not actually be run here. Run them yourself after `npm install` in a normal environment before treating this as a verified build — see README.md.

## Future Improvements

- Real authentication (e.g. NextAuth) in place of the demo-user switcher.
- Revoke-share and change-permission-level controls in the share dialog.
- A richer `.md` importer (tables, nested lists, links, inline formatting).
- Optimistic UI + conflict detection for concurrent edits.

## AI Workflow

See AI_WORKFLOW.md.

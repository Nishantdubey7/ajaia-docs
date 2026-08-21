# Video Walkthrough Script (3–5 minutes)

**1. Product overview (20s)**
"This is Ajaia Docs — a lightweight collaborative document editor. It lets
you create, edit, import, and share rich-text documents, with sharing
access enforced on the server, not just hidden in the UI."

**2. Dashboard (25s)**
"Here's the dashboard. Up top, Ajaia Docs branding and a user switcher —
since this is a demo without real login, I can switch between three seeded
users: Nishant, Rahul, and Priya. Below that, 'My Documents' and 'Shared
With Me,' each showing last-edited time and an owner or shared badge."

**3. Create document (20s)**
"I'll click 'New Document.' That creates a document owned by the current
user and drops me straight into the editor."

**4. Rich-text editing (30s)**
"The toolbar has bold, italic, underline, two heading levels, bullet and
numbered lists, and undo/redo. I'll add a heading, some bold text, and a
bullet list to show it all works together."

**5. Persistence (25s)**
"Content autosaves a moment after I stop typing — you can see the status
indicator change to 'Saved.' If I refresh the page right now..." *(refresh)*
"...everything's still here, because it's persisted to Postgres via
Prisma, not just kept in browser memory."

**6. File import (30s)**
"Back on the dashboard, I'll click Import. It only accepts .txt and .md —
I'll pick a .txt file. It validates the file, converts it into an editable
document, and opens it straight in the editor."

**7. Sharing (35s)**
"On any document I own, there's a Share button. I'll open it and share this
document with Rahul. The dialog shows who currently has access — right now
just me as owner."

**8. User switching / access control (35s)**
"I'll switch the current user to Rahul. Under 'Shared With Me,' the
document I just shared now shows up, and he can open and edit it. Now I'll
switch to Priya — she has no access, and the document doesn't appear in
either of her lists. That's enforced on the server: even if she guessed the
document's URL, the server checks ownership and share records before
returning anything, so there's no way around it from the client."

**9. Architecture (25s)**
"Under the hood: Next.js App Router for both frontend and API routes,
Prisma against PostgreSQL, and Tiptap for the editor, storing content as
structured JSON rather than raw HTML."

**10. Scope decisions (20s)**
"By design, this doesn't include real-time collaboration, comments,
version history, or OAuth — those were explicitly out of scope so I could
focus on a solid, correctly-authorized core experience."

**11. AI workflow (20s)**
"AI assistance was used throughout — for scaffolding, implementation, and
documentation — with the architecture, authorization logic, and UX
reviewed and adjusted by hand rather than accepted as-is."

**12. Limitations / close (15s)**
"Known limitations and next steps are documented in SUBMISSION.md — things
like richer markdown import and real authentication. That's Ajaia Docs —
thanks for watching."

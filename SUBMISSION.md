# Ajaia Docs - Submission

## Live Application

https://ajaia-docs-three-alpha.vercel.app/dashboard

The application is deployed on Vercel and connected to PostgreSQL via Supabase.

## Source Code

GitHub repository:

https://github.com/Nishantdubey7/ajaia-docs

The repository contains the complete source code, Prisma schema and migrations,
automated tests, configuration, and project documentation.

## Demo Users

The application includes three seeded demo users:

- Nishant Dubey
- Rahul Sharma
- Priya Mehta

There are no passwords. A user switcher is intentionally used as a lightweight
authentication simulation for this assignment.

## Implemented Features

### Document Creation and Editing

- Create new documents.
- Rename documents.
- Edit documents in the browser.
- Autosave document changes.
- Reopen documents after navigation or refresh.
- Persist document content using PostgreSQL and Prisma.

### Rich Text Editing

The editor is implemented using Tiptap and supports:

- Bold
- Italic
- Underline
- H1 headings
- H2 headings
- Bulleted lists
- Numbered lists
- Undo
- Redo

Document content is stored as structured editor JSON.

### File Import

Supported formats:

- `.txt`
- `.md`

TXT files are imported as editable document content.

Markdown files support lightweight structural parsing for:

- Headings
- Bullets
- Paragraphs

The application validates unsupported file types and empty files.

### Sharing

Document owners can share documents with other seeded users.

The sharing workflow includes:

- Document ownership
- Explicit user sharing
- Shared document listing
- Duplicate-share prevention
- Owner and shared-user visibility
- Server-side access control

### Authorization

Authorization is enforced on the server rather than relying only on
frontend visibility.

A user can access a document only when:

1. They own the document, or
2. The document has explicitly been shared with them.

Unauthorized document access is rejected by the server.

### Dashboard

The dashboard provides:

- My Documents
- Shared With Me
- Last-updated information
- Owner/shared indicators
- Loading states
- Empty states
- Error states
- Demo-user switching

## Reviewer Test Flow

### 1. Create and edit a document

1. Select Nishant Dubey.
2. Click New Document.
3. Add a heading.
4. Add bold text.
5. Add a bullet list.
6. Stop typing and allow autosave to complete.
7. Refresh the page.
8. Confirm the document and formatting persist.

### 2. Rename a document

1. Open the document.
2. Rename it from the editor header.
3. Return to the dashboard.
4. Confirm the updated title is displayed.

### 3. Import a file

1. Return to the dashboard.
2. Click Import.
3. Select a `.txt` file.
4. Confirm the imported content becomes a new editable document.

### 4. Share a document

1. Select Nishant Dubey.
2. Open a document owned by Nishant.
3. Click Share.
4. Share the document with Rahul Sharma.
5. Switch the current user to Rahul Sharma.
6. Open Shared With Me.
7. Confirm the shared document appears and can be opened.

### 5. Verify authorization

1. Switch the current user to Priya Mehta.
2. Confirm the document shared only with Rahul does not appear in Priya's
   accessible documents.
3. Document access is also protected server-side, so knowing a document ID
   does not bypass authorization.

## Verification

The application was fully verified locally before deployment.

### Local Verification

- `npm install` - PASS
- `npm run typecheck` - PASS
- `npm run lint` - PASS
- `npm test` - PASS
- Automated tests: 9/9 PASS
- `npm run build` - PASS
- Prisma database setup - PASS
- PostgreSQL/Supabase connection - PASS
- Demo-user seeding - PASS
- Manual end-to-end testing - PASS

### Production Verification

The deployed Vercel application was manually tested for:

- Dashboard loading
- Demo-user switching
- Document creation
- Rich-text editing
- Autosave
- Document persistence
- Document renaming
- TXT file import
- Document sharing
- Shared With Me workflow
- Server-side access control

Production URL:

https://ajaia-docs-three-alpha.vercel.app/dashboard

## Automated Tests

The Vitest test suite contains 9 passing tests covering:

- Owner document access
- Access denial before sharing
- Access after explicit sharing
- Unauthorized third-party access
- No-current-user authorization
- Owner/share relationship behavior
- Unsupported file validation
- Empty file validation
- TXT file parsing

Command:

```bash
npm test
```

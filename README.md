# Ajaia Docs

A lightweight collaborative document editor built for the Ajaia LLC AI-Native Full Stack Developer Assignment.

## Overview

Ajaia Docs is a focused Google Docs-inspired document editor that supports document creation, rich-text editing, file import, persistence, and document sharing.

There is no real authentication. A scoped demo-user switcher represents different users, allowing the sharing and authorization flows to be demonstrated without introducing unnecessary authentication infrastructure.

Access control is enforced server-side.

## Features

- Create, rename, edit, save, and reopen documents
- Persistent document storage using PostgreSQL
- Rich-text editing with Tiptap:
  - Bold
  - Italic
  - Underline
  - H1 / H2 headings
  - Bulleted lists
  - Numbered lists
  - Undo / redo
- Import `.txt` files into editable documents
- Import `.md` files with lightweight parsing for headings, bullets, and paragraphs
- Share documents with other demo users
- Server-side authorization for document access and sharing
- Dashboard with:
  - My Documents
  - Shared With Me
  - Last-updated information
  - Owner/shared indicators
  - Loading, empty, and error states
- Demo-user switcher:
  - Nishant Dubey
  - Rahul Sharma
  - Priya Mehta

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- Tiptap
- Prisma
- PostgreSQL / Supabase
- Vitest

## Architecture

```text
Browser
   ↓
Next.js App Router
   ↓
API Routes
   ↓
Document / Authorization Services
   ↓
Prisma
   ↓
PostgreSQL
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the detailed architecture and design decisions.

## Requirements

- Node.js 20+
- PostgreSQL database
- npm

Supabase PostgreSQL is recommended for a quick setup and is also suitable for deployment.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set the PostgreSQL connection string:

```env
DATABASE_URL="your-postgresql-connection-string"
```

If using Supabase with separate pooled and direct connections, configure `DIRECT_URL` as required by your Prisma/Supabase setup.

> Never commit `.env` or production database credentials to GitHub.

### 3. Set up the database

Apply the existing Prisma migrations:

```bash
npm run db:deploy
```

Seed the demo users:

```bash
npm run db:seed
```

### 4. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Demo Users

The seeded demo users are:

- Nishant Dubey
- Rahul Sharma
- Priya Mehta

Use the user switcher in the dashboard/editor to demonstrate ownership and sharing behavior.

There are no passwords because this is a scoped demonstration mechanism rather than real authentication.

## Sharing and Authorization

A document has one owner and can be explicitly shared with other seeded users.

The application enforces document access server-side:

- Owners can read and modify their documents.
- Users can access documents explicitly shared with them.
- Users who have not been granted access cannot access the document.
- Only document owners can share documents.

This keeps the authorization logic separate from the UI and prevents the frontend user switcher from being treated as a security boundary.

## File Import

The application supports:

- `.txt` — full text import
- `.md` — lightweight structural parsing for headings, bullets, and paragraphs

Unsupported file types and empty files are rejected with validation errors.

## Testing

Run:

```bash
npm test
```

The automated test suite covers:

- Owner document access
- Access denial before sharing
- Access after explicit sharing
- Access denial for an unrelated user
- Access with no selected user
- Owner handling
- File extension validation
- Empty file validation
- `.txt` parsing

### Verification Status

The application has been verified locally with:

| Check                          | Result       |
| ------------------------------ | ------------ |
| Dependency installation        | PASS         |
| TypeScript typecheck           | PASS         |
| ESLint                         | PASS         |
| Automated tests                | **9/9 PASS** |
| Production build               | PASS         |
| PostgreSQL/Supabase connection | PASS         |
| Prisma database setup          | PASS         |
| Demo-user seeding              | PASS         |
| Manual end-to-end testing      | PASS         |

## Build

Create an optimized production build:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

## Lint / Typecheck

```bash
npm run lint
npm run typecheck
```

## Database Commands

Generate Prisma Client:

```bash
npm run db:generate
```

Apply existing migrations:

```bash
npm run db:deploy
```

Seed demo users:

```bash
npm run db:seed
```

For local development, `npx prisma db push` can also be used when working against a fresh development database.

## Deployment

The application is designed for deployment on Vercel with PostgreSQL/Supabase.

Deployment steps:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Configure the required PostgreSQL environment variables in Vercel.
4. Apply the Prisma migrations to the production database.
5. Seed the demo users.
6. Deploy the application.
7. Verify the production application end to end.

Production credentials must be configured through the deployment platform and must never be committed to the repository.

## Known Limitations

The following features were intentionally deprioritized to stay within the assignment timebox:

- No real OAuth/authentication
- No real-time multi-user collaboration
- No comments or suggestion mode
- No document version history
- No automatic conflict resolution between simultaneous edits
- Markdown import uses lightweight structural parsing rather than a full CommonMark implementation

These scope cuts allowed the core document creation, editing, persistence, file import, sharing, and authorization workflows to be completed and verified.

## AI Workflow

AI tools were used as development accelerators for implementation, debugging, documentation, and iteration.

See [AI_WORKFLOW.md](./AI_WORKFLOW.md) for details on:

- AI tools used
- Where AI materially accelerated development
- AI-generated output that was modified or rejected
- How correctness, UX quality, and implementation reliability were verified

## Architecture Note

See [ARCHITECTURE.md](./ARCHITECTURE.md) for:

- System architecture
- Data model
- Authorization approach
- Persistence strategy
- File import design
- Key tradeoffs
- Scope decisions

## Submission

See [SUBMISSION.md](./SUBMISSION.md) for the final submission details, live deployment URL, walkthrough video, demo users, and scope notes.

## Project Structure

```text
ajaia-docs/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   └── document/
│   ├── components/
│   └── lib/
├── tests/
│   └── authorization.test.ts
├── AI_WORKFLOW.md
├── ARCHITECTURE.md
├── README.md
├── SUBMISSION.md
├── VIDEO_SCRIPT.md
├── VIDEO_URL.txt
├── package.json
└── .env.example
```

## Security / Secrets

The repository intentionally excludes:

```text
.env
.env.local
node_modules/
.next/
```

Database credentials are provided through environment variables and are never committed to source control.

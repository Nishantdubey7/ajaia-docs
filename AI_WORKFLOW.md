# AI Workflow

This project was built with AI assistance (Claude) as part of an
AI-native development workflow.

## How AI Was Used

- **Implementation acceleration**: generating the initial Next.js/Prisma/
  Tiptap project scaffold (config files, directory layout, boilerplate API
  route handlers) quickly, rather than typing every file by hand.
- **Scaffolding**: the Prisma schema, migration SQL, seed script, and the
  set of API routes were drafted by AI from the written requirements, then
  reviewed against the spec.
- **Debugging / correctness passes**: reasoning through edge cases in the
  authorization rule (owner vs. shared vs. neither, missing current user)
  and the file-import validation (empty file, unsupported extension) was
  done collaboratively with AI to make sure the logic matched the spec's
  described flow.
- **Exploring implementation approaches**: e.g., deciding between storing
  editor content as HTML vs. Tiptap JSON, and between localStorage vs. a
  server-readable cookie for the demo-user switcher — AI laid out the
  tradeoffs, a decision was made, and the implementation followed it.
- **Documentation**: this file, the README, ARCHITECTURE.md, and
  SUBMISSION.md were drafted by AI and reviewed for accuracy against what
  was actually built.

## What Was Reviewed / Verified

- The architecture and data model were checked against the assignment's
  explicit schema and access-control requirements line by line.
- The single authorization function (`canAccessDocument`) was deliberately
  centralized so that both the API routes and the automated test exercise
  the same logic — this design choice was made to avoid the failure mode
  of AI-generated code duplicating a security check in two places that
  quietly drift apart.
- Generated code was inspected file-by-file rather than accepted as a
  single undifferentiated blob, and adjusted where it didn't match the
  assignment's specific flows (e.g., restricting the share endpoint to
  owner-only, returning 404 rather than 403 for unauthorized document
  reads so existence isn't leaked).
- UX flows (create → edit → save → refresh → rename → import → share →
  switch user → verify isolation) were walked through against the
  written Reviewer Test Flow in SUBMISSION.md.
- Unnecessary AI-suggested complexity was rejected — e.g., a full
  CommonMark parser for `.md` import was scoped down to the simple
  heading/bullet/paragraph parser the assignment calls for, and no
  real-time sync, comments, or version history were added, per the
  assignment's explicit exclusions.

## Honesty Note on Execution

The authoring environment used for this submission had no network access,
so `npm install`, `npm run lint`, `npm run typecheck`, `npm test`, and
`npm run build` could not actually be executed there. The source was
written carefully and reviewed for internal consistency, but it has not
been machine-verified by a real install/build/test run. This is disclosed
plainly rather than reporting a fabricated pass. See SUBMISSION.md for
what a reviewer should run to verify it themselves.

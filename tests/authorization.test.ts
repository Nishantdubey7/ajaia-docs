import { describe, expect, it } from "vitest";
import { canAccessDocument, isOwner } from "@/lib/authorization";

/**
 * Exercises the exact rule the assignment specifies:
 *
 *   Nishant owns document
 *   -> Nishant shares document with Rahul
 *   -> Rahul can access document
 *   -> Priya cannot access document
 *
 * This is the same `canAccessDocument` function imported and used by every
 * API route in src/app/api/documents, so this test covers the real
 * authorization path, not a reimplementation of it.
 */
describe("document sharing authorization", () => {
  const NISHANT = "user_nishant";
  const RAHUL = "user_rahul";
  const PRIYA = "user_priya";

  const document = { ownerId: NISHANT };

  it("lets the owner access their own document", () => {
    expect(canAccessDocument({ document, shares: [], userId: NISHANT })).toBe(true);
    expect(isOwner(document, NISHANT)).toBe(true);
  });

  it("denies access before any share exists", () => {
    expect(canAccessDocument({ document, shares: [], userId: RAHUL })).toBe(false);
  });

  it("grants access to a user the owner explicitly shared with", () => {
    const shares = [{ userId: RAHUL }];
    expect(canAccessDocument({ document, shares, userId: RAHUL })).toBe(true);
  });

  it("keeps the document private from a user who was never shared with", () => {
    const shares = [{ userId: RAHUL }];
    expect(canAccessDocument({ document, shares, userId: PRIYA })).toBe(false);
  });

  it("denies access with no current user selected", () => {
    const shares = [{ userId: RAHUL }];
    expect(canAccessDocument({ document, shares, userId: null })).toBe(false);
    expect(canAccessDocument({ document, shares, userId: undefined })).toBe(false);
  });

  it("does not treat the owner as needing a share row", () => {
    expect(isOwner(document, RAHUL)).toBe(false);
  });
});

describe("file import validation", () => {
  it("rejects unsupported extensions and accepts .txt/.md", async () => {
    const { isSupportedExtension, getExtension } = await import("@/lib/import");
    expect(isSupportedExtension(getExtension("notes.txt"))).toBe(true);
    expect(isSupportedExtension(getExtension("notes.md"))).toBe(true);
    expect(isSupportedExtension(getExtension("notes.docx"))).toBe(false);
    expect(isSupportedExtension(getExtension("notes.pdf"))).toBe(false);
  });

  it("rejects empty file content", async () => {
    const { parseImportedText, ImportError } = await import("@/lib/import");
    expect(() => parseImportedText("notes.txt", "   \n  ")).toThrow(ImportError);
  });

  it("parses a .txt file into paragraph nodes", async () => {
    const { parseImportedText } = await import("@/lib/import");
    const result = parseImportedText("My Notes.txt", "Hello world\nSecond line");
    const json = JSON.parse(result.content);
    expect(result.title).toBe("My Notes");
    expect(json.type).toBe("doc");
    expect(json.content.length).toBe(2);
    expect(json.content[0].type).toBe("paragraph");
  });
});

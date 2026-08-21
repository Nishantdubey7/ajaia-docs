export type ImportedDoc = {
  title: string;
  content: string; // Tiptap JSON, stringified
};

export class ImportError extends Error {}

const SUPPORTED_EXTENSIONS = ["txt", "md"];

export function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function isSupportedExtension(ext: string): boolean {
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * Converts raw .txt or .md text into Tiptap JSON. Intentionally simple:
 * .txt becomes one paragraph per non-empty line; .md gets light structural
 * parsing (headings + paragraphs) without a full markdown AST, per the
 * assignment's "do not over-invest in parsing" guidance.
 */
export function parseImportedText(filename: string, raw: string): ImportedDoc {
  const ext = getExtension(filename);
  if (!isSupportedExtension(ext)) {
    throw new ImportError(`Unsupported file type ".${ext || "unknown"}". Supported types: .txt, .md`);
  }
  if (!raw || !raw.trim()) {
    throw new ImportError("The selected file is empty.");
  }

  const title = filename.replace(/\.(txt|md)$/i, "").trim() || "Imported Document";
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  const nodes: Record<string, unknown>[] = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (ext === "md") {
      const h1 = line.match(/^#\s+(.*)/);
      const h2 = line.match(/^##\s+(.*)/);
      const bullet = line.match(/^[-*]\s+(.*)/);
      if (h1) {
        nodes.push(headingNode(1, h1[1]));
        continue;
      }
      if (h2) {
        nodes.push(headingNode(2, h2[1]));
        continue;
      }
      if (bullet) {
        nodes.push(bulletNode(bullet[1]));
        continue;
      }
    }
    nodes.push(paragraphNode(line));
  }

  if (nodes.length === 0) {
    throw new ImportError("The selected file has no readable text content.");
  }

  return {
    title,
    content: JSON.stringify({ type: "doc", content: mergeBullets(nodes) }),
  };
}

function paragraphNode(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}
function headingNode(level: 1 | 2, text: string) {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}
function bulletNode(text: string) {
  return {
    type: "__bullet_item",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  };
}

// Groups consecutive synthetic __bullet_item nodes into a single bulletList.
function mergeBullets(nodes: Record<string, unknown>[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  let currentList: Record<string, unknown>[] | null = null;

  for (const node of nodes) {
    if (node.type === "__bullet_item") {
      const item = { type: "listItem", content: node.content };
      if (!currentList) {
        currentList = [];
        out.push({ type: "bulletList", content: currentList });
      }
      currentList.push(item);
    } else {
      currentList = null;
      out.push(node);
    }
  }
  return out;
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useCallback, useEffect, useRef, useState } from "react";
import Toolbar from "@/components/Toolbar";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function Editor({
  documentId,
  initialContent,
  onStatusChange,
}: {
  documentId: string;
  initialContent: string;
  onStatusChange: (status: SaveStatus) => void;
}) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [initialJson] = useState(() => {
    try {
      return JSON.parse(initialContent);
    } catch {
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
  });

  const save = useCallback(
    async (json: unknown) => {
      onStatusChange("saving");
      try {
        const res = await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: JSON.stringify(json) }),
        });
        onStatusChange(res.ok ? "saved" : "error");
      } catch {
        onStatusChange("error");
      }
    },
    [documentId, onStatusChange]
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialJson,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        save(editor.getJSON());
      }, 800);
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <Toolbar editor={editor} />
      <div className="px-6 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

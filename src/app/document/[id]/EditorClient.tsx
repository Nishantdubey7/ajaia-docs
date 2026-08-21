"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Editor, { SaveStatus } from "@/components/Editor";
import ShareDialog from "@/components/ShareDialog";
import type { DocumentDTO, UserDTO } from "@/lib/types";

export default function EditorClient({
  document,
  isOwner,
  users,
}: {
  document: DocumentDTO;
  isOwner: boolean;
  users: UserDTO[];
}) {
  const [title, setTitle] = useState(document.title);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [showShare, setShowShare] = useState(false);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveTitle = useCallback(
    (value: string) => {
      if (titleTimer.current) clearTimeout(titleTimer.current);
      titleTimer.current = setTimeout(async () => {
        setStatus("saving");
        try {
          const res = await fetch(`/api/documents/${document.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: value }),
          });
          setStatus(res.ok ? "saved" : "error");
        } catch {
          setStatus("error");
        }
      }, 600);
    },
    [document.id]
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/dashboard" className="shrink-0 text-sm text-slate-500 hover:text-slate-800">
            ← Dashboard
          </Link>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              saveTitle(e.target.value);
            }}
            className="min-w-0 flex-1 truncate border-none bg-transparent text-lg font-medium text-slate-900 outline-none focus:ring-0"
            aria-label="Document title"
          />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StatusPill status={status} />
          <button
            onClick={() => setShowShare(true)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Share
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <Editor documentId={document.id} initialContent={document.content} onStatusChange={setStatus} />
        {!isOwner && (
          <p className="mt-3 text-xs text-slate-400">
            Shared document — you can view and edit, but only the owner can manage sharing.
          </p>
        )}
      </main>

      {showShare && (
        <ShareDialog
          documentId={document.id}
          ownerId={document.ownerId}
          allUsers={users}
          onClose={() => setShowShare(false)}
          canManage={isOwner}
        />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: SaveStatus }) {
  const label =
    status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "";
  if (!label) return null;
  const color =
    status === "error" ? "text-red-600" : status === "saving" ? "text-slate-400" : "text-emerald-600";
  return <span className={`text-xs ${color}`}>{label}</span>;
}

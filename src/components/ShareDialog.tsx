"use client";

import { useEffect, useState } from "react";
import type { ShareDTO, UserDTO } from "@/lib/types";

export default function ShareDialog({
  documentId,
  ownerId,
  allUsers,
  onClose,
  canManage,
}: {
  documentId: string;
  ownerId: string;
  allUsers: UserDTO[];
  onClose: () => void;
  canManage: boolean;
}) {
  const [shares, setShares] = useState<ShareDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");

  async function loadShares() {
    setLoading(true);
    const res = await fetch(`/api/documents/${documentId}/share`);
    const data = await res.json();
    if (res.ok) setShares(data.shares);
    setLoading(false);
  }

  useEffect(() => {
    loadShares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const owner = allUsers.find((u) => u.id === ownerId);
  const shareable = allUsers.filter(
    (u) => u.id !== ownerId && !shares.some((s) => s.userId === u.id)
  );

  async function addShare() {
    if (!selected) return;
    setError(null);
    const res = await fetch(`/api/documents/${documentId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not share document.");
      return;
    }
    setSelected("");
    loadShares();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Share document</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase text-slate-400">People with access</p>
          <ul className="space-y-2">
            {owner && (
              <li className="flex items-center justify-between text-sm">
                <span>{owner.name}</span>
                <span className="text-xs text-slate-400">Owner</span>
              </li>
            )}
            {loading && <li className="text-sm text-slate-400">Loading…</li>}
            {!loading &&
              shares.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.user.name}</span>
                  <span className="text-xs text-slate-400">Can edit</span>
                </li>
              ))}
            {!loading && shares.length === 0 && (
              <li className="text-sm text-slate-400">Not shared with anyone yet.</li>
            )}
          </ul>
        </div>

        {canManage && shareable.length > 0 && (
          <div className="mt-5 flex gap-2">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">Select a person…</option>
              {shareable.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <button
              onClick={addShare}
              disabled={!selected}
              className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Share
            </button>
          </div>
        )}

        {!canManage && (
          <p className="mt-4 text-xs text-slate-400">Only the owner can add people to this document.</p>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

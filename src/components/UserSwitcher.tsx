"use client";

import { useState } from "react";
import type { UserDTO } from "@/lib/types";

export default function UserSwitcher({
  users,
  currentUser,
  onSwitched,
}: {
  users: UserDTO[];
  currentUser: UserDTO | null;
  onSwitched: (user: UserDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  async function switchTo(userId: string) {
    setSwitching(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onSwitched(data.user);
      }
    } finally {
      setSwitching(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={switching}
        className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
          {currentUser ? currentUser.name.charAt(0) : "?"}
        </span>
        {currentUser ? currentUser.name : "Select user"}
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => switchTo(u.id)}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                currentUser?.id === u.id ? "font-semibold text-brand-600" : "text-slate-700"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

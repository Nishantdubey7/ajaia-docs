"use client";

import { useRouter } from "next/navigation";
import type { DocumentDTO } from "@/lib/types";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default function DocumentCard({
  document,
  variant,
  ownerName,
}: {
  document: DocumentDTO;
  variant: "owned" | "shared";
  ownerName?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/document/${document.id}`)}
      className="group flex w-full flex-col items-start rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand-500 hover:shadow-md"
    >
      <span className="line-clamp-1 font-medium text-slate-900 group-hover:text-brand-600">
        {document.title || "Untitled Document"}
      </span>
      <span className="mt-1 text-xs text-slate-500">Edited {timeAgo(document.updatedAt)}</span>
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
          variant === "owned" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
        }`}
      >
        {variant === "owned" ? "Owner" : `Shared by ${ownerName ?? "someone"}`}
      </span>
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSwitcher from "@/components/UserSwitcher";
import DocumentCard from "@/components/DocumentCard";
import ImportDialog from "@/components/ImportDialog";
import type { DocumentDTO, UserDTO } from "@/lib/types";

export default function DashboardClient({
  initialUsers,
  initialCurrentUser,
}: {
  initialUsers: UserDTO[];
  initialCurrentUser: UserDTO | null;
}) {
  const router = useRouter();
  const [users] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(initialCurrentUser);
  const [owned, setOwned] = useState<DocumentDTO[] | null>(null);
  const [shared, setShared] = useState<DocumentDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [creating, setCreating] = useState(false);

  // Bootstrap: if no demo user is selected yet, default to the first one.
  useEffect(() => {
    if (!currentUser && users.length > 0) {
      fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: users[0].id }),
      })
        .then((r) => r.json())
        .then((data) => data.user && setCurrentUser(data.user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  async function loadDocuments() {
    setError(null);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not load documents.");
        return;
      }
      setOwned(data.owned);
      setShared(data.shared);
    } catch {
      setError("Could not load documents.");
    }
  }

  useEffect(() => {
    if (currentUser) loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  async function handleNewDocument() {
    setCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Document" }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/document/${data.document.id}`);
    } finally {
      setCreating(false);
    }
  }

  const loading = currentUser && (owned === null || shared === null);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <h1 className="text-lg font-semibold text-brand-700">Ajaia Docs</h1>
        <UserSwitcher
          users={users}
          currentUser={currentUser}
          onSwitched={(user) => {
            setCurrentUser(user);
            setOwned(null);
            setShared(null);
          }}
        />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex gap-3">
          <button
            onClick={handleNewDocument}
            disabled={creating || !currentUser}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:opacity-50"
          >
            + New Document
          </button>
          <button
            onClick={() => setShowImport(true)}
            disabled={!currentUser}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Import
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Section title="My Documents">
          {loading && <SkeletonGrid />}
          {!loading && owned && owned.length === 0 && (
            <EmptyState text="You don't have any documents yet. Create one to get started." />
          )}
          {!loading && owned && owned.length > 0 && (
            <Grid>
              {owned.map((doc) => (
                <DocumentCard key={doc.id} document={doc} variant="owned" />
              ))}
            </Grid>
          )}
        </Section>

        <Section title="Shared With Me">
          {loading && <SkeletonGrid />}
          {!loading && shared && shared.length === 0 && (
            <EmptyState text="No one has shared a document with you yet." />
          )}
          {!loading && shared && shared.length > 0 && (
            <Grid>
              {shared.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  variant="shared"
                  ownerName={doc.owner?.name}
                />
              ))}
            </Grid>
          )}
        </Section>
      </main>

      {showImport && <ImportDialog onClose={() => { setShowImport(false); loadDocuments(); }} />}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}

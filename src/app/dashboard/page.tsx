import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  const currentUserId = getCurrentUserId();
  const currentUser = users.find((u) => u.id === currentUserId) ?? null;

  return <DashboardClient initialUsers={users} initialCurrentUser={currentUser} />;
}

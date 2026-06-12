import AppShell from "@/components/layout/AppShell";
import { AdminGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AppShell>{children}</AppShell>
    </AdminGuard>
  );
}

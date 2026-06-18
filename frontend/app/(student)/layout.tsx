import AppShell from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}

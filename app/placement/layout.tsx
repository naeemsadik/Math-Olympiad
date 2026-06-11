import Navbar from "@/components/layout/Navbar";

export default function PlacementLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fef9f0" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

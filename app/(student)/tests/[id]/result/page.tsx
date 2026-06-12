import { redirect } from "next/navigation";

export default async function LegacyTestResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/student/tests/${id}/result`);
}

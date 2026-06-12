import { redirect } from "next/navigation";

export default async function LegacyTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/student/topics/${slug}`);
}

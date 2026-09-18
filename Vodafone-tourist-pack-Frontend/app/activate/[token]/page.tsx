import ActivatePageClient from "@/app/activate/[token]/ActivatePageClient";

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ActivatePageClient token={token} />;
}

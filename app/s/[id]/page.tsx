import GiftView from "@/components/GiftView";

export default async function GiftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GiftView id={id} />;
}
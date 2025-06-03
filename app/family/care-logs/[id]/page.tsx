import { PageProps } from "@/.next/types/app/page";
import { FamilyCareLogDetail } from "@/components/care-logs/family-care-log-detail";

export default async function FamilyCareLogDetailPage({ params }: PageProps) {
  const { id } = await params;
  // 실제 구현에서는 params.id를 사용하여 API에서 돌봄일지 데이터를 가져옵니다
  return <FamilyCareLogDetail id={id} />;
}

"use client";

import { CaregiverDetail } from "@/components/caregivers/caregiver-detail";
import Loading from "@/components/ui/loading-page";
import { useGetCaregiver } from "@/features/member/useGetCaregiver";
import { useParams } from "next/navigation";

export default function CaregiverDetailPage() {
  const { id } = useParams() as { id?: string };
  const { data } = useGetCaregiver(id);

  if (!data) {
    return <Loading />;
  }

  return <CaregiverDetail data={data} />;
}

"use client";

import { CaregiverForm } from "@/components/caregivers/caregiver-form";
import Loading from "@/components/ui/loading-page";
import { useEditCaregiver } from "@/features/member/useEditCaregiver";
import { useGetCaregiverForUpdate } from "@/features/member/useGetCaregiverForUpdate";
import { useParams } from "next/navigation";

export default function EditCaregiverPage() {
  const { id } = useParams() as { id?: string };
  const { editCaregiver } = useEditCaregiver();
  const { data } = useGetCaregiverForUpdate(id);

  if (!data) {
    return <Loading />;
  }

  return (
    <CaregiverForm
      mode="edit"
      initialData={data}
      onClickSaveButton={(value) => editCaregiver(id, value)}
    />
  );
}

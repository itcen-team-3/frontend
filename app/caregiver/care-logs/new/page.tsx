"use client";

import { CareLogCreateForm } from "@/components/care-logs/care-log-create-form";
import { format } from "date-fns";
import { useGetCareItemList } from "@/features/care-logs/useGetCareItemList";
import { useCreateCareLog } from "@/features/care-logs/useCreateCareLog";

export default function NewCareLogPage() {
  const { careItemList } = useGetCareItemList();
  const { createCareLog } = useCreateCareLog();

  return (
    <CareLogCreateForm
      patientName="이환자"
      date={format(new Date(), "yyyy-MM-dd")}
      careItemList={careItemList}
      createCareLog={createCareLog}
    />
  );
}

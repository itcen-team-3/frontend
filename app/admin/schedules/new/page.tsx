"use client";
import Loading from "@/components/ui/loading-page";
import { useGetCaregiverNameList } from "@/features/member/useGetCaregiverNameList";

import { ScheduleForm } from "@/components/schedules/schedule-form";

export default function NewSchedulePage() {
  const {
    caregiverNameList,
    isCaregiverNameListLoading,
    errorCaregiverNameList,
  } = useGetCaregiverNameList();

  if (isCaregiverNameListLoading) {
    console.log("errorCaregiverNameList", errorCaregiverNameList);
    return <Loading />;
  }

  return (
    <ScheduleForm
      mode="create"
      caregiverNameList={caregiverNameList?.caregivers || []}
    />
  );
}

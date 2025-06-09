"use client";
import Loading from "@/components/ui/loading-page";
import { useGetCaregiverNameList } from "@/features/member/useGetCaregiverNameList";
import { useGetPatientNameList } from "@/features/member/useGetPatientNameList";

import { ScheduleForm } from "@/components/schedules/schedule-form";
import { useCreateWorkSchedule } from "@/features/workschedule/useCreateWorkSchedule";

export default function NewSchedulePage() {
  const {
    caregiverNameList,
    isCaregiverNameListLoading,
    errorCaregiverNameList,
  } = useGetCaregiverNameList();
  const { patientNameList, isPatientNameListLoading, errorPatientNameList } =
    useGetPatientNameList();
  const { createWorkSchedule, isLoading, error } = useCreateWorkSchedule();

  if (isCaregiverNameListLoading || isPatientNameListLoading) {
    console.log("errorCaregiverNameList", errorCaregiverNameList);
    console.log("errorPatientNameList", errorPatientNameList);
    return <Loading />;
  }

  return (
    <ScheduleForm
      mode="create"
      caregiverNameList={caregiverNameList?.caregivers || []}
      patientNameList={patientNameList?.patients || []}
      isLoading={isLoading}
      error={error}
      onSaveWorkScheduleButton={(value) => createWorkSchedule(value)}
    />
  );
}

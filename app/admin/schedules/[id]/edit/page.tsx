"use client";

import { ScheduleForm } from "@/components/schedules/schedule-form";
import { useGetCaregiverNameList } from "@/features/member/useGetCaregiverNameList";
import { useGetPatientNameList } from "@/features/member/useGetPatientNameList";
import Loading from "@/components/ui/loading-page";
import { useGetWorkScheduleDetail } from "@/features/workschedule/useGetWorkScheduleDetail";
import { useParams } from "next/navigation";
import { useEditWorkSchedule } from "@/features/workschedule/useEditWorkSchedule";

export default function EditSchedulePage() {
  const { id } = useParams() as { id?: string };

  const {
    caregiverNameList,
    isCaregiverNameListLoading,
    errorCaregiverNameList,
  } = useGetCaregiverNameList();
  const { patientNameList, isPatientNameListLoading, errorPatientNameList } =
    useGetPatientNameList();

  const { data, isLoading, error } = useGetWorkScheduleDetail(id);
  const { editWorkSchedule } = useEditWorkSchedule();

  // TODO : 이 로직 검토
  if (isCaregiverNameListLoading || isPatientNameListLoading) {
    console.log("errorCaregiverNameList", errorCaregiverNameList);
    console.log("errorPatientNameList", errorPatientNameList);
    return <Loading />;
  }

  return (
    <ScheduleForm
      mode="edit"
      initialData={data || undefined}
      caregiverNameList={caregiverNameList?.caregivers || []}
      patientNameList={patientNameList?.patients || []}
      isLoading={isLoading}
      error={error}
      onSaveWorkScheduleButton={(value) => editWorkSchedule(id, value)}
    />
  );
}

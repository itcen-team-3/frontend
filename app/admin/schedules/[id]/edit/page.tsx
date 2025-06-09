"use client";

import { ScheduleForm } from "@/components/schedules/schedule-form";
import { WorkScheduleRequest } from "@/lib/types/workSchedule";
import { useGetCaregiverNameList } from "@/features/member/useGetCaregiverNameList";
import { useGetPatientNameList } from "@/features/member/useGetPatientNameList";
import Loading from "@/components/ui/loading-page";

export default function EditSchedulePage() {
  const {
    caregiverNameList,
    isCaregiverNameListLoading,
    errorCaregiverNameList,
  } = useGetCaregiverNameList();
  const { patientNameList, isPatientNameListLoading, errorPatientNameList } =
    useGetPatientNameList();
  // 실제 구현에서는 ID를 기반으로 데이터를 가져옵니다
  // TODO : 추후 제거 build 에러 해결용
  // TODO : api 연동
  const mockData = {
    caregiverId: null,
    patientName: "",
    patientId: null,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    startTime: "09:00",
    endTime: "12:00",
    days: [],
    workDay: 0,
    paymentForHour: 0,
    paymentType: "방문급여",
    isFamily: false,
  };

  // TODO : 이 로직 검토
  if (isCaregiverNameListLoading || isPatientNameListLoading) {
    console.log("errorCaregiverNameList", errorCaregiverNameList);
    console.log("errorPatientNameList", errorPatientNameList);
    return <Loading />;
  }

  return (
    <ScheduleForm
      mode="edit"
      initialData={mockData}
      caregiverNameList={caregiverNameList?.caregivers || []}
      patientNameList={patientNameList?.patients || []}
      isLoading={false}
      error={{
        code: 0,
        message: "",
      }}
      onClickCreateWorkScheduleButton={function (
        args: WorkScheduleRequest
      ): void {
        console.log(args);
        throw new Error("Function not implemented.");
      }}
    />
  );
}

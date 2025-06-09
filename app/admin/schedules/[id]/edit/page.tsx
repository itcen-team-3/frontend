"use client";

import { ScheduleForm } from "@/components/schedules/schedule-form";
import { WorkScheduleRequest } from "@/lib/types/workSchedule";

export default function EditSchedulePage() {
  // 실제 구현에서는 ID를 기반으로 데이터를 가져옵니다
  // TODO : 추후 제거 build 에러 해결용
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

  return (
    <ScheduleForm
      mode="edit"
      initialData={mockData}
      caregiverNameList={[]}
      patientNameList={[]}
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

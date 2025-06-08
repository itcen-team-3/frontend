"use client";

import { AdminScheduleOverview } from "@/components/schedules/admin-schedule-overview";
import { useGetWorkSchedulesByWeek } from "@/features/workschedule/useGetWorkSchedulesByWeek";
import { getStartOfWeek } from "@/lib/utils";

export default function ScheduleOverviewPage() {
  const startDate = getStartOfWeek(new Date());
  const { data, caregiverNameList, refetchGetWorkSchedulesByWeek } =
    useGetWorkSchedulesByWeek(startDate);

  // TODO : api 변경 후 테스트
  console.log("data", data);

  return (
    <AdminScheduleOverview
      caregiverNameList={caregiverNameList?.caregivers || []}
      refetchGetWorkSchedulesByWeek={refetchGetWorkSchedulesByWeek}
      // TODO : 추후 제거 build 에러 해결용
      caregivers={[]}
      patients={[]}
      scheduleEvents={[]}
    />
  );
}

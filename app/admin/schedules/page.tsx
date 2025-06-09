"use client";

import { AdminScheduleOverview } from "@/components/schedules/admin-schedule-overview";
import { useGetWorkSchedulesByWeek } from "@/features/workschedule/useGetWorkSchedulesByWeek";
import { getStartOfWeek } from "@/lib/utils";

export default function ScheduleOverviewPage() {
  const startDate = getStartOfWeek(new Date());
  const { data, caregiverNameList, refetchGetWorkSchedulesByWeek } =
    useGetWorkSchedulesByWeek(startDate);

  return (
    <AdminScheduleOverview
      caregiverNameList={caregiverNameList?.caregivers || []}
      refetchGetWorkSchedulesByWeek={refetchGetWorkSchedulesByWeek}
      scheduleEvents={data?.schedulesWeek || []}
    />
  );
}

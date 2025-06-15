"use client";

import { CaregiverDashboard } from "@/components/dashboard/caregiver-dashboard";
import { useParams } from "next/navigation";
import { useCreateWorkStart } from "@/features/workschedule/useCreateWorkStart";
import Loading from "@/components/ui/loading-page";
import { useCreateWorkEnd } from "@/features/workschedule/useCreateWorkEnd";
import { useGetDashboardInfo } from "@/features/member/useGetCaregiverDashboardInfo";
import { findClosestOrActiveTime } from "@/lib/utils";

export default function DashboardPage() {
  const params = useParams();
  const uuid = params?.uuid as string;

  const { dashboardInfo, isDashboardInfoLoading } = useGetDashboardInfo();

  // 추후 에러처리
  const { createWorkStart, isWorkStartLoading } = useCreateWorkStart();
  const { createWorkEnd, isWorkEndLoading } = useCreateWorkEnd();

  if (isWorkStartLoading || isWorkEndLoading || isDashboardInfoLoading) {
    return <Loading />;
  }

  const schedule = findClosestOrActiveTime(
    new Date(),
    dashboardInfo?.schedules || [],
  );

  return (
    <CaregiverDashboard
      caregiverName={dashboardInfo?.caregiverName || ""}
      patientName={schedule?.patientName || ""}
      workingHours={schedule?.startTime + "부터 " + schedule?.endTime}
      isWorkingDay={schedule ? true : false}
      attendanceStatus={schedule?.attendanceStatus || ""}
      patientId={schedule?.patientId || ""}
      uuid={uuid}
      createWorkStart={createWorkStart}
      createWorkEnd={createWorkEnd}
    />
  );
}

"use client";

import { CaregiverDashboard } from "@/components/dashboard/caregiver-dashboard";
import { useParams } from "next/navigation";
import { useCreateWorkStart } from "@/features/workschedule/useCreateWorkStart";
import Loading from "@/components/ui/loading-page";
import { useCreateWorkEnd } from "@/features/workschedule/useCreateWorkEnd";
import { useGetDashboardInfo } from "@/features/member/useGetCaregiverDashboardInfo";

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

  return (
    <CaregiverDashboard
      caregiverName={dashboardInfo?.caregiverName || ""}
      patientName={dashboardInfo?.patientName || ""}
      workingHours={dashboardInfo?.startTime + "부터 " + dashboardInfo?.endTime}
      isWorkingDay={dashboardInfo?.workStatus ? true : false}
      patientId={String(dashboardInfo?.patientId) || ""}
      uuid={uuid}
      createWorkStart={createWorkStart}
      createWorkEnd={createWorkEnd}
    />
  );
}

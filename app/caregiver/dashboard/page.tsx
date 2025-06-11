"use client";

import { CaregiverDashboard } from "@/components/dashboard/caregiver-dashboard";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const params = useParams();
  const uuid = params?.uuid as string;

  return (
    <CaregiverDashboard
      caregiverName={""}
      patientName={null}
      workingHours={null}
      isWorkingDay={false}
      isCheckedIn={false}
      // TODO : 민아님이 API 만들어주면 붙일 것
      patientNameList={[]}
      uuid={uuid}
    />
  );
}

"use client";

import { useState, useEffect } from "react";
import { CaregiverDashboard } from "@/components/dashboard/caregiver-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { FamilyDashboard } from "@/components/dashboard/family-dashboard";

export default function DashboardPage() {
  // 실제 구현에서는 인증 상태에서 사용자 역할을 가져옵니다
  // 여기서는 예시로 사용자 역할을 선택할 수 있게 합니다
  const [userRole, setUserRole] = useState<string>("caregiver");

  // 실제 구현에서는 이 부분이 필요 없습니다
  useEffect(() => {
    // URL 파라미터에서 역할을 가져옵니다 (데모용)
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role && ["caregiver", "admin", "family"].includes(role)) {
      setUserRole(role);
    }
  }, []);

  // 사용자 역할에 따라 다른 대시보드를 렌더링합니다
  switch (userRole) {
    case "admin":
      return (
        <AdminDashboard adminName={""} schedules={[]} notifications={[]} />
      );
    case "family":
      return (
        <FamilyDashboard
          familyName={""}
          patientName={""}
          caregiverName={""}
          caregiverStatus={"working"}
          careLogs={[]}
        />
      );
    case "caregiver":
    default:
      return (
        <CaregiverDashboard
          caregiverName={""}
          patientName={null}
          workingHours={null}
          isWorkingDay={false}
          isCheckedIn={false}
        />
      );
  }
}

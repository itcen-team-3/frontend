"use client";

import { FamilyDashboard } from "@/components/dashboard/family-dashboard";

export default function FamilyDashboardPage() {
  return (
    <FamilyDashboard
      familyName={""}
      patientName={""}
      caregiverName={""}
      caregiverStatus={"working"}
      careLogs={[]}
    />
  );
}

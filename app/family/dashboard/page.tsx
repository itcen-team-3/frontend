"use client";

import { FamilyDashboard } from "@/components/dashboard/family-dashboard";

export default function FamilyDashboardPage() {
  console.log("Family Dashboard Page");
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

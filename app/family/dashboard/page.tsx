"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FamilyDashboard } from "@/components/dashboard/family-dashboard";

interface PatientSummary {
  familyName: string;
  patientName: string;
  caregiverName: string;
  caregiverStatus: "working" | "scheduled" | "off";
}

interface CareLog {
  id: string;
  date: string;
  caregiverName: string;
  activities: string[];
}

export default function FamilyDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        // 환자 요약 정보 조회
        const summaryResponse = await fetch("/api/family/patients/summary");
        if (!summaryResponse.ok) {
          throw new Error("환자 정보를 불러오는데 실패했습니다.");
        }
        const summaryData = await summaryResponse.json();

        // 최근 돌봄 일지 조회
        const careLogsResponse = await fetch("/api/family/care-logs?limit=3");
        if (!careLogsResponse.ok) {
          throw new Error("돌봄 일지를 불러오는데 실패했습니다.");
        }
        const careLogsData = await careLogsResponse.json();

        setSummary(summaryData);
        setCareLogs(careLogsData.careLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleCareLogClick = (logId: string) => {
    router.push(`/family/care-logs/${logId}`);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!summary) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <FamilyDashboard
      familyName={summary.familyName}
      patientName={summary.patientName}
      caregiverName={summary.caregiverName}
      caregiverStatus={summary.caregiverStatus}
      careLogs={careLogs}
      onCareLogClick={handleCareLogClick}
    />
  );
}

"use client";

import { CareLogList } from "@/components/care-logs/care-log-list";
import { useGetCaregiverCareLogs } from "@/features/care-logs/useGetCaregiverCareLogs";

export default function CaregiverCareLogsPage() {
  const { data } = useGetCaregiverCareLogs();
  return <CareLogList userRole="caregiver" careLogs={data?.content || []} />;
}

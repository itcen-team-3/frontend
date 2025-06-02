import { CareLogList } from "@/components/care-logs/care-log-list";

export default function CaregiverCareLogsPage() {
  return <CareLogList userRole="caregiver" careLogs={[]} />;
}

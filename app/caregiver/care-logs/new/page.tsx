import { CareLogCreateForm } from "@/components/care-logs/care-log-create-form";

export default function NewCareLogPage() {
  return (
    <CareLogCreateForm
      patientName="이환자"
      date={new Date().toISOString().split("T")[0]}
    />
  );
}

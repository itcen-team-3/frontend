import { CareLogCreateForm } from "@/components/care-logs/care-log-create-form";
import { format } from "date-fns";

export default function NewCareLogPage() {
  return (
    <CareLogCreateForm
      patientName="이환자"
      date={format(new Date(), "yyyy-MM-dd")}
    />
  );
}

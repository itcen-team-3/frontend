import { SalaryDetail } from "@/components/salary/salary-detail";

export default function SalaryDetailPage() {
  return (
    <SalaryDetail
      id={""}
      caregiverName={""}
      month={""}
      totalHours={0}
      regularHours={0}
      overtimeHours={0}
      hourlyRate={0}
      totalAmount={0}
      status={"pending"}
      workDays={[]}
    />
  );
}

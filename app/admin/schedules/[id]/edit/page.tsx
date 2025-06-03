import { ScheduleForm } from "@/components/schedules/schedule-form";

export default function EditSchedulePage() {
  // 실제 구현에서는 ID를 기반으로 데이터를 가져옵니다
  const mockData = {
    caregiverId: "1",
    patientId: "1",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-08-01"),
    startTime: "09:00",
    endTime: "12:00",
    days: ["월", "수", "금"],
    hourlyRate: "12000",
    salaryType: "방문급여",
    isFamily: false,
  };

  return <ScheduleForm mode="edit" initialData={mockData} />;
}

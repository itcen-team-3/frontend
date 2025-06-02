import { AttendanceForm } from "./attendance-form";

export function CaregiverAttendanceDetail() {
  // 실제로는 API에서 데이터를 가져와야 함
  const mockData = {
    date: new Date("2024-01-15"),
    time: "09:30",
    reason:
      "교통 체증으로 인한 지연 출근입니다. 평소보다 30분 늦게 도착했습니다.",
  };

  return <AttendanceForm type="check-in" mode="view" initialData={mockData} />;
}

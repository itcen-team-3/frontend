import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { LargeButton } from "@/components/ui/large-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, ClipboardList } from "lucide-react";

interface CaregiverDashboardProps {
  caregiverName: string;
  patientName: string | null;
  workingHours: string | null;
  isWorkingDay: boolean;
  isCheckedIn: boolean;
}

export function CaregiverDashboard({
  caregiverName = "김요양",
  patientName = "이환자",
  workingHours = "12시부터 3시까지",
  isWorkingDay = true,
  isCheckedIn = false,
}: CaregiverDashboardProps) {
  return (
    <PageContainer>
      <PageHeader
        title={`${caregiverName}님, 안녕하세요`}
        description={
          isWorkingDay
            ? `오늘은 ${patientName}님, ${workingHours} 근무입니다`
            : "오늘은 근무날이 아닙니다"
        }
      />

      <div className="grid gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">근무 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg">현재 상태:</div>
              <StatusBadge
                status={isCheckedIn ? "success" : "default"}
                text={isCheckedIn ? "근무 중" : "미출근"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <LargeButton
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isCheckedIn}
              >
                <Clock className="mr-2 h-6 w-6" />
                출근하기
              </LargeButton>
              <LargeButton
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!isCheckedIn}
              >
                <Clock className="mr-2 h-6 w-6" />
                퇴근하기
              </LargeButton>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">돌봄 일지</CardTitle>
          </CardHeader>
          <CardContent>
            <LargeButton className="w-full">
              <ClipboardList className="mr-2 h-6 w-6" />
              돌봄 일지 작성하기
            </LargeButton>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

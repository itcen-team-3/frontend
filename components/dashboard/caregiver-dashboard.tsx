"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { LargeButton } from "@/components/ui/large-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientNameListItem } from "@/lib/types/member";
import { useRouter } from "next/navigation";

interface CaregiverDashboardProps {
  caregiverName: string;
  patientName: string | null;
  workingHours: string | null;
  isWorkingDay: boolean;
  isCheckedIn: boolean;
  patientNameList: PatientNameListItem[];
  uuid: string;
}

export function CaregiverDashboard({
  caregiverName = "김요양",
  patientName = "이환자",
  workingHours = "12시부터 3시까지",
  isWorkingDay = true,
  isCheckedIn = false,
  patientNameList,
  uuid,
}: CaregiverDashboardProps) {
  const router = useRouter();

  const [selectedPatient, setSelectedPatient] = useState<{
    patientId: string;
    patientName: string;
  }>({
    patientId: "",
    patientName: "",
  });
  const handleSelectChange = (name: string, value: string) => {
    setSelectedPatient((prev: any) => {
      const data = { ...prev, [name]: value };

      if (name === "patientId") {
        data.patientName =
          patientNameList.find((item) => item.patientId === Number(value))
            ?.patientName || "";
      }

      return data;
    });
  };

  const onClickStartWorkButton = () => {
    console.log(uuid);
    // TODO uuid 넣어서 api 요청보내기
  };

  const onClickFinishWork = () => {
    console.log(uuid);
    // TODO uuid 넣어서 api 요청보내기
  };

  const onClickCreateCareLogButton = () => {
    // TODO : sessionStorage 에 저장 후 돌봄일지 생성 후 제거
    console.log("선택된 보호대상자 id", selectedPatient.patientId);
    router.push("/caregiver/care-logs/new");
  };

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
                onClick={onClickStartWorkButton}
              >
                <Clock className="mr-2 h-6 w-6" />
                출근하기
              </LargeButton>
              <LargeButton
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!isCheckedIn}
                onClick={onClickFinishWork}
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
            <div className="space-y-2">
              <Select
                value={
                  selectedPatient.patientId === null
                    ? undefined
                    : String(selectedPatient.patientId)
                }
                onValueChange={(value) =>
                  handleSelectChange("patientId", value)
                }
              >
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="보호대상자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {patientNameList.map((patient) => (
                    <SelectItem
                      key={patient.patientId}
                      value={String(patient.patientId)}
                      className="text-lg"
                    >
                      {patient.patientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardContent>
            <LargeButton
              className="w-full"
              onClick={onClickCreateCareLogButton}
            >
              <ClipboardList className="mr-2 h-6 w-6" />
              돌봄 일지 작성하기
            </LargeButton>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

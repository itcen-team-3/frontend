"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { LargeButton } from "@/components/ui/large-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface CaregiverDashboardProps {
  caregiverName: string;
  patientName: string | null;
  workingHours: string | null;
  isWorkingDay: boolean;
  patientId: string;
  uuid?: string;
  createWorkStart: (uuid: string) => void;
  createWorkEnd: (uuid: string) => void;
}

export function CaregiverDashboard({
  caregiverName,
  patientName,
  workingHours,
  isWorkingDay,
  uuid = "",
  createWorkStart,
  createWorkEnd,
}: CaregiverDashboardProps) {
  const router = useRouter();
  const isCheckedIn = localStorage.getItem("check-in") === "1" ? true : false;
  const [isCheckNFCDialogOpen, setIsCheckNFCDialogOpen] = useState(false);

  const onClickStartWorkButton = () => {
    if (uuid.length === 0) {
      setIsCheckNFCDialogOpen(true);
    } else {
      setIsCheckNFCDialogOpen(false);
      createWorkStart(uuid);
    }
  };

  const onClickFinishWork = () => {
    if (uuid.length === 0) {
      setIsCheckNFCDialogOpen(true);
    } else {
      setIsCheckNFCDialogOpen(false);
      createWorkEnd(uuid);
    }
  };

  const onClickCreateCareLogButton = () => {
    router.push("/caregiver/care-logs/new");
  };

  return (
    <PageContainer>
      <PageHeader
        title={`${caregiverName}님, 안녕하세요`}
        description={
          isWorkingDay
            ? `오늘은 ${patientName}님을 ${workingHours}까지 케어합니다.`
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
      <Dialog
        open={isCheckNFCDialogOpen}
        onOpenChange={setIsCheckNFCDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">NFC 오류</DialogTitle>
            <DialogDescription className="text-lg">
              NFC 태깅 후 출/퇴근 버튼을 눌러주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="lg" onClick={() => setIsCheckNFCDialogOpen(false)}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

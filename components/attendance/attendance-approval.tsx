"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, Loader2, X } from "lucide-react";
import { getAttendanceList } from "@/lib/api/attendance/admin/getAttendanceList";
import { useState, useEffect } from "react";
import { attendanceItem } from "@/lib/api/attendance/admin/getAttendanceList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { useModal } from "@/context/ModalContext";
import { updateAttendanceStatus } from "@/lib/api/attendance/admin/updateAttendanceStatus";

export function AttendanceApproval() {
  const { showAlert } = useModal();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<attendanceItem[]>([]);

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");

  const pendingRequests = data.filter((req) => req.status === "대기");
  const processedRequests = data.filter((req) => req.status !== "대기");

  const fetchData = async () => {
    setIsLoading(true);
    const attendanceList = await getAttendanceList();
    setData(attendanceList);
    setIsLoading(false);
  };

  const getBedgeStatus = (status: string) => {
    if (status === "대기") {
      return "warning";
    } else if (status === "승인") {
      return "success";
    } else if (status === "거절") {
      return "error";
    } else {
      return "default";
    }
  };

  // 승인 버튼 클릭 핸들러
  const handleApproveClick = async (requestId: string) => {
    const data = await updateAttendanceStatus(requestId, {
      approveType: "승인",
      rejectReason: "",
    });

    if (data) {
      showAlert({ message: "소명 요청이 승인되었습니다" });
      fetchData();
    } else {
      showAlert({ message: "소명 요청 승인에 실패했습니다" });
    }
  };

  // 거절 확인 핸들러
  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      showAlert({ message: "거절 사유를 입력해주세요" });
      return;
    }

    const data = await updateAttendanceStatus(selectedRequestId, {
      approveType: "거절",
      rejectReason: rejectionReason,
    });

    if (data) {
      showAlert({ message: "소명 요청을 거절했습니다." });
      fetchData();
    } else {
      showAlert({ message: "소명 요청을 거절에 실패했습니다." });
    }

    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="출퇴근 소명 관리"
        description="요양보호사의 출퇴근 소명 요청을 관리하세요"
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending" className="text-lg">
            대기 중 ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="processed" className="text-lg">
            처리됨 ({processedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {isLoading ? (
            <Loader2 />
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <Card key={request.id + Math.random()} className="card-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {request.caregiverName} 소명
                    </CardTitle>
                    <StatusBadge
                      status={getBedgeStatus(request.status)}
                      text={request.status}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">날짜</p>
                      <p className="text-lg font-medium">{request.date}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">시간</p>
                      <p className="text-lg font-medium">{request.time}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      소명 사유
                    </p>
                    <p className="text-lg">{request.reason}</p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg"
                      onClick={() => {
                        setSelectedRequestId(request.id);
                        setIsRejectDialogOpen(true);
                      }}
                    >
                      <X className="mr-2 h-5 w-5" />
                      거절
                    </Button>
                    <Button
                      size="lg"
                      className="text-lg"
                      onClick={() => handleApproveClick(request.id)}
                    >
                      <Check className="mr-2 h-5 w-5" />
                      승인
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="card-shadow">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground text-lg">
                  대기 중인 소명 요청이 없습니다
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-6">
          {processedRequests.length > 0 ? (
            processedRequests.map((request) => (
              <Card key={request.id + Math.random()} className="card-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {request.caregiverName} 소명
                    </CardTitle>
                    <StatusBadge
                      status={getBedgeStatus(request.status)}
                      text={request.status}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">날짜</p>
                      <p className="text-lg font-medium">{request.date}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">시간</p>
                      <p className="text-lg font-medium">{request.time}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      소명 사유
                    </p>
                    <p className="text-lg">{request.reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="card-shadow">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground text-lg">
                  처리된 소명 요청이 없습니다
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 거절 사유 입력 다이얼로그 */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>소명 요청 거절</DialogTitle>
            <DialogDescription>
              소명 요청을 거절하는 사유를 입력해주세요. 입력한 사유는
              요양보호사에게 전달됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason" className="text-base">
                거절 사유
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="거절 사유를 입력해주세요"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason("");
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRejectConfirm}
            >
              거절 확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

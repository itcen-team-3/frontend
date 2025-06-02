import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, X } from "lucide-react";

interface AttendanceRequest {
  id: string;
  caregiverName: string;
  date: string;
  time: string;
  type: "check-in" | "check-out";
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface AttendanceApprovalProps {
  requests: AttendanceRequest[];
}

export function AttendanceApproval({
  requests = [
    {
      id: "1",
      caregiverName: "김요양",
      date: "2025-05-20",
      time: "09:15",
      type: "check-in",
      reason: "버스가 지연되어 늦었습니다. 죄송합니다.",
      status: "pending",
    },
    {
      id: "2",
      caregiverName: "박요양",
      date: "2025-05-19",
      time: "18:10",
      type: "check-out",
      reason: "보호대상자 긴급 상황으로 인해 퇴근이 지연되었습니다.",
      status: "approved",
    },
    {
      id: "3",
      caregiverName: "정요양",
      date: "2025-05-18",
      time: "09:30",
      type: "check-in",
      reason: "개인 사정으로 인해 늦었습니다.",
      status: "rejected",
    },
  ],
}: AttendanceApprovalProps) {
  const pendingRequests = requests.filter((req) => req.status === "pending");
  const processedRequests = requests.filter((req) => req.status !== "pending");

  const statusMap = {
    pending: { label: "대기 중", status: "warning" },
    approved: { label: "승인됨", status: "success" },
    rejected: { label: "거절됨", status: "error" },
  };

  const typeMap = {
    "check-in": "출근",
    "check-out": "퇴근",
  };

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
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <Card key={request.id} className="card-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {request.caregiverName} - {typeMap[request.type]} 소명
                    </CardTitle>
                    <StatusBadge
                      status={statusMap[request.status].status as any}
                      text={statusMap[request.status].label}
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
                    <Button variant="outline" size="lg" className="text-lg">
                      <X className="mr-2 h-5 w-5" />
                      거절
                    </Button>
                    <Button size="lg" className="text-lg">
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
              <Card key={request.id} className="card-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {request.caregiverName} - {typeMap[request.type]} 소명
                    </CardTitle>
                    <StatusBadge
                      status={statusMap[request.status].status as any}
                      text={statusMap[request.status].label}
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
    </PageContainer>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

interface AttendanceRequest {
  id: string;
  date: string;
  time: string;
  type: "check-in" | "check-out";
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewComment?: string;
}

interface CaregiverAttendanceListProps {
  requests?: AttendanceRequest[];
}

export function CaregiverAttendanceList({
  requests = [
    {
      id: "1",
      date: "2025-05-20",
      time: "09:15",
      type: "check-in",
      reason: "버스가 지연되어 늦었습니다. 죄송합니다.",
      status: "approved",
      submittedAt: "2025-05-20 09:30",
      reviewedAt: "2025-05-20 10:00",
      reviewComment: "승인되었습니다.",
    },
    {
      id: "2",
      date: "2025-05-18",
      time: "18:10",
      type: "check-out",
      reason: "보호대상자 긴급 상황으로 인해 퇴근이 지연되었습니다.",
      status: "pending",
      submittedAt: "2025-05-18 18:30",
    },
    {
      id: "3",
      date: "2025-05-15",
      time: "09:30",
      type: "check-in",
      reason: "개인 사정으로 인해 늦었습니다.",
      status: "rejected",
      submittedAt: "2025-05-15 10:00",
      reviewedAt: "2025-05-15 14:00",
      reviewComment: "사유가 불충분합니다. 다시 제출해주세요.",
    },
    {
      id: "4",
      date: "2025-05-12",
      time: "09:20",
      type: "check-in",
      reason: "교통 체증으로 인해 지연되었습니다.",
      status: "approved",
      submittedAt: "2025-05-12 09:45",
      reviewedAt: "2025-05-12 11:00",
    },
  ],
}: CaregiverAttendanceListProps) {
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
      <div className="flex justify-between items-center">
        <PageHeader
          title="출퇴근 소명 관리"
          description="제출한 소명 요청을 확인하고 관리하세요"
          className="mb-0"
        />
        <Link href="/caregiver/attendance/new">
          <Button size="lg" className="text-lg">
            <Plus className="mr-2 h-5 w-5" />새 소명 작성
          </Button>
        </Link>
      </div>

      <Card className="card-shadow mt-6">
        <CardHeader>
          <CardTitle className="text-xl">소명 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium">
                          {format(new Date(request.date), "yyyy년 MM월 dd일", {
                            locale: ko,
                          })}{" "}
                          {typeMap[request.type]} 소명
                        </h3>
                        <StatusBadge
                          status={statusMap[request.status].status as any}
                          text={statusMap[request.status].label}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div>시간: {request.time}</div>
                        <div>제출: {request.submittedAt}</div>
                      </div>
                      <p className="text-base line-clamp-2">{request.reason}</p>
                      {request.reviewComment && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">검토 의견: </span>
                          {request.reviewComment}
                        </div>
                      )}
                    </div>
                    <Link href={`/caregiver/attendance/${request.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">
                  제출한 소명이 없습니다
                </p>
                <Link href="/caregiver/attendance/new">
                  <Button className="mt-4">첫 소명 작성하기</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

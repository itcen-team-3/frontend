"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

interface AttendanceExplation {
  attendanceExplationId: number;
  approveStatus: "대기" | "승인" | "반려";
  explanation: string;
  rejectReason?: string;
  submitDateTime: string;
  attendanceDate: string;
  attendanceTime: string;
  attendanceStatus: "출근" | "퇴근";
}

export function CaregiverAttendanceList() {
  const [data, setData] = useState<AttendanceExplation[]>([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    대기: { label: "대기 중", status: "warning" },
    승인: { label: "승인됨", status: "success" },
    반려: { label: "거절됨", status: "error" },
  } as const;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{ attendances: AttendanceExplation[] }>(
          "/attendance-explation/care-giver"
        );

        console.log("응답 데이터:", res.data.attendances); // ← 추가

        setData(res.data.attendances || []);
      } catch (err) {
        console.error("데이터 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            {loading ? (
              <p className="text-muted-foreground">로딩 중...</p>
            ) : data.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">
                  제출한 소명이 없습니다
                </p>
                <Link href="/caregiver/attendance/new">
                  <Button className="mt-4">첫 소명 작성하기</Button>
                </Link>
              </div>
            ) : (
              Array.from(
                new Map(
                  data.map((item) => [item.attendanceExplationId, item])
                ).values()
              ).map((item, index) => (
                <div
                  key={item.attendanceExplationId}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium">
                          {format(
                            new Date(item.attendanceDate),
                            "yyyy년 MM월 dd일",
                            {
                              locale: ko,
                            }
                          )}{" "}
                          {item.attendanceStatus} 소명
                        </h3>
                        <StatusBadge
                          status={statusMap[item.approveStatus].status}
                          text={statusMap[item.approveStatus].label}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div>시간: {item.attendanceTime}</div>
                        <div>
                          제출:{" "}
                          {format(
                            new Date(item.submitDateTime),
                            "yyyy-MM-dd HH:mm"
                          )}
                        </div>
                      </div>
                      <p className="text-base line-clamp-2">
                        {item.explanation}
                      </p>
                      {item.rejectReason && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">반려 사유: </span>
                          {item.rejectReason}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/caregiver/attendance/${item.attendanceExplationId}`}
                    >
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

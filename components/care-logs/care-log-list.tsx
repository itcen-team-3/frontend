"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

interface CareLog {
  careLogId: number;
  createDate: string;
  activeCount: number;
  caregiverName?: string;
}

interface CareLogListProps {
  userRole: "caregiver" | "admin" | "family";
  careLogs: CareLog[];
}

export function CareLogList({
  userRole = "caregiver",
  careLogs,
}: CareLogListProps) {
  // 날짜 형식 변환 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageHeader
          title="돌봄 일지"
          description="돌봄 일지를 확인하고 관리하세요"
          className="mb-0"
        />
        {userRole === "caregiver" && (
          <Link href="/caregiver/care-logs/new">
            <Button size="lg" className="text-lg">
              <Plus className="mr-2 h-5 w-5" />새 일지 작성
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 mt-6">
        <Card className="card-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">돌봄 일지 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={() => {}}
            >
              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {careLogs.length > 0 ? (
                    careLogs.map((log) => (
                      <Link
                        href={`/caregiver/care-logs/${log.careLogId}`}
                        key={log.careLogId}
                      >
                        <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">
                              {formatDate(log.createDate)}
                            </h3>
                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-base text-muted-foreground">
                              {log.caregiverName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {log.activeCount}개 활동
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>돌봄 일지가 없습니다</p>
                      <Link href="/caregiver/care-logs/new">
                        <Button className="mt-4">첫 돌봄 일지 작성하기</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="date" className="mt-0">
                <div className="space-y-4">
                  {careLogs.length > 0 ? (
                    careLogs.map((log) => (
                      <Link
                        href={`/caregiver/care-logs/${log.careLogId}`}
                        key={log.careLogId}
                      >
                        <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">
                              {formatDate(log.createDate)}
                            </h3>
                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-base text-muted-foreground">
                              {log.caregiverName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {log.activeCount}개 활동
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      선택한 날짜에 돌봄 일지가 없습니다
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClipboardList, User } from "lucide-react";

interface CareLog {
  id: string;
  date: string;
  caregiverName: string;
  activities: string[];
}

interface FamilyDashboardProps {
  familyName: string;
  patientName: string;
  caregiverName: string;
  caregiverStatus: "working" | "scheduled" | "off";
  careLogs: CareLog[];
}

export function FamilyDashboard({
  familyName = "김가족",
  patientName = "이환자",
  caregiverName = "박요양",
  caregiverStatus = "working",
  careLogs = [
    {
      id: "1",
      date: "2025-05-20",
      caregiverName: "박요양",
      activities: ["식사도움", "목욕도움", "말벗·격려 및 위로"],
    },
    {
      id: "2",
      date: "2025-05-19",
      caregiverName: "박요양",
      activities: ["식사도움", "청소 및 주변정돈", "외출 시 동행"],
    },
  ],
}: FamilyDashboardProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const statusMap = {
    working: { label: "근무 중", status: "success" },
    scheduled: { label: "예정됨", status: "info" },
    off: { label: "근무 없음", status: "default" },
  };

  return (
    <PageContainer>
      <PageHeader
        title={`${familyName}님, 안녕하세요`}
        description={`${patientName}님의 돌봄 현황을 확인하세요`}
      />

      <div className="grid gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">현재 돌봄 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {caregiverName} 요양보호사
                </h3>
                <StatusBadge
                  status={statusMap[caregiverStatus].status as any}
                  text={statusMap[caregiverStatus].label}
                  className="mt-1"
                />
              </div>
              <Button variant="outline">상세 정보</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">돌봄 일정</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                required
                classNames={{
                  months:
                    "relative flex justify-center flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-between items-center px-2 py-2",
                  caption_label: "text-lg font-semibold",
                  month_caption: "flex justify-center",
                  month_grid: "w-full",
                  nav: "absolute top-1/15 left-0 right-0 flex justify-between -translate-y-1/2 mr-0",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                  head_row: "flex",
                  head_cell:
                    "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  selected:
                    "h-8 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_button: "w-full flex justify-center items-center",
                  day_outside: "opacity-50",
                  day_disabled: "opacity-50",
                  day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fontWeight: "bold",
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">최근 돌봄 일지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{log.date}</h3>
                      <Button variant="outline" size="sm" className="h-8">
                        <ClipboardList className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                    </div>
                    <p className="text-base text-muted-foreground">
                      {log.activities.slice(0, 2).join(", ")}
                      {log.activities.length > 2
                        ? ` 외 ${log.activities.length - 2}개`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

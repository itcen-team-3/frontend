"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "@/components/ui/calendar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface ScheduleItem {
  id: string;
  caregiverName: string;
  patientName: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "missed";
}

interface AdminDashboardProps {
  adminName: string;
  schedules: ScheduleItem[];
  notifications: { id: string; message: string; time: string }[];
}

export function AdminDashboard({
  adminName = "관리자",
  schedules = [
    {
      id: "1",
      caregiverName: "김요양",
      patientName: "이환자",
      time: "09:00 - 12:00",
      status: "completed",
    },
    {
      id: "2",
      caregiverName: "박요양",
      patientName: "최환자",
      time: "12:00 - 15:00",
      status: "in-progress",
    },
    {
      id: "3",
      caregiverName: "정요양",
      patientName: "강환자",
      time: "15:00 - 18:00",
      status: "scheduled",
    },
  ],
  notifications = [
    {
      id: "1",
      message: "김요양 보호사가 출근 소명을 요청했습니다",
      time: "10분 전",
    },
    {
      id: "2",
      message: "박요양 보호사가 돌봄 일지를 작성했습니다",
      time: "30분 전",
    },
  ],
}: AdminDashboardProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const statusMap = {
    scheduled: { label: "예정됨", status: "default" },
    "in-progress": { label: "진행 중", status: "info" },
    completed: { label: "완료됨", status: "success" },
    missed: { label: "결근", status: "error" },
  };

  return (
    <PageContainer>
      <PageHeader
        title={`${adminName}님, 안녕하세요`}
        description="오늘의 스케줄과 알림을 확인하세요"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">스케줄 캘린더</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">알림</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <Bell className="w-6 h-6 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-base">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      확인
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  새로운 알림이 없습니다
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow mt-6">
        <CardHeader>
          <CardTitle className="text-xl">오늘의 스케줄</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    {schedule.caregiverName} → {schedule.patientName}
                  </h3>
                  <StatusBadge
                    status={statusMap[schedule.status].status as any}
                    text={statusMap[schedule.status].label}
                  />
                </div>
                <p className="text-base text-muted-foreground">
                  {schedule.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

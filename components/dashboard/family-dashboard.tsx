"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { PageHeader } from "@/components/ui/page-header"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ClipboardList, User } from "lucide-react"

interface CareLog {
  id: string
  date: string
  caregiverName: string
  activities: string[]
}

interface FamilyDashboardProps {
  familyName: string
  patientName: string
  caregiverName: string
  caregiverStatus: "working" | "scheduled" | "off"
  careLogs: CareLog[]
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
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const statusMap = {
    working: { label: "근무 중", status: "success" },
    scheduled: { label: "예정됨", status: "info" },
    off: { label: "근무 없음", status: "default" },
  }

  return (
    <PageContainer>
      <PageHeader title={`${familyName}님, 안녕하세요`} description={`${patientName}님의 돌봄 현황을 확인하세요`} />

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
                <h3 className="text-lg font-medium">{caregiverName} 요양보호사</h3>
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
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
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
                      {log.activities.length > 2 ? ` 외 ${log.activities.length - 2}개` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

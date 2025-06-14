"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ClipboardList, User } from "lucide-react";
import Image from "next/image";

type StatusType = "success" | "warning" | "error" | "default" | "info";

interface CareLog {
  careLogId: number;
  createDate: string;
  careGiverName: string;
  activeCount: number;
}

interface CareLogDetail {
  careGiverName: string;
  patientName: string;
  startTime: string;
  endTime: string;
  createDate: string;
  careDetailList: {
    careItemType: string;
    careItemName: string;
    requiredMinutes: number;
  }[];
  imageUrlList: string[];
  signUrl: string;
  description: string;
}

export function FamilyDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverStatus, setCaregiverStatus] = useState<"working" | "scheduled" | "off">("off");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [selectedLog, setSelectedLog] = useState<CareLogDetail | null>(null);
  const [open, setOpen] = useState(false);

  const statusMap: Record<"working" | "scheduled" | "off", { label: string; status: StatusType }> = {
    working: { label: "근무 중", status: "success" },
    scheduled: { label: "예정됨", status: "info" },
    off: { label: "근무 없음", status: "default" },
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/member/patient/dashboard");
        const dashboard = res.data as {
          careGiverDtoList: {
            caregiverId: number;
            workingStatus: boolean;
            profileImageUrl: string;
          }[];
          careLogList: {
            careLogId: number;
            createDate: string;
            careGiverName: string;
            activeCount: number;
          }[];
        };

        console.log("대시보드 응답:", dashboard);

        if (!dashboard) {
          console.warn("대시보드 내용 없음");
          return;
        }

        const caregiver = dashboard.careGiverDtoList?.[0];
        console.log("Caregiver:", caregiver);

        if (caregiver) {
          setCaregiverName(`ID: ${caregiver.caregiverId}`);
          setCaregiverStatus(caregiver.workingStatus ? "working" : "off");
          setProfileImageUrl(caregiver.profileImageUrl);
        }

        const logs: CareLog[] = dashboard.careLogList?.map((log: any) => ({
          careLogId: log.careLogId,
          createDate: log.createDate,
          careGiverName: log.careGiverName,
          activeCount: log.activeCount,
        })) || [];

        setCareLogs(logs);
      } catch (error) {
        console.error("대시보드 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const fetchCareLogDetail = async (id: number) => {
    try {
      const res = await api.get<{ data: CareLogDetail }>(`/carelog/${id}`);
      setSelectedLog(res.data.data);
      setOpen(true);
    } catch (error) {
      console.error("상세 일지 불러오기 실패", error);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="가족님, 안녕하세요" description="최근 돌봄 현황을 확인하세요." />

      <div className="grid gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">현재 돌봄 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt="profile"
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{caregiverName}</h3>
                <StatusBadge
                  status={statusMap[caregiverStatus].status}
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
                {loading ? (
                  <p className="text-muted-foreground">로딩 중...</p>
                ) : careLogs.length === 0 ? (
                  <p className="text-muted-foreground">작성된 돌봄일지가 없습니다.</p>
                ) : (
                  careLogs.map((log) => (
                    <div key={log.careLogId} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">
                          {log.createDate.split("T")[0]} - {log.careGiverName}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => fetchCareLogDetail(log.careLogId)}
                        >
                          <ClipboardList className="w-4 h-4 mr-1" />
                          상세보기
                        </Button>
                      </div>
                      <p className="text-base text-muted-foreground">
                        총 활동 수: {log.activeCount}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

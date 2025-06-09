"use client";

import React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CaregiverNameListItem } from "@/lib/types/member";
import { WorkScheduleItem } from "@/lib/types/workSchedule";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";

interface AdminScheduleOverviewProps {
  scheduleEvents: WorkScheduleItem[];
  caregiverNameList: CaregiverNameListItem[];
  refetchGetWorkSchedulesByWeek: (args: string) => void;
}

export function AdminScheduleOverview({
  scheduleEvents,
  caregiverNameList,
  refetchGetWorkSchedulesByWeek,
}: AdminScheduleOverviewProps) {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [selectedEventDetails, setSelectedEventDetails] =
    useState<WorkScheduleItem | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 현재 주의 날짜들
  const currentWeekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  // 필터링된 스케줄 이벤트 - 모든 이벤트 표시
  const filteredEvents = scheduleEvents;

  // 날짜별 이벤트 그룹화
  const eventsByDate = filteredEvents.reduce(
    (acc, event) => {
      const dateStr = format(
        !event.scheduleDate ? "" : event.scheduleDate,
        "yyyy-MM-dd"
      );
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    },
    {} as Record<string, WorkScheduleItem[]>
  );

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    const date = addDays(currentWeekStart, -7);
    const dateString = format(date, "yyyy-MM-dd");
    setCurrentWeekStart(date);
    refetchGetWorkSchedulesByWeek(dateString);
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    const date = addDays(currentWeekStart, 7);
    const dateString = format(date, "yyyy-MM-dd");
    setCurrentWeekStart(date);
    refetchGetWorkSchedulesByWeek(dateString);
  };

  // 날짜에 해당하는 일정 가져오기
  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return eventsByDate[dateStr] || [];
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = async (event: WorkScheduleItem, date: Date) => {
    setSelectedScheduleId(event.scheduleId || 0);
    setSelectedDate(date);

    const { data }: { data: WorkScheduleItem } = await api.get(
      `/work-schedule/admin/day/${event.scheduleId}`
    );

    const workSchedule = {
      ...data,
      startTime: data.startTime.slice(0, 5),
      endTime: data.endTime.slice(0, 5),
    };

    setSelectedEventDetails(workSchedule);
  };

  const onClickMoveToEditPageButton = () => {
    router.push(`/admin/schedules/${selectedScheduleId}/edit`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="스케줄 관리 대시보드"
        description="모든 요양보호사의 스케줄을 한눈에 확인하세요"
      />

      <Card className="card-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {format(currentWeekStart, "yyyy년 MM월 dd일", { locale: ko })} ~{" "}
              {format(
                endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
                "MM월 dd일",
                { locale: ko }
              )}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "100px repeat(7, 1fr)" }}
          >
            {/* 헤더 row (비어 있는 왼쪽 칸 + 요일 7개) */}
            <div /> {/* 비어있는 왼쪽 위 칸 */}
            {currentWeekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "py-2 font-medium text-center",
                  isToday(day) &&
                    "bg-primary text-primary-foreground rounded-md"
                )}
              >
                {format(day, "eee", { locale: ko })}
                <br />
                {format(day, "d")}
              </div>
            ))}
            {/* 요양보호사별 row */}
            {caregiverNameList.map((caregiver) => (
              <React.Fragment key={caregiver.caregiverId}>
                {/* 요양보호사 이름 */}
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={caregiver.caregiverProfileUrl} />
                    <AvatarFallback>
                      {caregiver.caregiverName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {caregiver.caregiverName}
                  </span>
                </div>

                {/* 요일별 스케줄 */}
                {currentWeekDays.map((day, dayIndex) => {
                  const dayEvents = getEventsForDay(day).filter(
                    (event) =>
                      String(event.caregiverId) ===
                      String(caregiver.caregiverId)
                  );
                  return (
                    <div
                      key={`${caregiver.caregiverId}-${dayIndex}`}
                      className="min-h-[80px] border rounded-md p-1 overflow-y-auto"
                    >
                      {dayEvents.map((event) => {
                        return (
                          <div
                            key={event.scheduleId}
                            className="mb-1 p-1 text-xs bg-primary/10 rounded text-primary border border-primary/20 cursor-pointer hover:bg-primary/20"
                            onClick={() => handleEventClick(event, day)}
                          >
                            <div className="font-medium">
                              {event.patientName}
                            </div>
                            <div>
                              {event.startTime}-{event.endTime}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 일정 상세 정보 다이얼로그는 유지 */}
      <Dialog
        open={!!selectedEventDetails}
        onOpenChange={() => setSelectedEventDetails(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">스케줄 상세 정보</DialogTitle>
            <DialogDescription className="text-lg">
              {selectedEventDetails?.caregiverName} 요양보호사 -{" "}
              {selectedEventDetails?.patientName} 님
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">날짜</p>
                <p className="text-base font-medium">
                  {selectedDate &&
                    format(selectedDate, "yyyy년 MM월 dd일 (eee)", {
                      locale: ko,
                    })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">시간</p>
                <p className="text-base font-medium">
                  {selectedEventDetails?.startTime} -{" "}
                  {selectedEventDetails?.endTime}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">요양보호사</p>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={selectedEventDetails?.caregiverImgUrl}
                    alt={selectedEventDetails?.caregiverName}
                  />
                  <AvatarFallback>
                    {selectedEventDetails?.caregiverName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-base font-medium">
                  {selectedEventDetails?.caregiverName}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">보호대상자</p>
              <p className="text-base font-medium">
                {selectedEventDetails?.patientName}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">주소</p>
              <p className="text-base">
                {selectedEventDetails?.patientAddress}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedEventDetails(null)}
            >
              닫기
            </Button>
            <Button onClick={onClickMoveToEditPageButton}>일정 수정</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

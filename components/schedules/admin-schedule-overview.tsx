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

interface Caregiver {
  caregiverId: string;
  caregiverName: string;
  imageUrl?: string;
}

interface Patient {
  id: string;
  name: string;
  address: string;
}

interface AdminScheduleOverviewProps {
  caregivers: Caregiver[];
  patients: Patient[];
  scheduleEvents: WorkScheduleItem[];
  caregiverNameList: CaregiverNameListItem[];
  refetchGetWorkSchedulesByWeek: (args: string) => void;
}

export function AdminScheduleOverview({
  caregivers = [
    {
      caregiverId: "1",
      caregiverName: "김요양",
      imageUrl: "/diverse-woman-portrait.png",
    },
    {
      caregiverId: "2",
      caregiverName: "박요양",
      imageUrl: "/thoughtful-man.png",
    },
    {
      caregiverId: "3",
      caregiverName: "정요양",
      imageUrl: "/diverse-woman-portrait.png",
    },
    {
      caregiverId: "4",
      caregiverName: "최요양",
      imageUrl: "/thoughtful-man.png",
    },
    {
      caregiverId: "5",
      caregiverName: "이요양",
      imageUrl: "/diverse-woman-portrait.png",
    },
  ],
  patients = [
    { id: "1", name: "이환자", address: "서울시 강남구" },
    { id: "2", name: "최환자", address: "서울시 서초구" },
    { id: "3", name: "강환자", address: "서울시 송파구" },
    { id: "4", name: "윤환자", address: "서울시 마포구" },
    { id: "5", name: "장환자", address: "서울시 용산구" },
  ],
  scheduleEvents = [
    {
      scheduleId: 1,
      caregiverId: 1,
      patientId: 1,
      scheduleDate: new Date(2025, 5, 2), // 2025-06-02
      startTime: "09:00",
      endTime: "12:00",
      patientName: "이환자",
    },
    {
      scheduleId: 2,
      caregiverId: 1,
      patientId: 1,
      scheduleDate: new Date(2025, 5, 5), // 2025-06-05
      startTime: "09:00",
      endTime: "12:00",
      patientName: "박환자",
    },
    {
      scheduleId: 3,
      caregiverId: 1,
      patientId: 1,
      scheduleDate: new Date(2025, 5, 3), // 2025-06-03
      startTime: "09:00",
      endTime: "12:00",
      patientName: "김환자",
    },
    {
      scheduleId: 4,
      caregiverId: 2,
      patientId: 2,
      scheduleDate: new Date(2025, 5, 8), // 2025-06-08
      startTime: "14:00",
      endTime: "17:00",
      patientName: "이환자",
    },
    {
      scheduleId: 5,
      caregiverId: 2,
      patientId: 2,
      scheduleDate: new Date(2025, 5, 5), // 2025-06-05
      startTime: "14:00",
      endTime: "17:00",
      patientName: "박환자",
    },
    {
      scheduleId: 6,
      caregiverId: 3,
      patientId: 3,
      scheduleDate: new Date(2025, 5, 3), // 2025-06-03
      startTime: "10:00",
      endTime: "13:00",
      patientName: "조환자",
    },
    {
      scheduleId: 7,
      caregiverId: 3,
      patientId: 3,
      scheduleDate: new Date(2025, 5, 4), // 2025-06-04
      startTime: "10:00",
      endTime: "13:00",
      patientName: "이환자",
    },
    {
      scheduleId: 8,
      caregiverId: 4,
      patientId: 4,
      scheduleDate: new Date(2025, 5, 4), // 2025-06-04
      startTime: "13:00",
      endTime: "16:00",
      patientName: "박환자",
    },
    {
      scheduleId: 9,
      caregiverId: 5,
      patientId: 5,
      scheduleDate: new Date(2025, 5, 8), // 2025-06-08
      startTime: "09:00",
      endTime: "12:00",
      patientName: "조환자",
    },
  ],
  caregiverNameList,
  refetchGetWorkSchedulesByWeek,
}: AdminScheduleOverviewProps) {
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedEventDetails, setSelectedEventDetails] = useState<{
    caregiver: Caregiver;
    patient: Patient;
    event: WorkScheduleItem;
  } | null>(null);

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

  // 요양보호사 정보 가져오기
  // TODO : caregiverNameList 바꾸기
  console.log("caregiverNameList", caregiverNameList);
  const getCaregiverById = (id: string) => {
    return caregivers.find((caregiver) => caregiver.caregiverId === id);
  };

  // 환자 정보 가져오기
  const getPatientById = (id: string) => {
    return patients.find((patient) => patient.id === id);
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (event: WorkScheduleItem) => {
    const caregiver = getCaregiverById(String(event.caregiverId));
    const patient = getPatientById(String(event.patientId));

    if (caregiver && patient) {
      setSelectedEventDetails({
        caregiver,
        patient,
        event,
      });
    }
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
            {/* TODO : caregiverNameList 추후 적용 */}
            {caregivers.map((caregiver) => (
              <React.Fragment key={caregiver.caregiverId}>
                {/* 요양보호사 이름 */}
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    {/* TODO : profileImage 내려달라고 할 것 .. */}
                    {/* caregiver.profileImage */}
                    <AvatarImage src={"/placeholder.svg"} />
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
                        const patient = getPatientById(String(event.patientId));
                        return (
                          <div
                            key={event.scheduleId}
                            className="mb-1 p-1 text-xs bg-primary/10 rounded text-primary border border-primary/20 cursor-pointer hover:bg-primary/20"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{patient?.name}</div>
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
              {selectedEventDetails?.caregiver.caregiverName} 요양보호사 -{" "}
              {selectedEventDetails?.patient.name} 님
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">날짜</p>
                <p className="text-base font-medium">
                  {selectedEventDetails?.event.scheduleDate &&
                    format(
                      selectedEventDetails.event.scheduleDate,
                      "yyyy년 MM월 dd일 (eee)",
                      { locale: ko }
                    )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">시간</p>
                <p className="text-base font-medium">
                  {selectedEventDetails?.event.startTime} -{" "}
                  {selectedEventDetails?.event.endTime}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">요양보호사</p>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={
                      selectedEventDetails?.caregiver.imageUrl ||
                      "/placeholder.svg"
                    }
                    alt={selectedEventDetails?.caregiver.caregiverName}
                  />
                  <AvatarFallback>
                    {selectedEventDetails?.caregiver.caregiverName[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-base font-medium">
                  {selectedEventDetails?.caregiver.caregiverName}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">보호대상자</p>
              <p className="text-base font-medium">
                {selectedEventDetails?.patient.name}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">주소</p>
              <p className="text-base">
                {selectedEventDetails?.patient.address}
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
            <Button>일정 수정</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

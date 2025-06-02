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

interface Caregiver {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Patient {
  id: string;
  name: string;
  address: string;
}

interface ScheduleEvent {
  id: string;
  caregiverId: string;
  patientId: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface AdminScheduleOverviewProps {
  caregivers: Caregiver[];
  patients: Patient[];
  scheduleEvents: ScheduleEvent[];
}

export function AdminScheduleOverview({
  caregivers = [
    { id: "1", name: "김요양", imageUrl: "/diverse-woman-portrait.png" },
    { id: "2", name: "박요양", imageUrl: "/thoughtful-man.png" },
    { id: "3", name: "정요양", imageUrl: "/diverse-woman-portrait.png" },
    { id: "4", name: "최요양", imageUrl: "/thoughtful-man.png" },
    { id: "5", name: "이요양", imageUrl: "/diverse-woman-portrait.png" },
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
      id: "1",
      caregiverId: "1",
      patientId: "1",
      date: new Date(2025, 4, 20), // 2025-05-20
      startTime: "09:00",
      endTime: "12:00",
    },
    {
      id: "2",
      caregiverId: "1",
      patientId: "1",
      date: new Date(2025, 4, 22), // 2025-05-22
      startTime: "09:00",
      endTime: "12:00",
    },
    {
      id: "3",
      caregiverId: "1",
      patientId: "1",
      date: new Date(2025, 4, 24), // 2025-05-24
      startTime: "09:00",
      endTime: "12:00",
    },
    {
      id: "4",
      caregiverId: "2",
      patientId: "2",
      date: new Date(2025, 4, 21), // 2025-05-21
      startTime: "14:00",
      endTime: "17:00",
    },
    {
      id: "5",
      caregiverId: "2",
      patientId: "2",
      date: new Date(2025, 4, 23), // 2025-05-23
      startTime: "14:00",
      endTime: "17:00",
    },
    {
      id: "6",
      caregiverId: "3",
      patientId: "3",
      date: new Date(2025, 4, 20), // 2025-05-20
      startTime: "10:00",
      endTime: "13:00",
    },
    {
      id: "7",
      caregiverId: "3",
      patientId: "3",
      date: new Date(2025, 4, 21), // 2025-05-21
      startTime: "10:00",
      endTime: "13:00",
    },
    {
      id: "8",
      caregiverId: "4",
      patientId: "4",
      date: new Date(2025, 4, 22), // 2025-05-22
      startTime: "13:00",
      endTime: "16:00",
    },
    {
      id: "9",
      caregiverId: "5",
      patientId: "5",
      date: new Date(2025, 4, 23), // 2025-05-23
      startTime: "09:00",
      endTime: "12:00",
    },
  ],
}: AdminScheduleOverviewProps) {
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedEventDetails, setSelectedEventDetails] = useState<{
    caregiver: Caregiver;
    patient: Patient;
    event: ScheduleEvent;
  } | null>(null);

  // 현재 주의 날짜들
  const currentWeekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  // 필터링된 요양보호사 - 모든 요양보호사 표시
  const filteredCaregivers = caregivers;

  // 필터링된 스케줄 이벤트 - 모든 이벤트 표시
  const filteredEvents = scheduleEvents;

  // 날짜별 이벤트 그룹화
  const eventsByDate = filteredEvents.reduce(
    (acc, event) => {
      const dateStr = format(event.date, "yyyy-MM-dd");
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    },
    {} as Record<string, ScheduleEvent[]>,
  );

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  // 날짜에 해당하는 일정 가져오기
  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return eventsByDate[dateStr] || [];
  };

  // 요양보호사 정보 가져오기
  const getCaregiverById = (id: string) => {
    return caregivers.find((caregiver) => caregiver.id === id);
  };

  // 환자 정보 가져오기
  const getPatientById = (id: string) => {
    return patients.find((patient) => patient.id === id);
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (event: ScheduleEvent) => {
    const caregiver = getCaregiverById(event.caregiverId);
    const patient = getPatientById(event.patientId);

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
                { locale: ko },
              )}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 기존 주간보기 그리드 내용 유지 */}
          <div className="grid grid-cols-7 gap-2">
            {currentWeekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div
                  className={cn(
                    "py-2 font-medium",
                    isToday(day) &&
                      "bg-primary text-primary-foreground rounded-md",
                  )}
                >
                  {format(day, "eee", { locale: ko })}
                  <br />
                  {format(day, "d")}
                </div>
              </div>
            ))}

            {/* 요양보호사별 행 */}
            {filteredCaregivers.map((caregiver) => (
              <React.Fragment key={caregiver.id}>
                {currentWeekDays.map((day, dayIndex) => {
                  const dayEvents = getEventsForDay(day).filter(
                    (event) => event.caregiverId === caregiver.id,
                  );
                  return (
                    <div
                      key={`${caregiver.id}-${dayIndex}`}
                      className={cn(
                        "min-h-[80px] border rounded-md p-1 overflow-y-auto",
                        dayIndex === 0 && "relative",
                      )}
                    >
                      {dayIndex === 0 && (
                        <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={caregiver.imageUrl || "/placeholder.svg"}
                              alt={caregiver.name}
                            />
                            <AvatarFallback>{caregiver.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {caregiver.name}
                          </span>
                        </div>
                      )}
                      {dayEvents.map((event) => {
                        const patient = getPatientById(event.patientId);
                        return (
                          <div
                            key={event.id}
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
              {selectedEventDetails?.caregiver.name} 요양보호사 -{" "}
              {selectedEventDetails?.patient.name} 님
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">날짜</p>
                <p className="text-base font-medium">
                  {selectedEventDetails?.event.date &&
                    format(
                      selectedEventDetails.event.date,
                      "yyyy년 MM월 dd일 (eee)",
                      { locale: ko },
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
                    alt={selectedEventDetails?.caregiver.name}
                  />
                  <AvatarFallback>
                    {selectedEventDetails?.caregiver.name[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-base font-medium">
                  {selectedEventDetails?.caregiver.name}
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

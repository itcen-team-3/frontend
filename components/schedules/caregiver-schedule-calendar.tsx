"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduleEvent {
  id: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
}

interface CaregiverScheduleCalendarProps {
  caregiverName: string;
  scheduleEvents: ScheduleEvent[];
}

export function CaregiverScheduleCalendar({
  caregiverName = "김요양",
  scheduleEvents = [
    {
      id: "1",
      patientName: "이환자",
      date: new Date(2025, 4, 20), // 2025-05-20
      startTime: "09:00",
      endTime: "12:00",
      location: "서울시 강남구",
    },
    {
      id: "2",
      patientName: "이환자",
      date: new Date(2025, 4, 22), // 2025-05-22
      startTime: "09:00",
      endTime: "12:00",
      location: "서울시 강남구",
    },
    {
      id: "3",
      patientName: "이환자",
      date: new Date(2025, 4, 24), // 2025-05-24
      startTime: "09:00",
      endTime: "12:00",
      location: "서울시 강남구",
    },
    {
      id: "4",
      patientName: "최환자",
      date: new Date(2025, 4, 21), // 2025-05-21
      startTime: "14:00",
      endTime: "17:00",
      location: "서울시 서초구",
    },
    {
      id: "5",
      patientName: "최환자",
      date: new Date(2025, 4, 23), // 2025-05-23
      startTime: "14:00",
      endTime: "17:00",
      location: "서울시 서초구",
    },
  ],
}: CaregiverScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [activeView, setActiveView] = useState<string>("month");

  console.log("activeView", activeView);

  // 선택된 날짜의 일정
  const selectedDateEvents = scheduleEvents.filter((event) =>
    isSameDay(event.date, selectedDate),
  );

  // 현재 주의 날짜들
  const currentWeekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  // 현재 주의 일정
  const currentWeekEvents = scheduleEvents.filter((event) =>
    currentWeekDays.some((day) => isSameDay(day, event.date)),
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
    return scheduleEvents.filter((event) => isSameDay(event.date, date));
  };

  return (
    <PageContainer>
      <PageHeader
        title="근무 일정"
        description={`${caregiverName}님의 근무 일정을 확인하세요`}
      />

      <Tabs
        defaultValue="month"
        className="w-full"
        onValueChange={setActiveView}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="month" className="text-lg">
            월간 보기
          </TabsTrigger>
          <TabsTrigger value="week" className="text-lg">
            주간 보기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="card-shadow md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">날짜 선택</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: (date) =>
                      scheduleEvents.some((event) =>
                        isSameDay(event.date, date),
                      ),
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

            <Card className="card-shadow md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">
                  {format(selectedDate, "yyyy년 MM월 dd일 (eee)", {
                    locale: ko,
                  })}{" "}
                  일정
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">
                            {event.patientName} 님
                          </h3>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        </div>
                        <p className="text-base text-muted-foreground">
                          {event.location}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    선택한 날짜에 일정이 없습니다
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl">
                  {format(currentWeekStart, "yyyy년 MM월 dd일", { locale: ko })}{" "}
                  ~{" "}
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
              <div className="grid grid-cols-7 gap-2">
                {currentWeekDays.map((day, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={cn(
                        "py-2 font-medium",
                        isSameDay(day, new Date()) &&
                          "bg-primary text-primary-foreground rounded-md",
                      )}
                    >
                      {format(day, "eee", { locale: ko })}
                      <br />
                      {format(day, "d")}
                    </div>
                  </div>
                ))}

                {currentWeekDays.map((day, index) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={`events-${index}`}
                      className="min-h-[120px] border rounded-md p-1 overflow-y-auto"
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="mb-1 p-1 text-xs bg-primary/10 rounded text-primary border border-primary/20"
                        >
                          <div className="font-medium">{event.patientName}</div>
                          <div>
                            {event.startTime}-{event.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {currentWeekEvents.length > 0 ? (
            <Card className="card-shadow mt-6">
              <CardHeader>
                <CardTitle className="text-xl">이번 주 일정 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentWeekEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">
                          {event.patientName} 님
                        </h3>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-base text-muted-foreground">
                          {event.location}
                        </p>
                        <p className="text-sm font-medium">
                          {format(event.date, "MM월 dd일 (eee)", {
                            locale: ko,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

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
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkScheduleItem } from "@/lib/types/workSchedule";

interface CaregiverScheduleCalendarProps {
  date: Date;
  setDate: (args: Date) => void;
  caregiverScheduleByDay: WorkScheduleItem[];
  isCaregiverScheduleByDayLoading: boolean;
  setDtartOfWeek: (args: Date) => void;
  caregiverScheduleByWeek: WorkScheduleItem[];
  isCaregiverScheduleByWeekLoading: boolean;
}

export function CaregiverScheduleCalendar({
  date,
  caregiverScheduleByDay,
  setDate,
  isCaregiverScheduleByDayLoading,
  setDtartOfWeek,
  caregiverScheduleByWeek,
  isCaregiverScheduleByWeekLoading,
}: CaregiverScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [activeView, setActiveView] = useState<string>("month");

  // 현재 주의 날짜들
  const currentWeekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
  });

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const onSelectDate = (date: Date | undefined) => {
    if (date) {
      console.log(activeView); // TODO : 추후 지우기
      setSelectedDate(date);
      setDate(date);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="근무 일정" description={`근무 일정을 확인하세요`} />

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
                  onSelect={(date) => onSelectDate(date)}
                  className="rounded-md border"
                  classNames={{
                    months:
                      "relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
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
                {isCaregiverScheduleByDayLoading ? (
                  <Loader2 />
                ) : caregiverScheduleByDay.length > 0 ? (
                  <div className="space-y-4">
                    {caregiverScheduleByDay.map((event) => (
                      <div
                        key={event.scheduleId}
                        className="p-4 border rounded-lg"
                      >
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
                          {event.patientAddress}
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
                  <div
                    key={index}
                    className="text-center"
                    onClick={() => {
                      setSelectedDate(day);
                      setDtartOfWeek(day);
                    }}
                  >
                    <div
                      className={cn(
                        "py-2 font-medium rounded-md",
                        isSameDay(day, selectedDate) && "bg-black text-white",
                        !isSameDay(day, selectedDate) ||
                          (isSameDay(day, new Date()) &&
                            "bg-primary text-primary-foreground"),
                      )}
                    >
                      {format(day, "eee", { locale: ko })}
                      <br />
                      {format(day, "d")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {caregiverScheduleByWeek.length > 0 ? (
            <Card className="card-shadow mt-6">
              <CardHeader>
                <CardTitle className="text-xl">이번 주 일정 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isCaregiverScheduleByWeekLoading ? (
                    <Loader2 />
                  ) : (
                    caregiverScheduleByWeek.map((event, index) => (
                      <div
                        key={`${event.scheduleId}_${index}`}
                        className="p-4 border rounded-lg"
                      >
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
                            {event.patientAddress}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="flex justify-center items-center h-[100px] pt-6">
                  등록된 일정이 없습니다.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

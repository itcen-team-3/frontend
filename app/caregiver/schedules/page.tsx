"use client";

import { useState } from "react";
import { CaregiverScheduleCalendar } from "@/components/schedules/caregiver-schedule-calendar";
import { useGetCaregiverWorkSchedulesByDay } from "@/features/workschedule/useGetCaregiverWorkSchedulesByDay";
import { useGetCaregiverWorkSchedulesByWeek } from "@/features/workschedule/useGetCaregiverWorkSchedulesByWeek";
import { startOfWeek } from "date-fns";

export default function ScheduleCalendarPage() {
  const [date, setDate] = useState(new Date());
  const [startDateOfWeek, setDtartOfWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const { caregiverScheduleByDay, isCaregiverScheduleByDayLoading } =
    useGetCaregiverWorkSchedulesByDay(date);
  const { caregiverScheduleByWeek, isCaregiverScheduleByWeekLoading } =
    useGetCaregiverWorkSchedulesByWeek(startDateOfWeek);

  console.log("caregiverScheduleByWeek", caregiverScheduleByWeek);

  return (
    <CaregiverScheduleCalendar
      date={date}
      setDate={setDate}
      caregiverScheduleByDay={caregiverScheduleByDay?.scheduleDay || []}
      isCaregiverScheduleByDayLoading={isCaregiverScheduleByDayLoading}
      setDtartOfWeek={setDtartOfWeek}
      caregiverScheduleByWeek={caregiverScheduleByWeek?.scheduleWeek || []}
      isCaregiverScheduleByWeekLoading={isCaregiverScheduleByWeekLoading}
    />
  );
}

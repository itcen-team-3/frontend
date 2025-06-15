"use client";

import { useState } from "react";
import { CaregiverScheduleCalendar } from "@/components/schedules/caregiver-schedule-calendar";
import { useGetCaregiverWorkSchedulesByDay } from "@/features/workschedule/useGetCaregiverWorkSchedulesByDay";

export default function ScheduleCalendarPage() {
  const [date, setDate] = useState(new Date());

  const { caregiverScheduleByDay, isCaregiverScheduleByDayLoading } =
    useGetCaregiverWorkSchedulesByDay(date);

  return (
    <CaregiverScheduleCalendar
      date={date}
      setDate={setDate}
      caregiverScheduleByDay={caregiverScheduleByDay?.scheduleDay || []}
      isCaregiverScheduleByDayLoading={isCaregiverScheduleByDayLoading}
      caregiverScheduleByWeek={caregiverScheduleByDay?.scheduleDay || []}
    />
  );
}

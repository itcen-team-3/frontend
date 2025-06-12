"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { ErrorMessage } from "@/lib/types/api";
import { format } from "date-fns";
import { CaregiverWorkSchedulesByDayResponse } from "@/lib/types/workSchedule";

export const useGetCaregiverWorkSchedulesByDay = (date: Date | undefined) => {
  const [caregiverScheduleByDay, setCaregiverScheduleByDay] =
    useState<CaregiverWorkSchedulesByDayResponse | null>(null);
  const [isCaregiverScheduleByDayLoading, setIsCaregiverScheduleByDayLoading] =
    useState(true);
  const [errorCaregiverScheduleByDay, setErrorCaregiverScheduleByDay] =
    useState<ErrorMessage>({
      code: 0,
      message: "",
    });

  useEffect(() => {
    if (!date) return;

    const fetchCaregiverWorkSchedulesByDay = async () => {
      setIsCaregiverScheduleByDayLoading(true);
      setErrorCaregiverScheduleByDay({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CaregiverWorkSchedulesByDayResponse>(
          `/work-schedule/care-giver/day/${format(date, "yyyy-MM-dd")}`
        );

        setCaregiverScheduleByDay({
          ...res.data,
          scheduleDay: res.data.scheduleDay.map((item) => ({
            ...item,
            startTime: item.startTime.slice(0, 5),
            endTime: item.endTime.slice(0, 5),
          })),
        });
      } catch (e: any) {
        setErrorCaregiverScheduleByDay({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "요양보호사 스케줄 연월일 리스트 조회에 실패했습니다.",
        });
      } finally {
        setIsCaregiverScheduleByDayLoading(false);
      }
    };

    fetchCaregiverWorkSchedulesByDay();
  }, [date]);

  return {
    caregiverScheduleByDay,
    isCaregiverScheduleByDayLoading,
    errorCaregiverScheduleByDay,
  };
};

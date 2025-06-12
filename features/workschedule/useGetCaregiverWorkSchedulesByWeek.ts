"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { ErrorMessage } from "@/lib/types/api";
import { format } from "date-fns";
import { CaregiverWorkSchedulesByWeekResponse } from "@/lib/types/workSchedule";

export const useGetCaregiverWorkSchedulesByWeek = (date: Date | undefined) => {
  const [caregiverScheduleByWeek, setCaregiverScheduleByWeek] = useState<
    any | null
  >(null);
  const [
    isCaregiverScheduleByWeekLoading,
    setIsCaregiverScheduleByWeekLoading,
  ] = useState(true);
  const [errorCaregiverScheduleByWeek, setErrorCaregiverScheduleByWeek] =
    useState<ErrorMessage>({
      code: 0,
      message: "",
    });

  useEffect(() => {
    if (!date) return;

    const fetchCaregiverWorkSchedulesByDay = async () => {
      setIsCaregiverScheduleByWeekLoading(true);
      setErrorCaregiverScheduleByWeek({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CaregiverWorkSchedulesByWeekResponse>(
          `/work-schedule/care-giver/week/${format(date, "yyyy-MM-dd")}`
        );

        setCaregiverScheduleByWeek({
          ...res.data,
          scheduleWeek: res.data.scheduleWeek.map((item) => ({
            ...item,
            startTime: item.startTime.slice(0, 5),
            endTime: item.endTime.slice(0, 5),
          })),
        });
      } catch (e: any) {
        setErrorCaregiverScheduleByWeek({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "요양보호사 스케줄 주간 리스트 조회에 실패했습니다.",
        });
      } finally {
        setIsCaregiverScheduleByWeekLoading(false);
      }
    };

    fetchCaregiverWorkSchedulesByDay();
  }, [date]);

  return {
    caregiverScheduleByWeek,
    isCaregiverScheduleByWeekLoading,
    errorCaregiverScheduleByWeek,
  };
};

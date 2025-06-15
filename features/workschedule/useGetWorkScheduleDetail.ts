"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { ErrorMessage } from "@/lib/types/api";
import { WorkScheduleRequest } from "@/lib/types/workSchedule";
import { decodeBitmaskToBitValues } from "@/lib/utils";

export const useGetWorkScheduleDetail = (scheduleId: string | undefined) => {
  const [data, setData] = useState<WorkScheduleRequest | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    if (!scheduleId) return;

    const fetchWorkScheduleDetail = async () => {
      setLoading(true);
      setError({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<WorkScheduleRequest>(
          `/work-schedule/${scheduleId}`,
        );

        setData({
          ...res.data,
          // endDate: format(new Date(res.data.endDate || ""), "yyyy-MM-dd"),
          // startDate: format(new Date(res.data.startDate || ""), "yyyy-MM-dd"),
          endDate: new Date(res.data.endDate || ""),
          startDate: new Date(res.data.startDate || ""),
          startTime: res.data.startTime.slice(0, 5),
          endTime: res.data.endTime.slice(0, 5),
          days: decodeBitmaskToBitValues(res.data.workDay),
        });
      } catch (e: any) {
        setError({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "보호대상자 정보 조회에 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkScheduleDetail();
  }, [scheduleId]);

  return { data, isLoading, error };
};

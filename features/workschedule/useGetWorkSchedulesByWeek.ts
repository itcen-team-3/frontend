import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/http";
import { ErrorMessage } from "@/lib/types/api";
import { useGetCaregiverNameList } from "../member/useGetCaregiverNameList";
import {
  AllWorkScheduleWeekResponse,
  AllWorkScheduleWeekRequest,
} from "@/lib/types/workSchedule";

export const useGetWorkSchedulesByWeek = (startDate: string) => {
  const [data, setData] = useState<AllWorkScheduleWeekResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage>({ code: 0, message: "" });

  const { caregiverNameList } = useGetCaregiverNameList();

  const fetchWorkSchedulesByWeek = useCallback(
    async (startDate: string) => {
      setLoading(true);
      setError({ code: 0, message: "" });

      console.log("startDate", startDate);

      try {
        const caregiverIds =
          caregiverNameList?.caregivers.map((item) => ({
            caregiverId: item.caregiverId,
          })) || [];

        const res = await api.post<
          AllWorkScheduleWeekResponse,
          AllWorkScheduleWeekRequest
        >("/work-schedule/admin/week", {
          body: {
            startDate,
            caregiverIds,
          },
        });

        res.data.schedulesWeek.forEach((item) => {
          item.scheduleDate = new Date(item.scheduleDate || "");
          item.startTime = item.startTime.slice(0, 5);
          item.endTime = item.endTime.slice(0, 5);
        });

        console.log("res.data", res.data);

        setData(res.data);
      } catch (e: any) {
        setError({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "요양보호사 주별 스케줄 조회에 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    },
    [caregiverNameList?.caregivers]
  );

  useEffect(() => {
    if (
      caregiverNameList?.caregivers &&
      caregiverNameList.caregivers.length > 0
    ) {
      fetchWorkSchedulesByWeek(startDate);
    }
  }, [caregiverNameList, fetchWorkSchedulesByWeek, startDate]);

  return {
    data,
    isLoading,
    error,
    caregiverNameList,
    refetchGetWorkSchedulesByWeek: fetchWorkSchedulesByWeek,
  };
};

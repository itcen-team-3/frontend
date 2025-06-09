"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { CaregiverDetailResponse } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetWorkScheduleForPopup = (scheduleId: string | undefined) => {
  const [popupData, setDataPopupData] =
    useState<CaregiverDetailResponse | null>(null);
  const [isPopupLoading, setPopupLoading] = useState(true);
  const [errorPopup, setErrorPopup] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    if (!scheduleId) return;

    const fetchWorkSchedule = async () => {
      setPopupLoading(true);
      setErrorPopup({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CaregiverDetailResponse>(
          `/work-schedule/admin/day/${scheduleId}`
        );

        setDataPopupData(res.data);
      } catch (e: any) {
        setErrorPopup({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "스케줄 팝업 정보 조회에 실패했습니다.",
        });
      } finally {
        setPopupLoading(false);
      }
    };

    fetchWorkSchedule();
  }, [scheduleId]);

  return { popupData, isPopupLoading, errorPopup };
};

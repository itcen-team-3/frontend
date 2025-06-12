"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { CaregiverDashboardInfoResponse } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetDashboardInfo = () => {
  const [dashboardInfo, setDashboardInfo] =
    useState<CaregiverDashboardInfoResponse | null>(null);
  const [isDashboardInfoLoading, setIsDashboardInfoLoading] = useState(true);
  const [errorDashboardInfo, setErrorDashboardInfo] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    const fetchCaregiverDashboardInfo = async () => {
      setIsDashboardInfoLoading(true);
      setErrorDashboardInfo({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CaregiverDashboardInfoResponse>(
          "/member/caregiver/dashboard"
        );

        setDashboardInfo(res.data);
      } catch (e: any) {
        setErrorDashboardInfo({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "요양보호사 대시보드 정보 조회에 실패했습니다.",
        });
      } finally {
        setIsDashboardInfoLoading(false);
      }
    };

    fetchCaregiverDashboardInfo();
  }, []);

  return { dashboardInfo, isDashboardInfoLoading, errorDashboardInfo };
};

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { ErrorMessage } from "@/lib/types/api";
import { FamilyCareLogDetail } from "@/lib/types/familyCareLog";

export const useGetFamilyCareLogDetail = (logId: string | undefined) => {
  const [data, setData] = useState<FamilyCareLogDetail | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    if (!logId) return;

    const fetchFamilyCareLogDetail = async () => {
      setLoading(true);
      setError({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<FamilyCareLogDetail>(
          `/family-care-logs/${logId}`
        );

        setData({
          ...res.data,
          date: new Date(res.data.date).toISOString().split('T')[0],
          startTime: res.data.startTime.slice(0, 5),
          endTime: res.data.endTime.slice(0, 5),
        });
      } catch (e: any) {
        setError({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "돌봄 일지 상세 정보 조회에 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyCareLogDetail();
  }, [logId]);

  return { data, isLoading, error };
};

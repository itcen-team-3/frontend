"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { CaregiverInfoRequest } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetCaregiverForUpdate = (caregiverId: string | undefined) => {
  const [data, setData] = useState<CaregiverInfoRequest | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    if (!caregiverId) return;

    const fetchCaregiver = async () => {
      setLoading(true);
      setError({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CaregiverInfoRequest>(
          `/member/caregiver/${caregiverId}`
        );
        setData({
          ...res.data,
          birthDate: res.data.birthDate
            ? new Date(res.data.birthDate)
            : undefined,
        });
      } catch (e: any) {
        setError({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "요양보호사 정보 조회에 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiver();
  }, [caregiverId]);

  return { data, isLoading, error };
};

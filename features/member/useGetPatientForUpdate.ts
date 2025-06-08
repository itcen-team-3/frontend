"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { PatientInfoRequest } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";
import { format } from "date-fns";

export const useGetPatientForUpdate = (patientId: string | undefined) => {
  const [data, setData] = useState<PatientInfoRequest | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      setLoading(true);
      setError({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<PatientInfoRequest>(
          `/member/patient/${patientId}`
        );
        setData({
          ...res.data,
          birthDate: format(new Date(res.data.birthDate || ""), "yyyy-MM-dd"),
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

    fetchPatient();
  }, [patientId]);

  return { data, isLoading, error };
};

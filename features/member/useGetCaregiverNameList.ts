"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { CaregiverNameListResponse } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetCaregiverNameList = () => {
  const [caregiverNameList, setCaregiverNameList] =
    useState<CaregiverNameListResponse | null>(null);
  const [isCaregiverNameListLoading, setIsCaregiverNameListLoading] =
    useState(true);
  const [errorCaregiverNameList, setErrorCaregiverNameList] =
    useState<ErrorMessage>({
      code: 0,
      message: "",
    });

  useEffect(() => {
    const fetchCaregiverNameList = async () => {
      setIsCaregiverNameListLoading(true);
      setErrorCaregiverNameList({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CaregiverNameListResponse>(
          "/member/caregiver-name-list",
        );
        setCaregiverNameList(res.data);
      } catch (e: any) {
        setErrorCaregiverNameList({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "요양보호사 이름 리스트 조회에 실패했습니다.",
        });
      } finally {
        setIsCaregiverNameListLoading(false);
      }
    };

    fetchCaregiverNameList();
  }, []);

  return {
    caregiverNameList,
    isCaregiverNameListLoading,
    errorCaregiverNameList,
  };
};

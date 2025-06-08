"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { PatientNameListResponse } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetPatientNameList = () => {
  const [patientNameList, setPatientNameList] =
    useState<PatientNameListResponse | null>(null);
  const [isPatientNameListLoading, setIsPatientNameListLoading] =
    useState(true);
  const [errorPatientNameList, setErrorPatientNameList] =
    useState<ErrorMessage>({
      code: 0,
      message: "",
    });

  useEffect(() => {
    const fetchPatientNameList = async () => {
      setIsPatientNameListLoading(true);
      setErrorPatientNameList({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<PatientNameListResponse>(
          "/member/patient-name-list"
        );
        setPatientNameList(res.data);
      } catch (e: any) {
        setErrorPatientNameList({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "보호대상자 이름 리스트 조회에 실패했습니다.",
        });
      } finally {
        setIsPatientNameListLoading(false);
      }
    };

    fetchPatientNameList();
  }, []);

  return {
    patientNameList,
    isPatientNameListLoading,
    errorPatientNameList,
  };
};

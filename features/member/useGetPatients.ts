"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { PatientListResponse } from "@/lib/types/member";

export const useGetPatients = (searchName: string) => {
  const [data, setData] = useState<PatientListResponse>();
  const [isLoading, setLoading] = useState(true);
  const [errorGetPatients, setErrorGetPatients] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async (searchName: string) => {
    setLoading(true);
    setErrorGetPatients({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<PatientListResponse>("/member/patient/list", {
        query: searchName.length ? { searchName } : {},
      });

      setData(res.data);
    } catch (e: any) {
      setErrorGetPatients({
        code: 0,
        message: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(searchName);
  }, [searchName]);

  return {
    data,
    isLoading,
    errorGetPatients,
    refetchGetPatients: fetchList,
  };
};

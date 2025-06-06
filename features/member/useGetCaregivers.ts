"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { CaregiverListResponse } from "@/lib/types/member";

export const useGetCaregivers = (searchName: string) => {
  const [data, setData] = useState<CaregiverListResponse>();
  const [isLoading, setLoading] = useState(true);
  const [errorGetCaregivers, setErrorGetCaregivers] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async (searchName: string) => {
    setLoading(true);
    setErrorGetCaregivers({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<CaregiverListResponse>(
        "/member/caregiver/list",
        { query: searchName.length ? { searchName } : {} }
      );
      setData(res.data);
    } catch (e: any) {
      setErrorGetCaregivers({
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
    errorGetCaregivers,
    refetchGetCaregivers: fetchList,
  };
};

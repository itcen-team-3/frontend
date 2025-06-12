"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

export const useGetCaregiverCareLogs = () => {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [errorGetCaregiverCareLogs, setErrorGetCaregiverCareLogs] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async () => {
    setLoading(true);
    setErrorGetCaregiverCareLogs({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<any>("/care_log");
      setData(res.data);
    } catch (e: any) {
      setErrorGetCaregiverCareLogs({
        code: 0,
        message: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return {
    data,
    isLoading,
    errorGetCaregiverCareLogs,
    refetchGetCaregiverCareLogs: fetchList,
  };
};

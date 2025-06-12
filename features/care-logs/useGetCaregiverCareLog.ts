"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

export const useGetCaregiverCareLog = (careLogId: string) => {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [errorGetCaregiverCareLog, setErrorGetCaregiverCareLog] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async (careLogId: string) => {
    setLoading(true);
    setErrorGetCaregiverCareLog({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<any>(`/care_log/${careLogId}`);
      setData({
        ...res.data,
        startTime: res.data.startTime.slice(0, 5),
        endTime: res.data.endTime.slice(0, 5),
      });
    } catch (e: any) {
      setErrorGetCaregiverCareLog({
        code: 0,
        message: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(careLogId);
  }, [careLogId]);

  return {
    data,
    isLoading,
    errorGetCaregiverCareLog,
    refetchGetCaregiverCareLog: fetchList,
  };
};

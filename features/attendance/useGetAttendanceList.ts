"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

export const useGetAttendanceList = () => {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [errorGetAttendanceList, setErrorGetAttendanceList] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async () => {
    setLoading(true);
    setErrorGetAttendanceList({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<any>("/attendance-explation/admin");
      setData({
        ...res.data,
        startTime: res.data.startTime.slice(0, 5),
        endTime: res.data.endTime.slice(0, 5),
      });
    } catch (e: any) {
      setErrorGetAttendanceList({
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
    errorGetAttendanceList,
    refetchGetAttendanceList: fetchList,
  };
};

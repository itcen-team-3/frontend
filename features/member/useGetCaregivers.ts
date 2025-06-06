"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { CaregiverListResponse } from "@/lib/types/member";

export const useGetCaregivers = (searchName: string) => {
  const [data, setData] = useState<CaregiverListResponse>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError({
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
        setError({
          code: 0,
          message: e?.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [searchName]);

  return { data, isLoading, error };
};

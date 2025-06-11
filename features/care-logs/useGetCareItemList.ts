"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import { ErrorMessage } from "@/lib/types/api";
import { CareItem } from "@/lib/types/careLogs";

export const useGetCareItemList = () => {
  const [careItemList, setCareItemList] = useState<CareItem[]>([]);
  const [isCareItemListLoading, setIsCareItemListLoading] = useState(true);
  const [errorCareItemList, setErrorCareItemList] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    const fetchCareItemList = async () => {
      setIsCareItemListLoading(true);
      setErrorCareItemList({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<CareItem[]>("/care_item");
        setCareItemList(res.data);
      } catch (e: any) {
        setErrorCareItemList({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "돌봄일지 항목 리스트 조회에 실패했습니다.",
        });
      } finally {
        setIsCareItemListLoading(false);
      }
    };

    fetchCareItemList();
  }, []);

  return {
    careItemList,
    isCareItemListLoading,
    errorCareItemList,
  };
};

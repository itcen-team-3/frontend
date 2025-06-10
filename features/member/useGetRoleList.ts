"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { RoleItem } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetRoleList = () => {
  const [roleNameList, setRoleNameList] = useState<RoleItem[] | null>(null);
  const [isRoleListLoading, setIsRoleListLoading] = useState(true);
  const [errorRoleList, setErrorRoleList] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    const fetchRoleList = async () => {
      setIsRoleListLoading(true);
      setErrorRoleList({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<RoleItem[]>("/member/role-name-list");

        setRoleNameList(res.data);
      } catch (e: any) {
        setErrorRoleList({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message || "역할 리스트 조회에 실패했습니다.",
        });
      } finally {
        setIsRoleListLoading(false);
      }
    };

    fetchRoleList();
  }, []);

  return {
    roleNameList,
    isRoleListLoading,
    errorRoleList,
  };
};

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { RoleNameItem } from "@/lib/types/member";
import { ErrorMessage } from "@/lib/types/api";

export const useGetNameListByRole = (role: string) => {
  const [nameListByRole, setNameListByRole] = useState<RoleNameItem[] | null>(
    null
  );
  const [isNameListByRoleLoading, setNameListByRoleLoading] = useState(true);
  const [errorNameListByRole, setErrorNameListByRole] = useState<ErrorMessage>({
    code: 0,
    message: "",
  });

  useEffect(() => {
    const fetchNameListByRole = async (role: string) => {
      setNameListByRoleLoading(true);
      setErrorNameListByRole({
        code: 0,
        message: "",
      });

      try {
        const res = await api.get<RoleNameItem[]>(
          "/member/account/member-name-list",
          { query: { role } }
        );

        setNameListByRole(res.data);
      } catch (e: any) {
        setErrorNameListByRole({
          code: e?.response?.status || 500,
          message:
            e?.response?.data?.message ||
            "역할별 이름 리스트 조회에 실패했습니다.",
        });
      } finally {
        setNameListByRoleLoading(false);
      }
    };

    fetchNameListByRole(role);
  }, [role]);

  return {
    nameListByRole,
    isNameListByRoleLoading,
    errorNameListByRole,
  };
};

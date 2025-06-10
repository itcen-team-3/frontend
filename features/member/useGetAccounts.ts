"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";
import type { AccountResponse } from "@/lib/types/member";

export const useGetAccounts = (searchName: string, searchRole: string) => {
  const [data, setData] = useState<AccountResponse>();
  const [isGetAccountsLoading, setIsGetAccountsLoading] = useState(true);
  const [errorGetAccounts, setErrorGetAccounts] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async (searchName: string, searchRole: string) => {
    setIsGetAccountsLoading(true);
    setErrorGetAccounts({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<AccountResponse>("/member/account/list", {
        query: {
          ...(searchName.length ? { searchName } : {}),
          ...(searchRole.length ? { searchRole } : {}),
        },
      });
      setData(res.data);
    } catch (e: any) {
      setErrorGetAccounts({
        code: 0,
        message: e?.message,
      });
    } finally {
      setIsGetAccountsLoading(false);
    }
  };

  useEffect(() => {
    fetchList(searchName, searchRole);
  }, [searchName, searchRole]);

  return {
    data,
    isGetAccountsLoading,
    errorGetAccounts,
    refetchGetAccounts: fetchList,
  };
};

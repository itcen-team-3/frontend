"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import type { RoleRequest, SignInRequest } from "@/lib/types/member";
import { useRouter } from "next/navigation";

export const useCreateAccount = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [errorCreateAccount, setErrorCreateAccount] = useState({
    code: 0,
    message: "",
  });

  const createAccount = async (data: RoleRequest) => {
    setLoading(true);
    setErrorCreateAccount({
      code: 0,
      message: "",
    });

    try {
      const res = await api.post<RoleRequest, SignInRequest>(
        `/member/account/${data.memberId}`,
        {
          body: {
            loginId: data.id,
            loginPw: data.password,
          },
        }
      );

      if (res.code < 300) {
        console.log("계정 등록 성공");
        router.push("/admin/accounts");
      }
    } catch (e: any) {
      setErrorCreateAccount({
        code: 0,
        message: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createAccount,
    isLoading,
    errorCreateAccount,
  };
};

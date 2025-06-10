"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import type { PasswordRequest } from "@/lib/types/member";

export const useEditPassword = () => {
  const router = useRouter();

  const [isEditPasswordLoading, setIsEditPasswordLoading] = useState(false);
  const [errorEditPassword, setErrorEditPassword] = useState({
    code: 0,
    message: "",
  });

  const editPassword = async (memberId: string, body: PasswordRequest) => {
    if (!memberId) return;

    setIsEditPasswordLoading(true);
    setErrorEditPassword({ code: 0, message: "" });

    try {
      const res = await api.patch(`/member/account/pw/${memberId}`, {
        body,
      });

      if (res.code < 300) {
        console.log("비밀번호 수정 성공");
        router.push("/admin/accounts");
      }
    } catch (e: any) {
      setErrorEditPassword({
        code: e?.code || 0,
        message: e?.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsEditPasswordLoading(false);
    }
  };

  return { editPassword, isEditPasswordLoading, errorEditPassword };
};

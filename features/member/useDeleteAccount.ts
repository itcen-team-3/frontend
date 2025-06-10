"use client";

import { useState } from "react";
import { api } from "@/lib/http";

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDeleteAccount, setErrorDeleteAccount] = useState<{
    code: number;
    message: string;
  }>({
    code: 0,
    message: "",
  });

  const deleteAccount = async (memberId: string) => {
    setIsDeleting(true);
    setErrorDeleteAccount({ code: 0, message: "" });

    try {
      if (memberId === null) {
        return;
      }

      const res = await api.del(`/member/account/${memberId}`);
      return res;
    } catch (e: any) {
      setErrorDeleteAccount({
        code: e?.code || 0,
        message: e?.message || "삭제 중 오류가 발생했습니다.",
      });
      throw e;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting, errorDeleteAccount };
};

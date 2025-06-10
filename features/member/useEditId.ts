"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import type { IdRequest } from "@/lib/types/member";

export const useEditId = () => {
  const router = useRouter();

  const [isEditIdLoading, setIsEditIdLoading] = useState(false);
  const [errorEditId, setErrorEditId] = useState({
    code: 0,
    message: "",
  });

  const editId = async (memberId: string, body: IdRequest) => {
    if (!memberId) return;

    setIsEditIdLoading(true);
    setErrorEditId({ code: 0, message: "" });

    try {
      const res = await api.patch(`/member/account/id/${memberId}`, {
        body,
      });

      if (res.code < 300) {
        console.log("아이디 수정 성공");
        router.push("/admin/accounts");
      }
    } catch (e: any) {
      setErrorEditId({
        code: e?.code || 0,
        message: e?.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsEditIdLoading(false);
    }
  };

  return { editId, isEditIdLoading, errorEditId };
};

"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";

export const useCreateWorkEnd = () => {
  const router = useRouter();
  const [isWorkEndLoading, setWorkEndLoading] = useState(false);
  const [errorWorkEnd, setErrorWorkEnd] = useState({
    code: 0,
    message: "",
  });

  const createWorkEnd = async (uuid: string) => {
    setWorkEndLoading(true);
    setErrorWorkEnd({ code: 0, message: "" });

    try {
      const res = await api.post(`/nfc/end_work/${uuid}`);

      if (res.code < 300) {
        console.log("퇴근 체크 성공");
        localStorage.removeItem("check-in");
        router.push("/caregiver/dashboard");
      }
    } catch (e: any) {
      setErrorWorkEnd({
        code: e?.code || 0,
        message: e?.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setWorkEndLoading(false);
    }
  };

  return { createWorkEnd, isWorkEndLoading, errorWorkEnd };
};

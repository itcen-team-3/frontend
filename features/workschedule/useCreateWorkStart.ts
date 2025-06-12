"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";

export const useCreateWorkStart = () => {
  const router = useRouter();
  const [isWorkStartLoading, setWorkStartLoading] = useState(false);
  const [errorWorkStart, setErrorWorkStart] = useState({
    code: 0,
    message: "",
  });

  const createWorkStart = async (uuid: string) => {
    setWorkStartLoading(true);
    setErrorWorkStart({ code: 0, message: "" });

    try {
      const res = await api.post(`/nfc/start_work/${uuid}`);

      if (res.code < 300) {
        console.log("출근 체크 성공");
        localStorage.setItem("check-in", "1");
        router.push("/caregiver/dashboard");
      }
    } catch (e: any) {
      setErrorWorkStart({
        code: e?.code || 0,
        message: e?.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setWorkStartLoading(false);
    }
  };

  return { createWorkStart, isWorkStartLoading, errorWorkStart };
};

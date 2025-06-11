"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";

export const useCreateCareLog = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const createCareLog = async (data: any) => {
    setLoading(true);
    setError({ code: 0, message: "" });

    try {
      console.log("data", data);
      const formData = new FormData();

      const res = await api.post_form("/carelog", {
        body: formData,
      });

      if (res.code < 300) {
        console.log("돌봄 일지 등록 성공");
        router.push("/caregiver/care-logs");
      }
    } catch (e: any) {
      setError({
        code: e?.code || 0,
        message: e?.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createCareLog, isLoading, error };
};

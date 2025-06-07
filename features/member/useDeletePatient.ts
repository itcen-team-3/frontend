"use client";

import { useState } from "react";
import { api } from "@/lib/http";

export const useDeletePatient = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDeletePatient, setErrorDeletePatient] = useState<{
    code: number;
    message: string;
  }>({
    code: 0,
    message: "",
  });

  const deletePatient = async (id: number | null) => {
    setIsDeleting(true);
    setErrorDeletePatient({ code: 0, message: "" });

    try {
      if (id === null) {
        return;
      }

      const res = await api.del(`/member/patient/${id}`);
      return res;
    } catch (e: any) {
      setErrorDeletePatient({
        code: e?.code || 0,
        message: e?.message || "삭제 중 오류가 발생했습니다.",
      });
      throw e;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deletePatient, isDeleting, errorDeletePatient };
};

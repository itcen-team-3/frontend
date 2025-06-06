"use client";

import { useState } from "react";
import { api } from "@/lib/http";

export const useDeleteCaregiver = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDeleteCaregiver, setErrorDeleteCaregiver] = useState<{
    code: number;
    message: string;
  }>({
    code: 0,
    message: "",
  });

  const deleteCaregiver = async (id: number | null) => {
    setIsDeleting(true);
    setErrorDeleteCaregiver({ code: 0, message: "" });

    try {
      if (id === null) {
        return;
      }

      const res = await api.del(`/member/caregiver/${id}`);
      return res;
    } catch (e: any) {
      setErrorDeleteCaregiver({
        code: e?.code || 0,
        message: e?.message || "삭제 중 오류가 발생했습니다.",
      });
      throw e;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCaregiver, isDeleting, errorDeleteCaregiver };
};

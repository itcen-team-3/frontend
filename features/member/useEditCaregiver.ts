"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import type { CaregiverInfoRequest } from "@/lib/types/member";
import { format } from "date-fns";

export const useEditCaregiver = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const editCaregiver = async (
    caregiverId: string | undefined,
    data: CaregiverInfoRequest,
  ) => {
    if (!caregiverId) return;

    setLoading(true);
    setError({ code: 0, message: "" });

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      // TODO 생일 변환 로직 빼고 테스트해보기
      formData.append("birthDate", format(data.birthDate || "", "yyyy-MM-dd"));
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);
      formData.append("certificateNumber", data.certificateNumber);
      formData.append("career", data.career);
      formData.append("description", data.description);

      if (data.profileImageFile) {
        formData.append("profileImage", data.profileImageFile);
      }

      const res = await api.put_form(`/member/caregiver/${caregiverId}`, {
        body: formData,
      });

      if (res.code < 300) {
        console.log("요양보호사 수정 성공");
        router.push("/admin/caregivers");
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

  return { editCaregiver, isLoading, error };
};

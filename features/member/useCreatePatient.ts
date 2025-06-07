"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import type { PatientInfoRequest } from "@/lib/types/member";

export const useCreatePatient = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const createPatient = async (data: PatientInfoRequest) => {
    setLoading(true);
    setError({ code: 0, message: "" });

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      // TODO 생일 변환 로직 빼고 테스트해보기
      formData.append(
        "birthDate",
        data.birthDate?.toISOString()?.split("T")[0] || ""
      );
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);
      formData.append("patientLevel", data.patientLevel);
      formData.append("guardianPhoneNumber", data.guardianPhoneNumber);
      formData.append("guardianName", data.guardianName);
      formData.append("relationship", data.relationship);
      formData.append("description", data.description);

      if (data.profileImageFile) {
        formData.append("profileImage", data.profileImageFile);
      }

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await api.post_form("/member/patient", {
        body: formData,
      });

      if (res.code < 300) {
        console.log("보호 대상자 등록 성공");
        router.push("/admin/patients");
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

  return { createPatient, isLoading, error };
};

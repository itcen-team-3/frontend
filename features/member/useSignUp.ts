"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import type { SignUpRequest } from "@/lib/types/member";

export const useSignUp = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const signUp = async (data: SignUpRequest) => {
    setLoading(true);
    setError({ code: 0, message: "" });

    try {
      const formData = new FormData();
      formData.append("loginId", data.loginId);
      formData.append("loginPw", data.loginPw);
      formData.append("loginPwConfirm", data.loginPwConfirm);
      formData.append("representativeName", data.representativeName);
      formData.append("birthDate", data.birthDate);
      formData.append("companyName", data.companyName);
      formData.append("companyAddress", data.companyAddress);
      formData.append("email", data.email);
      formData.append(
        "businessRegistrationNumber",
        data.businessRegistrationNumber,
      );
      // formData.append("openingDate", data.openingDate);
      formData.append("openingDate", "20121012");
      formData.append("phoneNumber", data.phoneNumber);

      if (data.businessRegistrationFile) {
        formData.append(
          "businessRegistrationFile",
          data.businessRegistrationFile,
        );
      }

      const res = await api.post_form("/admin/signup", {
        body: formData,
      });

      if (res.code < 300) {
        console.log("회원 가입 성공");
        router.push("/admin/login");
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

  return { signUp, isLoading, error };
};

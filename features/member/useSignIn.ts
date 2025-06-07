"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { SignInRequest, SignInResponse } from "@/lib/types/member";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const signIn = async (
    body: SignInRequest,
    type: "admin" | "caregiver" | "family"
  ) => {
    setLoading(true);
    setError({
      code: 0,
      message: "",
    });

    try {
      const res = await api.post<SignInResponse, SignInRequest>(
        "/admin/login",
        { body }
      );

      console.log("sign-in res", res);

      if (400 <= res.code) {
        setError({
          code: res.code,
          message: res.message,
        });
      }

      localStorage.setItem("access-token", res.data.accessToken);
      // TODO : companyId 받아서 주입할 것 임시 코드
      localStorage.setItem("company-id", "4");

      if (type === "admin") {
        router.push("/admin/dashboard");
      } else if (type === "caregiver") {
        router.push("/caregiver/dashboard");
      } else if (type === "family") {
        router.push("/family/dashboard");
      }
    } catch (e: any) {
      console.log("sign-in error", e);

      setError({
        code: 0,
        message: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return { signIn, isLoading, error };
};

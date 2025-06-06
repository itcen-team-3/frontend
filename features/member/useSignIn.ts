"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { SignInRequest, SignInResponse } from "@/lib/types/member";

export const useSignIn = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const signIn = async (body: SignInRequest) => {
    setLoading(true);
    setError({
      code: 0,
      message: "",
    });

    try {
      const res = await api.post<SignInResponse, SignInRequest>(
        "/member/sign-in",
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

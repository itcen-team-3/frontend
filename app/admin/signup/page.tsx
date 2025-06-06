"use client";

import { AdminSignupForm } from "@/components/auth/admin-signup-form";
import { PageContainer } from "@/components/ui/page-container";
import { useSignUp } from "@/features/member/useSignUp";

export default function AdminSignupPage() {
  const { signUp, isLoading, error } = useSignUp();
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <AdminSignupForm
        isLoading={isLoading}
        error={error}
        onClickSignUpButton={(value) => signUp(value)}
      />
    </PageContainer>
  );
}

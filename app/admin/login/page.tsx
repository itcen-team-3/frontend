"use client";

import { LoginForm } from "@/components/auth/login-form";
import { PageContainer } from "@/components/ui/page-container";
import { useSignIn } from "@/features/member/useSignIn";

export default function AdminLoginPage() {
  const { signIn, isLoading, error } = useSignIn();

  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <LoginForm
        userType="admin"
        isLoading={isLoading}
        error={error}
        onClickLoginButton={(value) => signIn(value)}
      />
    </PageContainer>
  );
}

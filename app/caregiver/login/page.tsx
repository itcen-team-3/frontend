import { LoginForm } from "@/components/auth/login-form";
import { PageContainer } from "@/components/ui/page-container";

export default function LoginPage() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </PageContainer>
  );
}

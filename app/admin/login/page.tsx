import { LoginForm } from "@/components/auth/login-form";
import { PageContainer } from "@/components/ui/page-container";

export default function AdminLoginPage() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <LoginForm userType="admin" />
    </PageContainer>
  );
}

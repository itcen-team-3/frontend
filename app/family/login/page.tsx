import { LoginForm } from "@/components/auth/login-form";
import { PageContainer } from "@/components/ui/page-container";

export default function FamilyLoginPage() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <LoginForm userType="family" />
    </PageContainer>
  );
}

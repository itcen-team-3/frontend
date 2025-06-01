import { AdminSignupForm } from "@/components/auth/admin-signup-form";
import { PageContainer } from "@/components/ui/page-container";

export default function AdminSignupPage() {
  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <AdminSignupForm />
    </PageContainer>
  );
}

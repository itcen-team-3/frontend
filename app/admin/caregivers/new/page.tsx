"use client";

import { CaregiverRegistrationForm } from "@/components/caregivers/caregiver-registration-form";
import { useCreateCaregiver } from "@/features/member/useCreateCaregiver";

export default function NewCaregiverPage() {
  const { createCaregiver, isLoading, error } = useCreateCaregiver();

  return (
    <CaregiverRegistrationForm
      isLoading={isLoading}
      error={error}
      onClickCreateCaregiverButton={(value) => createCaregiver(value)}
    />
  );
}

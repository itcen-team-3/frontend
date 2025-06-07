"use client";

import { PatientRegistrationForm } from "@/components/patients/patient-registration-form";
import { useCreatePatient } from "@/features/member/useCreatePatient";

export default function NewPatientPage() {
  const { createPatient, isLoading, error } = useCreatePatient();

  return (
    <PatientRegistrationForm
      isLoading={isLoading}
      error={error}
      onClickCreatePatientButton={(value) => createPatient(value)}
    />
  );
}

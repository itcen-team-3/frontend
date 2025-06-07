"use client";

import { PatientForm } from "@/components/patients/patient-form";
import { useGetPatientForUpdate } from "@/features/member/useGetPatientForUpdate";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/loading-page";

export default function EditPatientPage() {
  const { id } = useParams() as { id?: string };
  const { data } = useGetPatientForUpdate(id);

  if (!data) {
    return <Loading />;
  }

  return <PatientForm mode="edit" initialData={data} />;
}

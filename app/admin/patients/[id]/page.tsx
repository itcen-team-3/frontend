"use client";

import { PatientDetail } from "@/components/patients/patient-detail";
import { useGetPatient } from "@/features/member/useGetPatient";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/loading-page";

export default function PatientDetailPage() {
  const { id } = useParams() as { id?: string };
  const { data } = useGetPatient(id);

  if (!data) {
    return <Loading />;
  }

  return <PatientDetail data={data} />;
}

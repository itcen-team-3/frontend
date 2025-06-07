"use client";

import { useState } from "react";
import { PatientList } from "@/components/patients/patient-list";
import { useGetPatients } from "@/features/member/useGetPatients";

export default function PatientsPage() {
  const [searchName, setSearchName] = useState("");
  const { data, isLoading, errorGetPatients, refetchGetPatients } =
    useGetPatients(searchName);

  const onClickSearchButton = (word: string) => {
    setSearchName(word);
  };

  return (
    <PatientList
      isLoading={isLoading}
      errorGetPatients={errorGetPatients}
      refetchGetPatients={refetchGetPatients}
      onClickSearchButton={onClickSearchButton}
      content={data?.content || []}
      first={data?.first || true}
      last={data?.last || true}
      pageNumber={data?.pageNumber || 0}
      pageSize={data?.pageSize || 10}
      totalElements={data?.totalElements || 0}
      totalPages={data?.totalPages || 10}
    />
  );
}

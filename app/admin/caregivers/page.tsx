"use client";

import { useState } from "react";
import { CaregiverList } from "@/components/caregivers/caregiver-list";
import { useGetCaregivers } from "@/features/member/useGetCaregivers";

export default function CaregiversPage() {
  const [searchName, setSearchName] = useState("");
  const { data, isLoading, error } = useGetCaregivers(searchName);

  const onClickSearchButton = (word: string) => {
    setSearchName(word);
  };

  return (
    <CaregiverList
      isLoading={isLoading}
      error={error}
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

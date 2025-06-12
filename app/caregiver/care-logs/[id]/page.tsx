"use client";

import { CareLogDetail } from "@/components/care-logs/care-log-detail";
import { useGetCaregiverCareLog } from "@/features/care-logs/useGetCaregiverCareLog";
import { useParams } from "next/navigation";
import { useGetCareItemList } from "@/features/care-logs/useGetCareItemList";

// interface CareLogDetailProps {
//   careItemList: CareItem[];
//   patientName: string;
//   careGiverName: string;
//   createDate: string;
//   startTime: string;
//   endTime: string;
//   activities: CareActivity[];
//   notes: string;
//   photos: Photo[];
//   signature: string;
// }

export default function CareLogDetailPage() {
  const params = useParams() as { id?: string };
  const { careItemList } = useGetCareItemList();
  const { data } = useGetCaregiverCareLog(params?.id || "");

  console.log("data", data);

  return (
    <CareLogDetail
      careItemList={careItemList}
      patientName={data?.patientName || ""}
      careGiverName={data?.careGiverName || ""}
      createDate={data?.createDate || ""}
      startTime={data?.startTime || ""}
      endTime={data?.endTime || ""}
      careDetailList={data?.careDetailList || []}
      description={data?.description || ""}
      signUrl={data?.signUrl || ""}
      imageInfoList={data?.imageInfoList || []}
    />
  );
}

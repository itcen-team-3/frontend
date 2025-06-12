"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/http";

// {
//   "careGiverName": "박명수",
//   "patientName": "쿵야",
//   "startTime": "09:00:00",
//   "endTime": "23:00:00",
//   "createDate": "2025-06-12",
//   "careDetailList": [
//       {
//           "careItemType": "PHYSICAL",
//           "careItemName": "체위변경",
//           "requiredMinutes": 4
//       },
//       {
//           "careItemType": "DAILY",
//           "careItemName": "외출 시 동행",
//           "requiredMinutes": 44
//       },
//       {
//           "careItemType": "PHYSICAL",
//           "careItemName": "구강관리",
//           "requiredMinutes": 26
//       }
//   ],
//   "imageUrlList": [
//       "https://s3.ap-northeast-2.amazonaws.com/itcen-team3/care_log/nursing_care_fbf2303c-50cb-465e-9ad4-323e363091fb_.jpg"
//   ],
//   "signUrl": "https://s3.ap-northeast-2.amazonaws.com/itcen-team3/sign/nursing_care_dd461af2-6d31-4b87-a715-ada0c648f0a1_.png",
//   "description": "누룽지 투약"
// }

export const useGetCaregiverCareLog = (careLogId: string) => {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [errorGetCaregiverCareLog, setErrorGetCaregiverCareLog] = useState({
    code: 0,
    message: "",
  });

  const fetchList = async (careLogId: string) => {
    setLoading(true);
    setErrorGetCaregiverCareLog({
      code: 0,
      message: "",
    });

    try {
      const res = await api.get<any>(`/care_log/${careLogId}`);
      setData({
        ...res.data,
        startTime: res.data.startTime.slice(0, 5),
        endTime: res.data.endTime.slice(0, 5),
      });
    } catch (e: any) {
      setErrorGetCaregiverCareLog({
        code: 0,
        message: e?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(careLogId);
  }, [careLogId]);

  return {
    data,
    isLoading,
    errorGetCaregiverCareLog,
    refetchGetCaregiverCareLog: fetchList,
  };
};

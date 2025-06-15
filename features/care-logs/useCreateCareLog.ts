"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";

export const useCreateCareLog = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const createCareLog = async (data: any) => {
    setLoading(true);
    setError({ code: 0, message: "" });

    try {
      const formData = new FormData();

      formData.append("patientId", data.patientId);

      const keys = Object.keys(data.durations);
      for (let i = 0; i < keys.length; i++) {
        formData.append(`careItemList[${i}].careItemId`, keys[i]);
        formData.append(
          `careItemList[${i}].requiredMinutes`,
          data.durations[`${keys[i]}`],
        );
      }

      data.photos.forEach((photo: any, index: number) => {
        if (photo.file) {
          formData.append(
            `imageDtoList[${index}].imageType`,
            photo.type === "식사" ? "MEAL" : "MEDICATION",
          );
          formData.append(`imageDtoList[${index}].imageFile`, photo.file);
        }
      });

      function dataURLtoBlob(dataurl: any) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }

      const blob = dataURLtoBlob(data.signFile);
      const file = new File([blob], "signature.png", { type: "image/png" });

      formData.append("signFile", file);
      formData.append("description", data.description);

      const res = await api.post_form("/care_log", {
        body: formData,
      });

      if (res.code < 300) {
        console.log("돌봄 일지 등록 성공");
        router.push("/caregiver/care-logs");
      }
    } catch (e: any) {
      setError({
        code: e?.code || 0,
        message: e?.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createCareLog, isLoading, error };
};

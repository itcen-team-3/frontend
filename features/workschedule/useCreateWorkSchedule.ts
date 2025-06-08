"use client";

import { useState } from "react";
import { api } from "@/lib/http";
import { useRouter } from "next/navigation";
import type { WorkScheduleRequest } from "@/lib/types/member";
import { format } from "date-fns";

export const useCreateWorkSchedule = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({
    code: 0,
    message: "",
  });

  const createWorkSchedule = async (data: WorkScheduleRequest) => {
    setLoading(true);
    setError({ code: 0, message: "" });

    try {
      const body: {
        patientId: number | null;
        patientName: string;
        caregiverId: number | null;
        startDate: string | undefined;
        endDate: string | undefined;
        startTime: string;
        endTime: string;
        paymentForHour: number;
        workDay: number;
        paymentType: string;
        isFamily: boolean;
      } = {
        patientId: 0,
        patientName: "",
        caregiverId: 0,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        paymentForHour: 0,
        workDay: 0,
        paymentType: "",
        isFamily: false,
      };

      body.patientId = data.patientId;
      body.patientName = data.patientName;
      body.caregiverId = data.caregiverId;
      body.startDate = format(data.startDate || "", "yyyy-MM-dd");
      body.endDate = format(data.endDate || "", "yyyy-MM-dd");
      body.startTime = data.startTime + ":00";
      body.endTime = data.endTime + ":00";
      body.paymentForHour = data.paymentForHour;
      body.workDay = data.workDay;
      body.paymentType = data.paymentType;
      body.isFamily = data.isFamily;

      const res = await api.post("/work-schedule", {
        body,
      });

      if (res.code < 300) {
        console.log("스케줄 등록 성공");
        router.push("/admin/schedules");
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

  return { createWorkSchedule, isLoading, error };
};

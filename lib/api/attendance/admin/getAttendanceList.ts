"use client";

import { api } from "@/lib/http";
import { AdminAttendanceListResponse } from "@/lib/types/attendance";
import { format, parseISO } from "date-fns";

export interface attendanceItem {
  id: string;
  caregiverName: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  // TODO : 출근/퇴근 소명인지 여부도 떨어져야 함
}

export async function getAttendanceList() {
  try {
    const res = await api.get<AdminAttendanceListResponse>(
      "/attendance-explation/admin"
    );

    if (!res || 400 < Number(res?.status)) {
      throw new Error(res.error);
    }

    const data: attendanceItem[] = res.data.attendanceList.map((item) => {
      const newItem: attendanceItem = {
        id: "",
        caregiverName: "",
        date: "",
        time: "",
        reason: "",
        status: "",
      };
      const dateObj = parseISO(item.submitDateTime);
      const datePart = format(dateObj, "yyyy-MM-dd");
      const timePart = format(dateObj, "HH:mm");

      newItem.id = String(item.attendanceExplationId);
      newItem.caregiverName = item.caregiverName;
      newItem.date = datePart;
      newItem.time = timePart;
      newItem.reason = item.explation;
      newItem.status = item.approveStatus;

      return newItem;
    });

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
}

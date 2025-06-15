"use client";

import { api } from "@/lib/http";

export async function updateAttendanceStatus(
  attendanceExplationId: string,
  body: any,
) {
  try {
    const res = await api.put<any, any>(
      `/attendance-explation/admin/${attendanceExplationId}`,
      { body },
    );

    if (!res || 400 < Number(res?.status)) {
      throw new Error(res.error);
    }

    return res.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

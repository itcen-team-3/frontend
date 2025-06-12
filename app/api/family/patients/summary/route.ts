import { NextResponse } from "next/server";

export async function GET() {
  // TODO: 실제 API 연동
  const mockData = {
    familyName: "김가족",
    patientName: "김환자",
    caregiverName: "이요양",
    caregiverStatus: "working" as const,
  };

  return NextResponse.json(mockData);
} 
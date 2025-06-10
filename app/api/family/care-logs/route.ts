import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || 3;

  // TODO: 실제 API 연동
  const mockData = {
    careLogs: [
      {
        id: "1",
        date: "2024-03-20",
        caregiverName: "이요양",
        activities: ["식사도움", "목욕도움", "말벗·격려 및 위로"],
      },
      {
        id: "2",
        date: "2024-03-19",
        caregiverName: "이요양",
        activities: ["식사도움", "청소 및 주변정돈", "외출 시 동행"],
      },
      {
        id: "3",
        date: "2024-03-18",
        caregiverName: "이요양",
        activities: ["식사도움", "배변도움", "운동보조"],
      },
    ].slice(0, limit),
  };

  return NextResponse.json(mockData);
} 
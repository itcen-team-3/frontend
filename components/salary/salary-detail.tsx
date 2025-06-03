"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkDay {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  status: "normal" | "late" | "absent";
}

interface SalaryDetailProps {
  id: string;
  caregiverName: string;
  month: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  totalAmount: number;
  status: "pending" | "paid";
  workDays: WorkDay[];
}

export function SalaryDetail({
  // id = "1",
  caregiverName = "김요양",
  month = "2025-05",
  totalHours = 120,
  regularHours = 110,
  overtimeHours = 10,
  hourlyRate = 12000,
  totalAmount = 1440000,
  status = "pending",
  workDays = [
    {
      date: "2025-05-01",
      day: "월",
      checkIn: "09:00",
      checkOut: "12:00",
      workHours: 3,
      status: "normal",
    },
    {
      date: "2025-05-02",
      day: "화",
      checkIn: "09:15",
      checkOut: "12:00",
      workHours: 2.75,
      status: "late",
    },
    {
      date: "2025-05-03",
      day: "수",
      checkIn: "09:00",
      checkOut: "12:00",
      workHours: 3,
      status: "normal",
    },
    {
      date: "2025-05-04",
      day: "목",
      checkIn: "-",
      checkOut: "-",
      workHours: 0,
      status: "absent",
    },
    {
      date: "2025-05-05",
      day: "금",
      checkIn: "09:00",
      checkOut: "12:00",
      workHours: 3,
      status: "normal",
    },
  ],
}: SalaryDetailProps) {
  const [activeTab, setActiveTab] = useState<string>("summary");

  console.log(activeTab);

  // 금액 형식 변환 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  // 상태에 따른 스타일 클래스
  const getStatusClass = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  // 상태에 따른 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case "normal":
        return "정상";
      case "late":
        return "지각";
      case "absent":
        return "결근";
      default:
        return "";
    }
  };

  // 급여 명세서 인쇄 함수
  const handlePrint = () => {
    console.log("Printing salary statement...");
    window.print();
  };

  // 엑셀 다운로드 함수
  const handleDownloadExcel = () => {
    console.log("Downloading Excel file...");
    // 실제 구현에서는 여기서 API를 호출하여 엑셀 파일을 다운로드합니다
  };

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/salary">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title={`${caregiverName} 급여 상세`}
          description={`${month} 급여 명세서`}
          className="mb-0 flex-1"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={handlePrint}>
            <Printer className="mr-2 h-5 w-5" />
            인쇄
          </Button>
          <Button size="lg" onClick={handleDownloadExcel}>
            <Download className="mr-2 h-5 w-5" />
            엑셀
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="summary"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="summary" className="text-lg">
            급여 요약
          </TabsTrigger>
          <TabsTrigger value="details" className="text-lg">
            근무 상세
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-xl">기본 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        요양보호사
                      </p>
                      <p className="text-lg font-medium">{caregiverName}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">급여 월</p>
                      <p className="text-lg font-medium">{month}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">시급</p>
                      <p className="text-lg font-medium">
                        {formatCurrency(hourlyRate)}원
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">상태</p>
                      <p className="text-lg font-medium">
                        {status === "paid" ? "지급완료" : "미지급"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-xl">급여 계산</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <p className="text-base">기본 근무 시간</p>
                      <p className="text-base font-medium">
                        {regularHours}시간
                      </p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-base">기본 급여</p>
                      <p className="text-base font-medium">
                        {formatCurrency(regularHours * hourlyRate)}원
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <p className="text-base">초과 근무 시간</p>
                      <p className="text-base font-medium">
                        {overtimeHours}시간
                      </p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-base">초과 근무 급여</p>
                      <p className="text-base font-medium">
                        {formatCurrency(overtimeHours * hourlyRate * 1.5)}원
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between">
                      <p className="text-lg font-medium">총 급여</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(totalAmount)}원
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">근무 일지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">날짜</TableHead>
                      <TableHead className="text-base">요일</TableHead>
                      <TableHead className="text-base">출근 시간</TableHead>
                      <TableHead className="text-base">퇴근 시간</TableHead>
                      <TableHead className="text-base text-right">
                        근무 시간
                      </TableHead>
                      <TableHead className="text-base text-center">
                        상태
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workDays.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-base">{day.date}</TableCell>
                        <TableCell className="text-base">{day.day}</TableCell>
                        <TableCell className="text-base">
                          {day.checkIn}
                        </TableCell>
                        <TableCell className="text-base">
                          {day.checkOut}
                        </TableCell>
                        <TableCell className="text-base text-right">
                          {day.workHours}시간
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getStatusClass(day.status)}`}
                          >
                            {getStatusText(day.status)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">총 근무일</p>
                    <p className="text-lg font-medium">
                      {workDays.filter((day) => day.status !== "absent").length}
                      일
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      총 근무 시간
                    </p>
                    <p className="text-lg font-medium">{totalHours}시간</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">결근/지각</p>
                    <p className="text-lg font-medium">
                      {workDays.filter((day) => day.status === "absent").length}
                      일 /
                      {workDays.filter((day) => day.status === "late").length}일
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

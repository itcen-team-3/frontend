"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Download, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SalaryRecord {
  id: string;
  caregiverName: string;
  month: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  totalAmount: number;
  status: "pending" | "paid";
}

interface SalaryManagementProps {
  salaryRecords: SalaryRecord[];
}

export function SalaryManagement({
  salaryRecords = [
    {
      id: "1",
      caregiverName: "김요양",
      month: "2025-05",
      totalHours: 120,
      regularHours: 110,
      overtimeHours: 10,
      hourlyRate: 12000,
      totalAmount: 1440000,
      status: "pending",
    },
    {
      id: "2",
      caregiverName: "박요양",
      month: "2025-05",
      totalHours: 100,
      regularHours: 100,
      overtimeHours: 0,
      hourlyRate: 13000,
      totalAmount: 1300000,
      status: "pending",
    },
    {
      id: "3",
      caregiverName: "정요양",
      month: "2025-04",
      totalHours: 130,
      regularHours: 120,
      overtimeHours: 10,
      hourlyRate: 11000,
      totalAmount: 1430000,
      status: "paid",
    },
  ],
}: SalaryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 월 형식 변환 함수
  const formatMonth = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM", { locale: ko });
  };

  // 금액 형식 변환 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  // 필터링된 급여 기록
  const filteredRecords = salaryRecords.filter((record) => {
    // 검색어 필터링
    const matchesSearch = record.caregiverName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 월 필터링
    const matchesMonth = !month || record.month === formatMonth(month);

    // 상태 필터링
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesMonth && matchesStatus;
  });

  // 총 급여 계산
  const totalSalary = filteredRecords.reduce(
    (sum, record) => sum + record.totalAmount,
    0,
  );

  // 엑셀 다운로드 함수 (실제 구현에서는 API 호출)
  const handleDownloadExcel = () => {
    console.log("Downloading Excel file...");
    // 실제 구현에서는 여기서 API를 호출하여 엑셀 파일을 다운로드합니다
  };

  return (
    <PageContainer>
      {/* 헤더 섹션 - 반응형 레이아웃 */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <PageHeader
          title="급여 관리"
          description="요양보호사의 근무 시간과 급여를 관리하세요"
          className="mb-0"
        />
        <Button
          size="lg"
          className="text-lg w-full md:w-auto"
          onClick={handleDownloadExcel}
        >
          <Download className="mr-2 h-5 w-5" />
          엑셀 다운로드
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 mt-6">
        {/* 필터 섹션 */}
        <Card className="card-shadow lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">필터</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium">월 선택</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left text-base md:text-lg font-normal h-12",
                      !month && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {month
                      ? format(month, "yyyy년 MM월", { locale: ko })
                      : "월을 선택하세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={month}
                    onSelect={(month) => {
                      if (month) {
                        setMonth(month);
                        setIsCalendarOpen(false);
                      }
                    }}
                    captionLayout="dropdown"
                    classNames={{
                      caption_label: "hidden",
                      dropdown: "text-lg",
                      caption: "flex justify-center pt-1 relative items-center",
                      dropdown_month: "w-full",
                      dropdown_year: "w-full",
                      nav: "absolute top-1/15 left-0 right-0 flex justify-between -translate-y-1/2 mr-0",
                      nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                      month_caption: "flex justify-center",
                      button_previous: "ml-4",
                      button_next: "mr-4",
                      weekdays: "flex justify-around",
                    }}
                    modifiersStyles={{
                      hasEvent: {
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">상태</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-base md:text-lg h-12">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-base md:text-lg">
                    전체
                  </SelectItem>
                  <SelectItem value="pending" className="text-base md:text-lg">
                    미지급
                  </SelectItem>
                  <SelectItem value="paid" className="text-base md:text-lg">
                    지급완료
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="이름으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base md:text-lg"
                />
              </div>
            </div>

            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-2">요약</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">총 인원:</span>
                    <span className="font-medium text-sm md:text-base">
                      {filteredRecords.length}명
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">총 급여:</span>
                    <span className="font-medium text-sm md:text-base">
                      {formatCurrency(totalSalary)}원
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* 급여 목록 섹션 */}
        <Card className="card-shadow lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">급여 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 테이블 컨테이너에 가로 스크롤 추가 */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm md:text-base whitespace-nowrap">
                        이름
                      </TableHead>
                      <TableHead className="text-sm md:text-base whitespace-nowrap">
                        월
                      </TableHead>
                      <TableHead className="text-sm md:text-base text-right whitespace-nowrap">
                        총 시간
                      </TableHead>
                      <TableHead className="text-sm md:text-base text-right whitespace-nowrap">
                        시급
                      </TableHead>
                      <TableHead className="text-sm md:text-base text-right whitespace-nowrap">
                        총액
                      </TableHead>
                      <TableHead className="text-sm md:text-base text-center whitespace-nowrap">
                        상태
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="text-sm md:text-base font-medium whitespace-nowrap">
                            {record.caregiverName}
                          </TableCell>
                          <TableCell className="text-sm md:text-base whitespace-nowrap">
                            {record.month}
                          </TableCell>
                          <TableCell className="text-sm md:text-base text-right whitespace-nowrap">
                            {record.totalHours}시간
                          </TableCell>
                          <TableCell className="text-sm md:text-base text-right whitespace-nowrap">
                            {formatCurrency(record.hourlyRate)}원
                          </TableCell>
                          <TableCell className="text-sm md:text-base text-right font-medium whitespace-nowrap">
                            {formatCurrency(record.totalAmount)}원
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                "px-2 md:px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap",
                                record.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800",
                              )}
                            >
                              {record.status === "paid" ? "지급완료" : "미지급"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center text-sm md:text-base"
                        >
                          검색 결과가 없습니다
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

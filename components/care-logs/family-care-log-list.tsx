"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Search, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CareLog {
  id: string;
  date: Date;
  caregiverName: string;
  caregiverImage?: string;
  startTime: string;
  endTime: string;
  activities: string[];
  status: "completed" | "in-progress";
  hasPhotos: boolean;
  hasNotes: boolean;
}

interface FamilyCareLogListProps {
  patientName?: string;
  careLogs?: CareLog[];
}

export function FamilyCareLogList({
  patientName = "이환자",
  careLogs = [
    {
      id: "1",
      date: new Date(2025, 4, 21), // 2025-05-21
      caregiverName: "김요양",
      caregiverImage: "/diverse-woman-portrait.png",
      startTime: "09:00",
      endTime: "12:00",
      activities: ["식사도움", "목욕도움", "말벗·격려 및 위로"],
      status: "completed",
      hasPhotos: true,
      hasNotes: true,
    },
    {
      id: "2",
      date: new Date(2025, 4, 20), // 2025-05-20
      caregiverName: "김요양",
      caregiverImage: "/diverse-woman-portrait.png",
      startTime: "09:00",
      endTime: "12:00",
      activities: ["식사도움", "청소 및 주변정돈", "외출 시 동행"],
      status: "completed",
      hasPhotos: true,
      hasNotes: false,
    },
    {
      id: "3",
      date: new Date(2025, 4, 19), // 2025-05-19
      caregiverName: "박요양",
      caregiverImage: "/thoughtful-man.png",
      startTime: "14:00",
      endTime: "17:00",
      activities: ["식사도움", "목욕도움", "인지자극활동"],
      status: "completed",
      hasPhotos: false,
      hasNotes: true,
    },
    {
      id: "4",
      date: new Date(2025, 4, 18), // 2025-05-18
      caregiverName: "김요양",
      caregiverImage: "/diverse-woman-portrait.png",
      startTime: "09:00",
      endTime: "12:00",
      activities: ["식사도움", "체위변경", "말벗·격려 및 위로", "생활상담"],
      status: "completed",
      hasPhotos: true,
      hasNotes: true,
    },
    {
      id: "5",
      date: new Date(2025, 4, 17), // 2025-05-17
      caregiverName: "박요양",
      caregiverImage: "/thoughtful-man.png",
      startTime: "14:00",
      endTime: "17:00",
      activities: ["식사도움", "청소 및 주변정돈"],
      status: "completed",
      hasPhotos: false,
      hasNotes: false,
    },
    {
      id: "6",
      date: new Date(), // 오늘
      caregiverName: "김요양",
      caregiverImage: "/diverse-woman-portrait.png",
      startTime: "09:00",
      endTime: "12:00",
      activities: ["식사도움", "목욕도움", "말벗·격려 및 위로"],
      status: "in-progress",
      hasPhotos: false,
      hasNotes: false,
    },
  ],
}: FamilyCareLogListProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [caregiverFilter, setCaregiverFilter] = useState<string>("all");

  // 고유한 요양보호사 목록 추출
  const uniqueCaregivers = Array.from(
    new Set(careLogs.map((log) => log.caregiverName)),
  ).map((name) => {
    const caregiver = careLogs.find((log) => log.caregiverName === name);
    return {
      name,
      image: caregiver?.caregiverImage,
    };
  });

  // 필터링된 돌봄일지
  const filteredLogs = careLogs.filter((log) => {
    // 검색어 필터링
    const matchesSearch = log.caregiverName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 날짜 필터링
    const matchesDate =
      activeTab === "date" ? date && isSameDay(log.date, date) : true;

    // 요양보호사 필터링
    const matchesCaregiver =
      caregiverFilter === "all" || log.caregiverName === caregiverFilter;

    return matchesSearch && matchesDate && matchesCaregiver;
  });

  // 날짜에 돌봄일지가 있는지 확인하는 함수
  const hasLogOnDate = (date: Date) => {
    return careLogs.some((log) => isSameDay(log.date, date));
  };

  return (
    <PageContainer>
      <PageHeader
        title={`${patientName}님의 돌봄일지`}
        description="보호대상자의 돌봄 활동과 상태를 확인하세요"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* 필터 섹션 */}
        <Card className="card-shadow md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">필터</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-medium">날짜 선택</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left text-base md:text-lg font-normal h-12",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date
                      ? format(date, "yyyy년 MM월 dd일", { locale: ko })
                      : "날짜를 선택하세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    modifiers={{
                      hasLog: hasLogOnDate,
                    }}
                    modifiersStyles={{
                      hasLog: {
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">요양보호사</label>
              <Select
                value={caregiverFilter}
                onValueChange={setCaregiverFilter}
              >
                <SelectTrigger className="text-base md:text-lg h-12">
                  <SelectValue placeholder="요양보호사 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-base md:text-lg">
                    전체 요양보호사
                  </SelectItem>
                  {uniqueCaregivers.map((caregiver) => (
                    <SelectItem
                      key={caregiver.name}
                      value={caregiver.name}
                      className="text-base md:text-lg"
                    >
                      {caregiver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="요양보호사 이름으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base md:text-lg"
                />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-medium mb-2">돌봄일지 요약</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm md:text-base">총 돌봄일지:</span>
                  <span className="font-medium text-sm md:text-base">
                    {careLogs.length}개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm md:text-base">이번 달:</span>
                  <span className="font-medium text-sm md:text-base">
                    {
                      careLogs.filter(
                        (log) => log.date.getMonth() === new Date().getMonth(),
                      ).length
                    }
                    개
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 돌봄일지 목록 섹션 */}
        <Card className="card-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">돌봄일지 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="text-base">
                  전체
                </TabsTrigger>
                <TabsTrigger value="date" className="text-base">
                  선택 날짜
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <Link href={`/family/care-logs/${log.id}`} key={log.id}>
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                log.status === "in-progress"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <h3 className="text-lg font-medium">
                              {format(log.date, "yyyy년 MM월 dd일 (eee)", {
                                locale: ko,
                              })}
                            </h3>
                          </div>
                          <div className="flex items-center">
                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={log.caregiverImage || "/placeholder.svg"}
                                alt={log.caregiverName}
                              />
                              <AvatarFallback>
                                {log.caregiverName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-base">
                              {log.caregiverName} 요양보호사
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {log.startTime} - {log.endTime}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {log.activities.slice(0, 3).map((activity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm"
                            >
                              {activity}
                            </span>
                          ))}
                          {log.activities.length > 3 && (
                            <span className="px-2 py-1 bg-muted rounded-full text-xs md:text-sm">
                              +{log.activities.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {log.hasPhotos && (
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                              사진 있음
                            </span>
                          )}
                          {log.hasNotes && (
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                              특이사항 있음
                            </span>
                          )}
                          {log.status === "in-progress" && (
                            <span className="text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded-full">
                              진행 중
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-lg">
                      {activeTab === "date"
                        ? "선택한 날짜에 돌봄일지가 없습니다"
                        : "검색 결과가 없습니다"}
                    </p>
                    {activeTab === "date" && (
                      <Button
                        className="mt-4"
                        onClick={() => setActiveTab("all")}
                      >
                        전체 돌봄일지 보기
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

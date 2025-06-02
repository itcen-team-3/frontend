"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AttendanceFormProps {
  type: "check-in" | "check-out";
  mode?: "create" | "view" | "edit";
  initialData?: {
    date?: Date;
    time?: string;
    reason?: string;
  };
}

export function AttendanceForm({
  type = "check-in",
  mode = "create",
  initialData,
}: AttendanceFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    mode === "create" ? undefined : initialData?.date || new Date(),
  );
  const [time, setTime] = useState<string>(
    mode === "create" ? "" : initialData?.time || "",
  );
  const [reason, setReason] = useState<string>(
    mode === "create" ? "" : initialData?.reason || "",
  );

  const title = type === "check-in" ? "출근 소명하기" : "퇴근 소명하기";
  const description =
    type === "check-in"
      ? "출근 시간에 체크인하지 못한 이유를 작성해주세요"
      : "퇴근 시간에 체크아웃하지 못한 이유를 작성해주세요";

  return (
    <PageContainer>
      <PageHeader title={title} description={description} />

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl">소명 내용 작성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-lg">
              날짜
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left text-lg font-normal h-14",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {date
                    ? format(date, "PPP", { locale: ko })
                    : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-lg">
              시간
            </Label>
            <Input
              id="time"
              type="time"
              className="text-lg h-14"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={mode === "view"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-lg">
              소명 사유
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="소명 사유를 상세히 작성해주세요"
              className="min-h-[150px] text-lg"
              disabled={mode === "view"}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {mode !== "view" && (
              <>
                <Button variant="outline" size="lg" className="text-lg">
                  취소
                </Button>
                <Button size="lg" className="text-lg">
                  {mode === "create" ? "제출하기" : "수정하기"}
                </Button>
              </>
            )}
            {mode === "view" && (
              <Button variant="outline" size="lg" className="text-lg">
                목록으로
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

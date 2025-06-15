"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/http";
import { useModal } from "@/context/ModalContext";

interface AttendanceFormProps {
  type?: "check-in" | "check-out";
  mode?: "create" | "view" | "edit";
  initialData?: {
    date?: Date;
    time?: string;
    reason?: string;
  };
}

interface Patient {
  patientId: number;
  patientName: string;
}

export function AttendanceForm({
  mode = "create",
  initialData,
}: AttendanceFormProps) {
  const router = useRouter();

  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [time, setTime] = useState(initialData?.time || "");
  const [reason, setReason] = useState(initialData?.reason || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [type, setType] = useState<"check-in" | "check-out">("check-in");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { showAlert } = useModal();

  useEffect(() => {
    api
      .get<Patient[]>("/member/caregiver/patient-name-list")
      .then((res) => setPatients(res.data || []))
      .catch((err) => console.error("환자 목록 요청 실패:", err));
  }, []);

  const handleSubmit = async () => {
    if (!date || !time || !reason || !selectedPatientId) {
      showAlert({ message: "모든 필드를 입력해주세요." });
      return;
    }

    setLoading(true);
    setFormErrors({});
    setUploadProgress(0);

    const formData = {
      patientId: selectedPatientId,
      checkInOutStatus: type === "check-in" ? "출근" : "퇴근",
      attendanceTime: time,
      attendanceDate: format(date, "yyyy-MM-dd"),
      explation: reason,
    };

    try {
      const token = localStorage.getItem("access-token");
      const xhr = new XMLHttpRequest();
      console.log("file", file);
      xhr.open(
        "POST",
        `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/v1/"}attendance-explation`,
      );
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setLoading(false);
        if (xhr.status === 200 || xhr.status === 201) {
          showAlert({ message: "소명이 성공적으로 제출되었습니다." });
          router.refresh();
          router.push("/caregiver/attendance");
        } else {
          try {
            const json = JSON.parse(xhr.responseText);
            if (json.fieldErrors) {
              const errors: Record<string, string> = {};
              json.fieldErrors.forEach(
                (e: any) => (errors[e.field] = e.message),
              );
              setFormErrors(errors);
            } else {
              showAlert({ message: "제출에 실패했습니다." });
            }
          } catch {
            showAlert({ message: "서버 오류가 발생했습니다." });
          }
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        showAlert({ message: "네트워크 오류가 발생했습니다." });
      };

      xhr.send(JSON.stringify(formData));
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      showAlert({ message: "알 수 없는 오류가 발생했습니다." });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="출퇴근 소명하기"
        description="소명 사유 및 관련 정보를 입력해주세요."
      />
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl">소명 내용 작성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 날짜 선택 */}
          {/* 날짜 선택 */}
          <div className="space-y-2">
            <Label className="text-lg">날짜</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                  onSelect={(value) => {
                    if (value) {
                      setDate(value);
                      setIsCalendarOpen(false);
                    }
                  }}
                  required
                  classNames={{
                    months:
                      "relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-between items-center px-2 py-2",
                    caption_label: "text-lg font-semibold",
                    month_caption: "flex justify-center",
                    month_grid: "w-full",
                    nav: "absolute top-1/15 left-0 right-0 flex justify-between -translate-y-1/2 mr-0",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                    head_row: "flex",
                    head_cell:
                      "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    selected:
                      "h-8 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_button: "w-full flex justify-center items-center",
                    day_outside: "opacity-50",
                    day_disabled: "opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
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

          {/* 시간 입력 */}
          <div className="space-y-2">
            <Label className="text-lg">시간</Label>
            <Input
              type="time"
              className="text-lg h-14"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={mode === "view"}
            />
            {formErrors.attendanceTime && (
              <p className="text-red-500">{formErrors.attendanceTime}</p>
            )}
          </div>

          {/* 출퇴근 유형 */}
          <div className="space-y-2">
            <Label className="text-lg">출퇴근 유형</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as "check-in" | "check-out")}
            >
              <SelectTrigger className="w-full h-14 text-lg">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="check-in">출근</SelectItem>
                <SelectItem value="check-out">퇴근</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 환자 선택 */}
          <div className="space-y-2">
            <Label className="text-lg">대상 환자</Label>
            <Select
              value={selectedPatientId?.toString()}
              onValueChange={(v) => setSelectedPatientId(Number(v))}
            >
              <SelectTrigger className="w-full h-14 text-lg">
                <SelectValue placeholder="환자 선택" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.patientId} value={p.patientId.toString()}>
                    {p.patientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.patientId && (
              <p className="text-red-500">{formErrors.patientId}</p>
            )}
          </div>

          {/* 소명 사유 */}
          {/* 소명 사유 */}
          <div className="space-y-2">
            <Label className="text-lg">소명 사유</Label>
            <Textarea
              className="min-h-[150px] text-lg"
              placeholder="소명 사유를 상세히 작성해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={mode === "view"}
            />
            {formErrors.explation && (
              <p className="text-red-500">{formErrors.explation}</p>
            )}
          </div>

          {/* 파일 첨부 */}
          {mode !== "view" && (
            <div className="space-y-2">
              <Label className="text-lg">이미지 첨부 (선택)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          )}

          {/* 업로드 진행률 */}
          {loading && (
            <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-4 pt-4">
            {mode !== "view" ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button
                  size="lg"
                  className="text-lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "제출 중..." : "제출하기"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => router.push("/caregiver/attendance")}
              >
                목록으로
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

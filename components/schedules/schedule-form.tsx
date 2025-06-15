"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { CaregiverNameListItem, PatientNameListItem } from "@/lib/types/member";
import { WorkScheduleRequest } from "@/lib/types/workSchedule";
import { ErrorMessage } from "@/lib/types/api";

interface ScheduleFormProps {
  mode: "create" | "edit";
  caregiverNameList: CaregiverNameListItem[];
  patientNameList: PatientNameListItem[];
  initialData?: WorkScheduleRequest;
  isLoading: boolean;
  error: ErrorMessage;
  onSaveWorkScheduleButton: (args: WorkScheduleRequest) => void;
}

export function ScheduleForm({
  mode = "create",
  caregiverNameList,
  patientNameList,
  initialData = {
    caregiverId: null,
    patientName: "",
    patientId: null,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    startTime: "09:00",
    endTime: "12:00",
    days: [],
    workDay: 0,
    paymentForHour: 0,
    paymentType: "방문급여",
    isFamily: false,
  },
  onSaveWorkScheduleButton,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<WorkScheduleRequest>(initialData);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const weekdays = [
    { value: 1 << 0, label: "월요일" },
    { value: 1 << 1, label: "화요일" },
    { value: 1 << 2, label: "수요일" },
    { value: 1 << 3, label: "목요일" },
    { value: 1 << 4, label: "금요일" },
    { value: 1 << 5, label: "토요일" },
    { value: 1 << 6, label: "일요일" },
  ];

  const handleDayToggle = (day: number) => {
    setFormData((prev) => {
      const prevDays = prev.days || [];

      if (prevDays.includes(day)) {
        return { ...prev, days: prevDays.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prevDays, day] };
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const data = { ...prev, [name]: value };

      // TODO : 왜 필요한지 모르겠지만 patientName 따로 넣어주기 ..
      if (name === "patientId") {
        data.patientName =
          patientNameList.find((item) => item.patientId === Number(value))
            ?.patientName || "";
      }

      return data;
    });
  };

  const handleFamilyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, isFamily: value === "family" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      caregiverId: Number(formData.caregiverId),
      patientId: Number(formData.patientId),
      paymentForHour: Number(formData.paymentForHour),
      workDay: formData.days?.reduce((prev, curr) => prev + curr, 0) || 0,
    };

    onSaveWorkScheduleButton(data);
  };

  const title = mode === "create" ? "근무 일정 등록" : "근무 일정 수정";
  const description =
    mode === "create"
      ? "새로운 근무 일정을 등록하세요"
      : "근무 일정을 수정하세요";
  const buttonText = mode === "create" ? "등록하기" : "수정하기";

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/schedules">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title={title}
          description={description}
          className="mb-0 flex-1"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">담당자 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="caregiver" className="text-lg">
                요양보호사
              </Label>
              <Select
                value={
                  formData.caregiverId === null
                    ? undefined
                    : String(formData.caregiverId)
                }
                onValueChange={(value) =>
                  handleSelectChange("caregiverId", value)
                }
              >
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="요양보호사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {caregiverNameList.map((caregiver) => (
                    <SelectItem
                      key={caregiver.caregiverId}
                      value={String(caregiver.caregiverId)}
                      className="text-lg"
                    >
                      {caregiver.caregiverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient" className="text-lg">
                보호대상자
              </Label>
              <Select
                value={
                  formData.patientId === null
                    ? undefined
                    : String(formData.patientId)
                }
                onValueChange={(value) =>
                  handleSelectChange("patientId", value)
                }
              >
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="보호대상자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {patientNameList.map((patient) => (
                    <SelectItem
                      key={patient.patientId}
                      value={String(patient.patientId)}
                      className="text-lg"
                    >
                      {patient.patientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">가족 관계 여부</Label>
              <RadioGroup
                value={formData.isFamily ? "family" : "non-family"}
                onValueChange={handleFamilyChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="family"
                    id="family"
                    className="w-5 h-5"
                  />
                  <Label htmlFor="family" className="text-lg">
                    가족 관계
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="non-family"
                    id="non-family"
                    className="w-5 h-5"
                  />
                  <Label htmlFor="non-family" className="text-lg">
                    가족 관계 아님
                  </Label>
                </div>
              </RadioGroup>
              {formData.isFamily && (
                <p className="text-sm text-muted-foreground mt-2">
                  가족 관계인 경우 급여 계산 방식이 다르게 적용됩니다.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">근무 일정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-lg">
                  근무 시작일
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left text-lg font-normal h-14",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {formData.startDate
                        ? format(formData.startDate, "yyyy년 MM월 dd일", {
                            locale: ko,
                          })
                        : "날짜를 선택하세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData((prev) => ({ ...prev, startDate: date }));
                          setIsCalendarOpen(false);
                        }
                      }}
                      captionLayout="dropdown"
                      classNames={{
                        caption_label: "hidden",
                        dropdown: "text-lg",
                        caption:
                          "flex justify-center pt-1 relative items-center",
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
                <Label htmlFor="endDate" className="text-lg">
                  근무 종료일
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left text-lg font-normal h-14",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {formData.endDate
                        ? format(formData.endDate, "yyyy년 MM월 dd일", {
                            locale: ko,
                          })
                        : "날짜를 선택하세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData((prev) => ({ ...prev, endDate: date }));
                          setIsCalendarOpen(false);
                        }
                      }}
                      captionLayout="dropdown"
                      classNames={{
                        caption_label: "hidden",
                        dropdown: "text-lg",
                        caption:
                          "flex justify-center pt-1 relative items-center",
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-lg">
                  근무 시작 시간
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="text-lg h-14"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-lg">
                  근무 종료 시간
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="text-lg h-14"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">근무 요일</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {weekdays.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={formData.days?.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                      className="w-6 h-6"
                    />
                    <Label
                      htmlFor={`day-${day.value}`}
                      className="text-lg cursor-pointer"
                    >
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType" className="text-lg">
                급여종류
              </Label>
              <Select
                value={formData.paymentType}
                onValueChange={(value) =>
                  handleSelectChange("paymentType", value)
                }
              >
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="급여종류를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="방문급여" className="text-lg">
                    방문급여
                  </SelectItem>
                  <SelectItem value="방문목욕" className="text-lg">
                    방문목욕
                  </SelectItem>
                  <SelectItem value="방문간호" className="text-lg">
                    방문간호
                  </SelectItem>
                  <SelectItem value="단기보호" className="text-lg">
                    단기보호
                  </SelectItem>
                  <SelectItem value="주야간보호급여" className="text-lg">
                    주야간보호급여
                  </SelectItem>
                  <SelectItem value="가족요양급여" className="text-lg">
                    가족요양급여
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentForHour" className="text-lg">
                시간당 급여 (원)
              </Label>
              <Input
                id="paymentForHour"
                name="paymentForHour"
                type="number"
                value={formData.paymentForHour}
                onChange={handleInputChange}
                className="text-lg h-14"
                min="0"
                step="1000"
              />
              {formData.isFamily && (
                <p className="text-sm text-muted-foreground mt-2">
                  가족 관계인 경우 시간당 급여는 일반 요율의 50%로 계산됩니다.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link href="/admin/schedules">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="text-lg"
                >
                  취소
                </Button>
              </Link>
              <Button type="submit" size="lg" className="text-lg">
                {buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageContainer>
  );
}

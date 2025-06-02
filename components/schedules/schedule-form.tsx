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

interface Caregiver {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  name: string;
}

interface ScheduleFormProps {
  mode: "create" | "edit";
  caregivers?: Caregiver[];
  patients?: Patient[];
  initialData?: {
    caregiverId: string;
    patientId: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    days: string[];
    hourlyRate: string;
    isFamily: boolean;
  };
}

export function ScheduleForm({
  mode = "create",
  caregivers = [
    { id: "1", name: "김요양" },
    { id: "2", name: "박요양" },
    { id: "3", name: "정요양" },
  ],
  patients = [
    { id: "1", name: "이환자" },
    { id: "2", name: "최환자" },
    { id: "3", name: "강환자" },
  ],
  initialData = {
    caregiverId: "",
    patientId: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    startTime: "09:00",
    endTime: "12:00",
    days: [],
    hourlyRate: "10000",
    isFamily: false,
  },
}: ScheduleFormProps) {
  const [formData, setFormData] = useState(initialData);

  const weekdays = [
    { value: "월", label: "월요일" },
    { value: "화", label: "화요일" },
    { value: "수", label: "수요일" },
    { value: "목", label: "목요일" },
    { value: "금", label: "금요일" },
    { value: "토", label: "토요일" },
    { value: "일", label: "일요일" },
  ];

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFamilyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, isFamily: value === "family" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting schedule:", formData);
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
                value={formData.caregiverId}
                onValueChange={(value) =>
                  handleSelectChange("caregiverId", value)
                }
              >
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="요양보호사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {caregivers.map((caregiver) => (
                    <SelectItem
                      key={caregiver.id}
                      value={caregiver.id}
                      className="text-lg"
                    >
                      {caregiver.name}
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
                value={formData.patientId}
                onValueChange={(value) =>
                  handleSelectChange("patientId", value)
                }
              >
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="보호대상자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem
                      key={patient.id}
                      value={patient.id}
                      className="text-lg"
                    >
                      {patient.name}
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
                <Popover>
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
                        ? format(formData.startDate, "PPP", { locale: ko })
                        : "날짜를 선택하세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        date &&
                        setFormData((prev) => ({ ...prev, startDate: date }))
                      }
                      initialFocus
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
                        ? format(formData.endDate, "PPP", { locale: ko })
                        : "날짜를 선택하세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        date &&
                        setFormData((prev) => ({ ...prev, endDate: date }))
                      }
                      initialFocus
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
                      checked={formData.days.includes(day.value)}
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
              <Label htmlFor="hourlyRate" className="text-lg">
                시간당 급여 (원)
              </Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
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

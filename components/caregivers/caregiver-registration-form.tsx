"use client";

import type React from "react";
import { CaregiverInfoRequest } from "@/lib/types/member";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  ArrowLeft,
  Check,
  AlertCircle,
  CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@/lib/types/api";
import Loading from "../ui/loading-page";

interface CaregiverRegistrationFormProps {
  isLoading: boolean;
  error: ErrorMessage;
  onClickCreateCaregiverButton: (args: CaregiverInfoRequest) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function CaregiverRegistrationForm({
  isLoading,
  error,
  onClickCreateCaregiverButton,
}: CaregiverRegistrationFormProps) {
  const [formData, setFormData] = useState<CaregiverInfoRequest>({
    name: "",
    birthDate: undefined,
    phoneNumber: "",
    address: "",
    certificateNumber: "",
    career: "",
    description: "",
    profileImage: null,
    profileImageFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return <Loading />;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const calculateAge = (birthDate: Date | string): number => {
    const birth = new Date(birthDate);

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 필수 필드 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 선택해주세요";
    } else {
      const age = calculateAge(formData.birthDate);
      if (age < 18 || age > 80) {
        newErrors.birthDate = "18세 이상 80세 이하만 등록 가능합니다";
      }
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "연락처를 입력해주세요";
    } else {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "010-0000-0000 형식으로 입력해주세요";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요";
    }

    if (!formData.certificateNumber.trim()) {
      newErrors.certificateNumber = "요양보호사 자격증 번호를 입력해주세요";
    }

    if (!formData.career.trim()) {
      newErrors.career = "경력을 입력해주세요";
    } else {
      const career = Number.parseInt(formData.career);
      if (isNaN(career) || career < 0 || career > 50) {
        newErrors.career = "0년 이상 50년 이하로 입력해주세요";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const fileInput = fileInputRef.current;
    const data = {
      ...formData,
      profileImageFile: fileInput?.files?.[0] ? fileInput.files[0] : null,
    };
    onClickCreateCaregiverButton(data);
  };

  const handleImageUpload = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: url }));
    }
  };

  const errorBlock =
    error && error.code >= 400 ? (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>요양보호사 등록 실패</AlertTitle>
        <AlertDescription role="alert">{error.message}</AlertDescription>
      </Alert>
    ) : null;

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/caregivers">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title="요양보호사 등록"
          description="새로운 요양보호사를 등록합니다"
          className="mb-0 flex-1"
        />
      </div>

      <Alert className="mb-6">
        <Check className="h-4 w-4" />
        <AlertDescription className="text-lg">
          요양보호사 등록을 위해 아래 정보를 입력해주세요. 모든 필수 항목을
          작성해야 등록이 완료됩니다.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={
                      formData.profileImage ||
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                    }
                    alt="프로필 이미지"
                  />
                  <AvatarFallback className="text-4xl">
                    {formData.name ? formData.name[0] : "요"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10"
                  onClick={handleImageUpload}
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="요양보호사 이름을 입력하세요"
                  className={`text-lg h-14 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* 생년월일 */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-lg">
                  생년월일 <span className="text-red-500">*</span>
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="birthDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left text-lg font-normal h-14",
                        !formData.birthDate && "text-muted-foreground",
                        errors.birthDate ? "border-red-500" : "",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {formData.birthDate
                        ? format(formData.birthDate, "yyyy년 MM월 dd일", {
                            locale: ko,
                          })
                        : "생년월일을 선택하세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.birthDate || "")}
                      onSelect={(date) => {
                        setFormData((prev) => ({ ...prev, birthDate: date }));
                        setIsCalendarOpen(false);
                      }}
                      required
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
                {formData.birthDate && (
                  <p className="text-sm text-muted-foreground">
                    나이: {calculateAge(formData.birthDate)}세
                  </p>
                )}
                {errors.birthDate && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.birthDate}
                  </div>
                )}
              </div>
            </div>

            {/* 연락처 */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-lg">
                연락처 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
                className={`text-lg h-14 ${errors.phoneNumber ? "border-red-500" : ""}`}
              />
              {errors.phoneNumber && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phoneNumber}
                </div>
              )}
            </div>

            {/* 주소 */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg">
                주소 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="서울시 강남구 테헤란로 123"
                className={`text-lg h-14 ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.address}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 자격 정보 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">자격 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 자격증 번호 */}
            <div className="space-y-2">
              <Label htmlFor="certificateNumber" className="text-lg">
                요양보호사 자격증 번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="certificateNumber"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleInputChange}
                placeholder="LC-2020-001234"
                className={`text-lg h-14 ${errors.certificateNumber ? "border-red-500" : ""}`}
              />
              {errors.certificateNumber && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.certificateNumber}
                </div>
              )}
            </div>

            {/* 경력 */}
            <div className="space-y-2">
              <Label htmlFor="career" className="text-lg">
                경력 (년) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="career"
                name="career"
                type="number"
                value={formData.career}
                onChange={handleInputChange}
                placeholder="경력을 년 단위로 입력하세요"
                className={`text-lg h-14 ${errors.career ? "border-red-500" : ""}`}
                min="0"
                max="50"
              />
              {errors.career && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.career}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                신입인 경우 0을 입력해주세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 소개 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">소개</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">
                자기소개
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="간단한 자기소개와 요양보호사로서의 경험이나 철학을 입력해주세요"
                className="min-h-[120px] text-lg"
              />
              <p className="text-sm text-muted-foreground">
                보호대상자와 가족들이 볼 수 있는 소개글입니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {errorBlock}

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link href="/admin/caregivers">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-lg"
            >
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            className="text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "요양보호사 등록"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

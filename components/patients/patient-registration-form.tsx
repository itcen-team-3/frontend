"use client";

import type React from "react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface FormData {
  name: string;
  birthDate: Date | undefined;
  phone: string;
  address: string;
  careGrade: string;
  familyContact: string;
  familyRelation: string;
  medicalNotes: string;
  imageUrl: string;
}

interface FormErrors {
  [key: string]: string;
}

export function PatientRegistrationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthDate: undefined,
    phone: "",
    address: "",
    careGrade: "",
    familyContact: "",
    familyRelation: "",
    medicalNotes: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectChange = (name: string, value: string) => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 필수 필드 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 선택해주세요";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "010-0000-0000 형식으로 입력해주세요";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요";
    }

    if (!formData.careGrade) {
      newErrors.careGrade = "장기요양등급을 선택해주세요";
    }

    if (!formData.familyContact.trim()) {
      newErrors.familyContact = "가족 연락처를 입력해주세요";
    }

    if (!formData.familyRelation) {
      newErrors.familyRelation = "가족 관계를 선택해주세요";
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

    try {
      // 실제 구현에서는 API 호출
      console.log("보호대상자 등록 데이터:", formData);

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("보호대상자가 성공적으로 등록되었습니다!");
      router.push("/admin/patients");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    // 실제 구현에서는 파일 업로드 처리
    console.log("이미지 업로드");
  };

  const getCareGradeText = (grade: string) => {
    switch (grade) {
      case "1":
        return "1등급 (가장 중증)";
      case "2":
        return "2등급";
      case "3":
        return "3등급";
      case "4":
        return "4등급";
      case "5":
        return "5등급 (경증)";
      case "cognitive":
        return "인지지원등급";
      default:
        return "";
    }
  };

  const calculateAge = (birthDate: Date | undefined): number | null => {
    if (!birthDate) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/patients">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title="보호대상자 등록"
          description="새로운 보호대상자를 등록합니다"
          className="mb-0 flex-1"
        />
      </div>

      <Alert className="mb-6">
        <Check className="h-4 w-4" />
        <AlertDescription className="text-lg">
          보호대상자 등록을 위해 아래 정보를 입력해주세요. 모든 필수 항목을
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
                      formData.imageUrl ||
                      "/placeholder.svg?height=128&width=128&query=elderly person"
                    }
                    alt="프로필 이미지"
                  />
                  <AvatarFallback className="text-4xl">
                    {formData.name ? formData.name[0] : "환"}
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
                  placeholder="보호대상자 이름을 입력하세요"
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
                <Popover>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, birthDate: date }))
                      }
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      classNames={{
                        caption_label: "hidden",
                        dropdown: "text-lg",
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        dropdown_month: "w-full",
                        dropdown_year: "w-full",
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

            {/* 장기요양등급 */}
            <div className="space-y-2">
              <Label htmlFor="careGrade" className="text-lg">
                장기요양등급 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.careGrade}
                onValueChange={(value) =>
                  handleSelectChange("careGrade", value)
                }
              >
                <SelectTrigger
                  className={`text-lg h-14 ${errors.careGrade ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="장기요양등급을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-lg">
                    1등급 (가장 중증)
                  </SelectItem>
                  <SelectItem value="2" className="text-lg">
                    2등급
                  </SelectItem>
                  <SelectItem value="3" className="text-lg">
                    3등급
                  </SelectItem>
                  <SelectItem value="4" className="text-lg">
                    4등급
                  </SelectItem>
                  <SelectItem value="5" className="text-lg">
                    5등급 (경증)
                  </SelectItem>
                  <SelectItem value="cognitive" className="text-lg">
                    인지지원등급
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.careGrade && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.careGrade}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                장기요양등급은 요양 서비스 제공의 기준이 됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">연락처 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 본인 연락처 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                본인 연락처 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
                className={`text-lg h-14 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </div>
              )}
            </div>

            {/* 가족 관계 */}
            <div className="space-y-2">
              <Label htmlFor="familyRelation" className="text-lg">
                가족 관계 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.familyRelation}
                onValueChange={(value) =>
                  handleSelectChange("familyRelation", value)
                }
              >
                <SelectTrigger
                  className={`text-lg h-14 ${errors.familyRelation ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="가족 관계를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse" className="text-lg">
                    배우자
                  </SelectItem>
                  <SelectItem value="son" className="text-lg">
                    아들
                  </SelectItem>
                  <SelectItem value="daughter" className="text-lg">
                    딸
                  </SelectItem>
                  <SelectItem value="father" className="text-lg">
                    아버지
                  </SelectItem>
                  <SelectItem value="mother" className="text-lg">
                    어머니
                  </SelectItem>
                  <SelectItem value="brother" className="text-lg">
                    형제
                  </SelectItem>
                  <SelectItem value="sister" className="text-lg">
                    자매
                  </SelectItem>
                  <SelectItem value="other" className="text-lg">
                    기타
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.familyRelation && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.familyRelation}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyContact" className="text-lg">
                가족 연락처 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="familyContact"
                name="familyContact"
                value={formData.familyContact}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
                className={`text-lg h-14 ${errors.familyContact ? "border-red-500" : ""}`}
              />
              {errors.familyContact && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.familyContact}
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

        {/* 건강 정보 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">건강 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="medicalNotes" className="text-lg">
                건강 상태 및 특이사항
              </Label>
              <Textarea
                id="medicalNotes"
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleInputChange}
                placeholder="복용 중인 약물, 알레르기, 주의사항, 기존 질병 등을 상세히 입력하세요"
                className="min-h-[120px] text-lg"
              />
              <p className="text-sm text-muted-foreground">
                요양보호사가 알아야 할 중요한 건강 정보를 입력해주세요. 이
                정보는 안전한 돌봄 서비스 제공에 필수적입니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 등록 정보 요약 */}
        {formData.name && formData.birthDate && formData.careGrade && (
          <Card className="card-shadow bg-muted/30">
            <CardHeader>
              <CardTitle className="text-xl">등록 정보 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground">이름</p>
                  <p className="text-lg font-medium">{formData.name}</p>
                </div>
                <div className="p-3 border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground">나이</p>
                  <p className="text-lg font-medium">
                    {calculateAge(formData.birthDate)}세
                  </p>
                </div>
                <div className="p-3 border rounded-lg bg-white">
                  <p className="text-sm text-muted-foreground">장기요양등급</p>
                  <p className="text-lg font-medium">
                    {getCareGradeText(formData.careGrade)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link href="/admin/patients">
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
            {isSubmitting ? "등록 중..." : "보호대상자 등록"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

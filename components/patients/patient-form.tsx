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
import { Camera, ArrowLeft, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatientFormProps {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    age: string;
    address: string;
    phone: string;
    medicalNotes: string;
    familyContact: string;
    imageUrl: string;
    careGrade: string;
  };
}

export function PatientForm({
  mode = "create",
  initialData = {
    name: "",
    age: "",
    address: "",
    phone: "",
    medicalNotes: "",
    familyContact: "",
    imageUrl: "",
    careGrade: "",
  },
}: PatientFormProps) {
  const [formData, setFormData] = useState(
    mode === "create"
      ? {
          name: "",
          age: "",
          address: "",
          phone: "",
          medicalNotes: "",
          familyContact: "",
          imageUrl: "",
          careGrade: "",
        }
      : initialData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }
    if (!formData.age.trim()) {
      newErrors.age = "나이를 입력해주세요";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    }
    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요";
    }
    if (!formData.careGrade) {
      newErrors.careGrade = "등급을 선택해주세요";
    }
    if (!formData.familyContact.trim()) {
      newErrors.familyContact = "가족 연락처를 입력해주세요";
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
      // 실제 구현에서는 여기서 API를 호출합니다
      console.log("Submitting patient data:", formData);

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 시 목록 페이지로 이동
      // router.push('/admin/patients')
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "create" ? "보호대상자 등록" : "보호대상자 정보 수정";
  const description =
    mode === "create"
      ? "새로운 보호대상자를 등록합니다"
      : "보호대상자 정보를 수정합니다";
  const buttonText = mode === "create" ? "등록하기" : "수정하기";

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/patients">
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

      {mode === "create" && (
        <Alert className="mb-6">
          <Check className="h-4 w-4" />
          <AlertDescription className="text-lg">
            보호대상자 등록을 위해 아래 정보를 입력해주세요. 모든 필수 항목을
            작성해야 등록이 완료됩니다.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-4">
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
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="보호대상자 이름을 입력하세요"
                  className={`text-lg h-14 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-lg">
                  나이 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="나이를 입력하세요"
                  className={`text-lg h-14 ${errors.age ? "border-red-500" : ""}`}
                  min="1"
                  max="120"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
              </div>
            </div>

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
                <p className="text-red-500 text-sm">{errors.careGrade}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">연락처 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                본인 연락처 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                className={`text-lg h-14 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
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
                onChange={handleChange}
                placeholder="010-0000-0000 (관계: 아들/딸/배우자 등)"
                className={`text-lg h-14 ${errors.familyContact ? "border-red-500" : ""}`}
              />
              {errors.familyContact && (
                <p className="text-red-500 text-sm">{errors.familyContact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg">
                주소 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="서울시 강남구 테헤란로 123"
                className={`text-lg h-14 ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

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
                onChange={handleChange}
                placeholder="복용 중인 약물, 알레르기, 주의사항 등을 입력하세요"
                className="min-h-[120px] text-lg"
              />
              <p className="text-sm text-muted-foreground">
                요양보호사가 알아야 할 중요한 건강 정보를 입력해주세요.
              </p>
            </div>
          </CardContent>
        </Card>

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
            {isSubmitting ? "처리 중..." : buttonText}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

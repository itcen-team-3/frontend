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
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CaregiverFormProps {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    age: string;
    address: string;
    phone: string;
    bio: string;
    imageUrl: string;
    licenseNumber: string;
    experience: string;
  };
}

export function CaregiverForm({
  mode = "create",
  initialData = {
    name: "",
    age: "",
    address: "",
    phone: "",
    bio: "",
    imageUrl: "",
    licenseNumber: "",
    experience: "",
  },
}: CaregiverFormProps) {
  const [formData, setFormData] = useState(
    mode === "create"
      ? {
          name: "",
          age: "",
          address: "",
          phone: "",
          bio: "",
          imageUrl: "",
          licenseNumber: "",
          experience: "",
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
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "자격증 번호를 입력해주세요";
    }
    if (!formData.experience.trim()) {
      newErrors.experience = "경력을 입력해주세요";
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
      console.log("Submitting caregiver data:", formData);

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 시 목록 페이지로 이동
      // router.push('/admin/caregivers')
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "create" ? "요양보호사 등록" : "요양보호사 정보 수정";
  const description =
    mode === "create"
      ? "새로운 요양보호사를 등록합니다"
      : "요양보호사 정보를 수정합니다";
  const buttonText = mode === "create" ? "등록하기" : "수정하기";

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/caregivers">
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
            요양보호사 등록을 위해 아래 정보를 입력해주세요. 모든 필수 항목을
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
                      "/placeholder.svg?height=128&width=128&query=person"
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
                  placeholder="요양보호사 이름을 입력하세요"
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
                  min="18"
                  max="80"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                연락처 <span className="text-red-500">*</span>
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
            <CardTitle className="text-xl">자격 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-lg">
                요양보호사 자격증 번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="자격증 번호를 입력하세요"
                className={`text-lg h-14 ${errors.licenseNumber ? "border-red-500" : ""}`}
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-lg">
                경력 (년) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                placeholder="경력을 년 단위로 입력하세요"
                className={`text-lg h-14 ${errors.experience ? "border-red-500" : ""}`}
                min="0"
                max="50"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
              )}
              <p className="text-sm text-muted-foreground">
                신입인 경우 0을 입력해주세요.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">소개</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-lg">
                자기소개
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="간단한 자기소개와 요양보호사로서의 경험이나 철학을 입력해주세요"
                className="min-h-[120px] text-lg"
              />
              <p className="text-sm text-muted-foreground">
                보호대상자와 가족들이 볼 수 있는 소개글입니다.
              </p>
            </div>
          </CardContent>
        </Card>

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
            {isSubmitting ? "처리 중..." : buttonText}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

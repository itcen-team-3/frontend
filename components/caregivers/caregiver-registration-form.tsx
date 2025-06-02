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
import { Camera, ArrowLeft, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  age: string;
  phone: string;
  address: string;
  licenseNumber: string;
  experience: string;
  bio: string;
  imageUrl: string;
}

interface FormErrors {
  [key: string]: string;
}

export function CaregiverRegistrationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    phone: "",
    address: "",
    licenseNumber: "",
    experience: "",
    bio: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 필수 필드 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.age.trim()) {
      newErrors.age = "나이를 입력해주세요";
    } else {
      const age = Number.parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 80) {
        newErrors.age = "18세 이상 80세 이하로 입력해주세요";
      }
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

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "요양보호사 자격증 번호를 입력해주세요";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "경력을 입력해주세요";
    } else {
      const experience = Number.parseInt(formData.experience);
      if (isNaN(experience) || experience < 0 || experience > 50) {
        newErrors.experience = "0년 이상 50년 이하로 입력해주세요";
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

    try {
      // 실제 구현에서는 API 호출
      console.log("요양보호사 등록 데이터:", formData);

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("요양보호사가 성공적으로 등록되었습니다!");
      router.push("/admin/caregivers");
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

              {/* 나이 */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-lg">
                  나이 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="나이를 입력하세요"
                  className={`text-lg h-14 ${errors.age ? "border-red-500" : ""}`}
                  min="18"
                  max="80"
                />
                {errors.age && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.age}
                  </div>
                )}
              </div>
            </div>

            {/* 연락처 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                연락처 <span className="text-red-500">*</span>
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
              <Label htmlFor="licenseNumber" className="text-lg">
                요양보호사 자격증 번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="LC-2020-001234"
                className={`text-lg h-14 ${errors.licenseNumber ? "border-red-500" : ""}`}
              />
              {errors.licenseNumber && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.licenseNumber}
                </div>
              )}
            </div>

            {/* 경력 */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-lg">
                경력 (년) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="경력을 년 단위로 입력하세요"
                className={`text-lg h-14 ${errors.experience ? "border-red-500" : ""}`}
                min="0"
                max="50"
              />
              {errors.experience && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.experience}
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
              <Label htmlFor="bio" className="text-lg">
                자기소개
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
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

"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Upload, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  facilityName: string;
  representativeName: string;
  phone: string;
  email: string;
  address: string;
  businessRegistration: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export function AdminSignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    facilityName: "",
    representativeName: "",
    phone: "",
    email: "",
    address: "",
    businessRegistration: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationPreview, setRegistrationPreview] = useState<string | null>(
    null,
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFormData((prev) => ({
        ...prev,
        businessRegistration: file,
      }));

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setRegistrationPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 에러 메시지 제거
      if (errors.businessRegistration) {
        setErrors((prev) => ({
          ...prev,
          businessRegistration: "",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 아이디 검증
    if (!formData.username.trim()) {
      newErrors.username = "아이디를 입력해주세요";
    } else if (formData.username.length < 4) {
      newErrors.username = "아이디는 4자 이상이어야 합니다";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    // 시설명 검증
    if (!formData.facilityName.trim()) {
      newErrors.facilityName = "시설명을 입력해주세요";
    }

    // 대표자명 검증
    if (!formData.representativeName.trim()) {
      newErrors.representativeName = "대표자명을 입력해주세요";
    }

    // 연락처 검증
    if (!formData.phone.trim()) {
      newErrors.phone = "연락처를 입력해주세요";
    } else {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "010-0000-0000 형식으로 입력해주세요";
      }
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "올바른 이메일 형식이 아닙니다";
      }
    }

    // 주소 검증
    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요";
    }

    // 사업자등록증 검증
    if (!formData.businessRegistration) {
      newErrors.businessRegistration = "사업자등록증 사본을 업로드해주세요";
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
      console.log("관리자 회원가입 데이터:", {
        ...formData,
        businessRegistration: formData.businessRegistration?.name,
      });

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitSuccess(true);

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch (error) {
      console.error("회원가입 실패:", error);
      setErrors({
        form: "회원가입에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            회원가입 성공!
          </CardTitle>
          <CardDescription className="text-lg">
            관리자 계정이 성공적으로 생성되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-lg">
              가입 승인 후 서비스를 이용하실 수 있습니다. 승인까지 1-2일 정도
              소요될 수 있습니다.
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <p className="text-muted-foreground">
              잠시 후 로그인 페이지로 이동합니다...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">관리자 회원가입</CardTitle>
        <CardDescription className="text-lg">
          요양시설 관리자 계정을 생성합니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <Image
              src="/nursing-home-logo.png"
              alt="요양시설 로고"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>

          {errors.form && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 아이디 */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-lg">
                  아이디 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                  className={`h-12 text-lg ${errors.username ? "border-red-500" : ""}`}
                />
                {errors.username && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username}
                  </div>
                )}
              </div>

              {/* 시설명 */}
              <div className="space-y-2">
                <Label htmlFor="facilityName" className="text-lg">
                  시설명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="facilityName"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleInputChange}
                  placeholder="시설명을 입력하세요"
                  className={`h-12 text-lg ${errors.facilityName ? "border-red-500" : ""}`}
                />
                {errors.facilityName && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.facilityName}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  비밀번호 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요"
                    className={`h-12 text-lg pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-lg">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    className={`h-12 text-lg pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 대표자명 */}
              <div className="space-y-2">
                <Label htmlFor="representativeName" className="text-lg">
                  대표자명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="representativeName"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                  placeholder="대표자명을 입력하세요"
                  className={`h-12 text-lg ${errors.representativeName ? "border-red-500" : ""}`}
                />
                {errors.representativeName && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.representativeName}
                  </div>
                )}
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
                  className={`h-12 text-lg ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                className={`h-12 text-lg ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* 주소 */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg">
                주소 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="주소를 입력하세요"
                className={`min-h-[80px] text-lg ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.address}
                </div>
              )}
            </div>

            {/* 사업자등록증 업로드 */}
            <div className="space-y-2">
              <Label htmlFor="businessRegistration" className="text-lg">
                사업자등록증 사본 <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                <input
                  id="businessRegistration"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {registrationPreview ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto max-w-md">
                      <img
                        src={registrationPreview || "/placeholder.svg"}
                        alt="사업자등록증 미리보기"
                        className="max-h-48 mx-auto object-contain"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => {
                          setRegistrationPreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            businessRegistration: null,
                          }));
                        }}
                      >
                        변경
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.businessRegistration?.name}
                    </p>
                  </div>
                ) : (
                  <label
                    htmlFor="businessRegistration"
                    className="cursor-pointer block"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">
                        사업자등록증을 업로드하세요
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, PNG, PDF 파일 (최대 5MB)
                      </p>
                    </div>
                  </label>
                )}
              </div>
              {errors.businessRegistration && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.businessRegistration}
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                회원가입 후 관리자 승인 과정이 필요합니다. 승인까지 1-2일 정도
                소요될 수 있습니다.
              </AlertDescription>
            </Alert>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-xl mt-4"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/admin/login" className="text-primary hover:underline">
            로그인하기
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          회원가입 시{" "}
          <Link href="#" className="underline">
            서비스 이용약관
          </Link>
          과{" "}
          <Link href="#" className="underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </CardFooter>
    </Card>
  );
}

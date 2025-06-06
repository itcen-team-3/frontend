"use client";

import type React from "react";
import type { SignUpRequest } from "@/lib/types/member";
import type { ErrorMessage } from "@/lib/types/api";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import Loading from "../ui/loading-page";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  isLoading: boolean;
  error: ErrorMessage;
  onClickSignUpButton: (args: SignUpRequest) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function AdminSignupForm({
  isLoading,
  error,
  onClickSignUpButton,
}: SignupFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpRequest>({
    loginId: "",
    loginPw: "",
    loginPwConfirm: "",
    representativeName: "",
    birthDate: "",
    companyName: "",
    companyAddress: "",
    email: "",
    businessRegistrationFile: null,
    businessRegistrationNumber: "",
    openingDate: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationPreview, setRegistrationPreview] = useState<string | null>(
    null
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev: SignUpRequest) => ({
        ...prev,
        businessRegistrationFile: file,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setRegistrationPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 아이디 검증
    if (!formData.loginId.trim()) {
      newErrors.loginId = "아이디를 입력해주세요";
    } else if (formData.loginId.length < 4) {
      newErrors.loginId = "아이디는 4자 이상이어야 합니다";
    }

    // 비밀번호 검증
    if (!formData.loginPw) {
      newErrors.loginPw = "비밀번호를 입력해주세요";
    } else if (formData.loginPw.length < 8) {
      newErrors.loginPw = "비밀번호는 8자 이상이어야 합니다";
    }

    // 비밀번호 확인 검증
    if (!formData.loginPwConfirm) {
      newErrors.loginPwConfirm = "비밀번호 확인을 입력해주세요";
    } else if (formData.loginPw !== formData.loginPwConfirm) {
      newErrors.loginPwConfirm = "비밀번호가 일치하지 않습니다";
    }

    // 생년월일 검증
    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 입력해주세요";
    }

    // 시설명 검증
    if (!formData.companyName.trim()) {
      newErrors.companyName = "시설명을 입력해주세요";
    }

    // 대표자명 검증
    if (!formData.representativeName.trim()) {
      newErrors.representativeName = "대표자명을 입력해주세요";
    }

    // 연락처 검증
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "연락처를 입력해주세요";
    } else {
      const phoneRegex = /^010\d{4}\d{4}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "01000000000 형식으로 입력해주세요";
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

    // 사업자등록번호 검증
    if (!formData.businessRegistrationNumber) {
      newErrors.businessRegistrationNumber = "사업자등록번호를 입력해주세요";
    }

    // 개업일 검증
    if (!formData.openingDate) {
      newErrors.openingDate = "개업일을 입력해주세요";
    }

    // 주소 검증
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = "주소를 입력해주세요";
    }

    // 사업자등록증 파일 검증
    if (!formData.businessRegistrationFile) {
      newErrors.businessRegistrationFile = "사업자등록증 사본을 업로드해주세요";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    onClickSignUpButton(formData);
    setSubmitSuccess(true);
  };

  const errorBlock =
    error && error.code >= 400 ? (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>로그인 실패</AlertTitle>
        <AlertDescription role="alert">{error.message}</AlertDescription>
      </Alert>
    ) : null;

  if (submitSuccess) {
    setTimeout(() => {
      router.push("/admin/login");
    }, 2000);

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
                  id="loginId"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                  className={`h-12 text-lg ${errors.loginId ? "border-red-500" : ""}`}
                />
                {errors.loginId && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.loginId}
                  </div>
                )}
              </div>

              {/* 시설명 */}
              <div className="space-y-2">
                <Label htmlFor="facilityName" className="text-lg">
                  시설명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="시설명을 입력하세요"
                  className={`h-12 text-lg ${errors.companyName ? "border-red-500" : ""}`}
                />
                {errors.companyName && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.companyName}
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
                    id="loginPw"
                    name="loginPw"
                    type={showPassword ? "text" : "password"}
                    value={formData.loginPw}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요"
                    className={`h-12 text-lg pr-10 ${errors.loginPw ? "border-red-500" : ""}`}
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
                {errors.loginPw && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.loginPw}
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
                    id="loginPwConfirm"
                    name="loginPwConfirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.loginPwConfirm}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    className={`h-12 text-lg pr-10 ${errors.loginPwConfirm ? "border-red-500" : ""}`}
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
                {errors.loginPwConfirm && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.loginPwConfirm}
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

              {/* 생년월일 */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-lg">
                  생년월일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`h-12 text-lg ${errors.birthDate ? "border-red-500" : ""}`}
                />
                {errors.birthDate && (
                  <div className="text-red-500 text-sm">{errors.birthDate}</div>
                )}
              </div>

              {/* 연락처 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg">
                  연락처 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="01000000000"
                  className={`h-12 text-lg ${errors.phoneNumber ? "border-red-500" : ""}`}
                />
                {errors.phoneNumber && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phoneNumber}
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

            <div className="space-y-2">
              <Label htmlFor="businessRegistrationNumber" className="text-lg">
                사업자등록번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessRegistrationNumber"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                placeholder="0000000000"
                className={`h-12 text-lg ${errors.businessRegistrationNumber ? "border-red-500" : ""}`}
              />
              {errors.businessRegistrationNumber && (
                <div className="text-red-500 text-sm">
                  {errors.businessRegistrationNumber}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingDate" className="text-lg">
                개업일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="openingDate"
                name="openingDate"
                type="date"
                value={formData.openingDate}
                onChange={handleInputChange}
                className={`h-12 text-lg ${errors.openingDate ? "border-red-500" : ""}`}
              />
              {errors.openingDate && (
                <div className="text-red-500 text-sm">{errors.openingDate}</div>
              )}
            </div>

            {/* 주소 */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg">
                주소 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                placeholder="주소를 입력하세요"
                className={`min-h-[80px] text-lg ${errors.companyAddress ? "border-red-500" : ""}`}
              />
              {errors.companyAddress && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.companyAddress}
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
                      {formData.businessRegistrationFile?.name}
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
              {errors.businessRegistrationFile && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.businessRegistrationFile}
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

          {errorBlock}

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

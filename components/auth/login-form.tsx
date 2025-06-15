"use client";

import type React from "react";
import type { SignInRequest } from "@/lib/types/member";
import type { ErrorMessage } from "@/lib/types/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Loading from "../ui/loading-page";

// userType prop 추가
interface LoginFormProps {
  userType?: "caregiver" | "admin" | "family";
  isLoading: boolean;
  error: ErrorMessage;
  onClickLoginButton: (args: SignInRequest) => void;
}

export function LoginForm({
  userType = "caregiver",
  isLoading,
  error,
  onClickLoginButton,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  if (isLoading) {
    return <Loading />;
  }

  const errorBlock =
    error && error.code >= 400 ? (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>로그인 실패</AlertTitle>
        <AlertDescription role="alert">{error.message}</AlertDescription>
      </Alert>
    ) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUserTypeText = () => {
    switch (userType) {
      case "admin":
        return "관리자";
      case "family":
        return "보호자";
      default:
        return "요양보호사";
    }
  };

  const getOtherLoginLinks = () => {
    const links = [];
    if (userType !== "caregiver") {
      links.push({ href: "/caregiver/login", text: "요양보호사 로그인" });
    }
    if (userType !== "admin") {
      links.push({ href: "/admin/login", text: "관리자 로그인" });
    }
    if (userType !== "family") {
      links.push({ href: "/family/login", text: "보호자 로그인" });
    }
    return links;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData.username);
    console.log(formData.password);
    onClickLoginButton({
      loginId: formData.username,
      loginPw: formData.password,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">요양시설 관리</CardTitle>
        <CardDescription className="text-xl">
          {getUserTypeText()} 로그인
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center"></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-lg">
              아이디
            </Label>
            <Input
              id="username"
              name="username"
              autoFocus
              autoComplete="username"
              disabled={isLoading}
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={handleChange}
              className="h-12 text-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg">
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                disabled={isLoading}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="h-12 text-lg pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>
          {errorBlock}
          <Button
            type="submit"
            className="w-full h-14 text-xl mt-4"
            size="lg"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            로그인
          </Button>
        </form>

        {/* 다른 로그인 링크 */}
        {getOtherLoginLinks().length > 0 && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              다른 계정으로 로그인
            </p>
            <div className="flex flex-col space-y-1">
              {getOtherLoginLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary hover:underline"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        로그인하면 서비스 이용약관에 동의하게 됩니다
      </CardFooter>
    </Card>
  );
}

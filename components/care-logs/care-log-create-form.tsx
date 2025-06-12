"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Camera, Trash2, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useRouter } from "next/navigation";
import { CareItem } from "@/lib/types/careLogs";
import { useModal } from "@/context/ModalContext";

interface Photo {
  id: string;
  type: string;
  file: File;
  preview: string;
}

interface CareLogCreateFormProps {
  patientName: string;
  date: string;
  careItemList: CareItem[];
  createCareLog: (data: any) => void;
}

export function CareLogCreateForm({
  patientName = "이환자",
  date = "2025-05-21",
  careItemList,
  createCareLog,
}: CareLogCreateFormProps) {
  const { showAlert } = useModal();
  // const router = useRouter();

  // 폼 상태 관리
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [durations, setDurations] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "services" | "photos" | "signature"
  >("services");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 서비스 카테고리별로 그룹화
  const servicesByCategory = careItemList.reduce(
    (acc, service) => {
      if (!acc[service.type]) {
        acc[service.type] = [];
      }
      acc[service.type].push(service);
      return acc;
    },
    {} as Record<string, CareItem[]>
  );

  // 서비스 선택/해제
  const handleServiceToggle = (code: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(code)) {
        // 서비스 해제 시 해당 소요시간도 제거
        const newDurations = { ...durations };
        delete newDurations[code];
        setDurations(newDurations);
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  // 소요시간 변경
  const handleDurationChange = (code: string, value: string) => {
    setDurations((prev) => ({
      ...prev,
      [code]: value,
    }));
  };

  // 사진 업로드
  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files).map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      return {
        id,
        type: "식사", // 기본값
        file,
        preview: URL.createObjectURL(file),
      };
    });

    setPhotos((prev) => [...prev, ...newPhotos]);

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 사진 삭제
  const handlePhotoDelete = (id: string) => {
    setPhotos((prev) => {
      const photoToDelete = prev.find((photo) => photo.id === id);
      if (photoToDelete) {
        URL.revokeObjectURL(photoToDelete.preview);
      }
      return prev.filter((photo) => photo.id !== id);
    });
  };

  // 사진 타입 변경
  const handlePhotoTypeChange = (id: string, type: string) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, type } : photo))
    );
  };

  // 서명 관련 함수들
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const rect = canvas.getBoundingClientRect();
    const x = isTouchEvent(e)
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;

    const y = isTouchEvent(e)
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;

    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x =
      (isTouchEvent(e)
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left) * scaleX;

    const y =
      (isTouchEvent(e)
        ? e.touches[0].clientY - rect.top
        : e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const isTouchEvent = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): e is React.TouchEvent<HTMLCanvasElement> => {
    return "touches" in e;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSignature(canvas.toDataURL());
    setIsSignatureDialogOpen(false);
  };

  // 최종 제출
  const handleSubmit = async () => {
    const patientId = localStorage.getItem("patientId");

    // 유효성 검사
    if (selectedServices.length === 0) {
      showAlert({ message: "최소 1개 이상의 돌봄 활동을 선택해주세요." });
      return;
    }

    // 선택된 서비스의 소요시간 체크
    const missingDurations = selectedServices.filter(
      (code) => !durations[code] || durations[code] === ""
    );
    if (missingDurations.length > 0) {
      showAlert({
        message: "선택한 모든 돌봄 활동의 소요시간을 입력해주세요.",
      });
      return;
    }

    if (!signature) {
      showAlert({ message: "서명을 완료해주세요." });
      return;
    }

    createCareLog({
      patientId,
      durations,
      photos,
      signFile: signature,
      description: notes,
    });
    setIsSubmitting(true);
  };

  const getCareItemName = (type: string) => {
    switch (type) {
      case "DAILY":
        return "일상생활지원";
      case "RECOGNITION":
        return "인지활동지원";
      case "PHYSICAL":
        return "신체활동지원";
      case "EMOTION":
        return "정서지원";
      case "ETC":
        return "기타";
      default:
        return "기타";
    }
  };

  const onClickNextPhotoButton = () => {
    setActiveTab("photos");
  };

  const onClickNextSignButton = () => {
    setActiveTab("signature");
  };

  return (
    <PageContainer>
      <PageHeader
        title="돌봄 일지 작성"
        description={`${patientName}님 - ${date}`}
      />

      <Tabs
        value={activeTab}
        // TODO : 이것보다 더 좋은 표현 방법이 있지 않을까
        onValueChange={(value: string) => {
          if (
            value === "services" ||
            value === "photos" ||
            value === "signature"
          ) {
            setActiveTab(value);
          }
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="services" className="text-lg">
            돌봄 활동
          </TabsTrigger>
          <TabsTrigger value="photos" className="text-lg">
            사진 첨부
          </TabsTrigger>
          <TabsTrigger value="signature" className="text-lg">
            서명 및 제출
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid gap-6">
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <Card key={category} className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {getCareItemName(category)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() =>
                            handleServiceToggle(service.id)
                          }
                          className="w-6 h-6 mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={service.id}
                            className="text-lg font-medium cursor-pointer"
                          >
                            {service.name}
                          </Label>
                          {selectedServices.includes(service.id) && (
                            <div className="mt-2 flex items-center">
                              <Label
                                htmlFor={`duration-${service.id}`}
                                className="mr-2 text-base"
                              >
                                소요 시간 (분):
                              </Label>
                              <Input
                                id={`duration-${service.id}`}
                                type="number"
                                value={durations[service.id] || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    service.id,
                                    e.target.value
                                  )
                                }
                                className="w-24 text-lg"
                                min="1"
                                max="300"
                                placeholder="분"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-xl">특이사항</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="특이사항이 있으면 입력해주세요 (선택사항)"
                  className="min-h-[120px] text-lg"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                size="lg"
                className="text-lg"
                onClick={onClickNextPhotoButton}
              >
                다음: 사진 첨부
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">식사 및 투약 사진 첨부</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Button
                    onClick={handlePhotoUpload}
                    size="lg"
                    className="text-lg"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    사진 첨부하기
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>

                {photos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="border rounded-lg p-3 space-y-3"
                      >
                        <div className="relative aspect-video rounded-md overflow-hidden">
                          <img
                            src={photo.preview || "/placeholder.svg"}
                            alt="첨부 사진"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <RadioGroup
                            value={photo.type}
                            onValueChange={(value) =>
                              handlePhotoTypeChange(photo.id, value)
                            }
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="식사"
                                id={`meal-${photo.id}`}
                              />
                              <Label htmlFor={`meal-${photo.id}`}>식사</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="투약"
                                id={`medication-${photo.id}`}
                              />
                              <Label htmlFor={`medication-${photo.id}`}>
                                투약
                              </Label>
                            </div>
                          </RadioGroup>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePhotoDelete(photo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    첨부된 사진이 없습니다. 식사 또는 투약 사진을 첨부해주세요.
                    (선택사항)
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => setActiveTab("services")}
                >
                  이전: 돌봄 활동
                </Button>
                <Button
                  size="lg"
                  className="text-lg"
                  onClick={onClickNextSignButton}
                >
                  다음: 서명 및 제출
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signature">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">서명 및 제출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <AlertDescription className="text-lg">
                    작성하신 돌봄 일지의 내용이 정확한지 확인해주세요. 서명 후
                    제출하면 수정이 어려울 수 있습니다.
                  </AlertDescription>
                </Alert>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">돌봄 일지 요약</h3>
                  <ul className="list-disc pl-5 space-y-1 text-base">
                    <li>선택한 돌봄 활동: {selectedServices.length}개</li>
                    <li>첨부된 사진: {photos.length}개</li>
                    <li>특이사항: {notes ? "작성됨" : "없음"}</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-6">
                  {signature ? (
                    <div className="space-y-4">
                      <div className="border rounded-md p-4 flex justify-center bg-gray-50">
                        <img
                          src={signature || "/placeholder.svg"}
                          alt="서명"
                          className="max-h-40"
                        />
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsSignatureDialogOpen(true)}
                        >
                          서명 다시하기
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setIsSignatureDialogOpen(true)}
                        size="lg"
                      >
                        서명하기
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg"
                    onClick={() => setActiveTab("photos")}
                  >
                    이전: 사진 첨부
                  </Button>
                  <div className="flex space-x-4">
                    <Button
                      size="lg"
                      className="text-lg"
                      onClick={handleSubmit}
                      disabled={
                        !signature ||
                        selectedServices.length === 0 ||
                        isSubmitting
                      }
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {isSubmitting ? "제출 중..." : "돌봄 일지 제출"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 서명 다이얼로그 */}
      <Dialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">서명하기</DialogTitle>
          </DialogHeader>
          <div className="border rounded-md p-2 bg-white">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={clearSignature}>
              지우기
            </Button>
            <Button onClick={saveSignature}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

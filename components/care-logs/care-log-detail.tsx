import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Camera } from "lucide-react";
import Link from "next/link";
import { CareItem } from "@/lib/types/careLogs";
import {
  CaregiverCareLogActivityItem,
  CaregiverCareLogImageItem,
} from "@/lib/types/careLogs";

interface Photo {
  id: string;
  type: string;
  url: string;
}

interface CareLogDetailProps {
  careItemList: CareItem[];
  patientName: string;
  careGiverName: string;
  createDate: string;
  startTime: string;
  endTime: string;
  careDetailList: CaregiverCareLogActivityItem[];
  description: string;
  photos?: Photo[];
  signUrl: string;
  imageInfoList: CaregiverCareLogImageItem[];
}

export function CareLogDetail({
  careItemList,
  patientName = "이환자",
  careGiverName = "김요양",
  createDate = "2025-05-21",
  startTime = "09:00",
  endTime = "12:00",
  careDetailList,
  description = "오늘은 식사를 잘 하셨습니다. 목욕 후 기분이 좋아지신 것 같습니다. 평소보다 기분이 밝으셔서 대화도 많이 나누었습니다.",
  imageInfoList,
  signUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
}: CareLogDetailProps) {
  console.log("careItemList", careItemList);

  // 서비스 카테고리별로 그룹화
  const servicesByCategory = careDetailList.reduce(
    (acc: any, service: any) => {
      if (!acc[service.careItemType]) {
        acc[service.careItemType] = [];
      }
      acc[service.careItemType].push(service);
      return acc;
    },
    {} as Record<string, CareItem[]>,
  );

  console.log("servicesByCategory", servicesByCategory);

  // 총 소요 시간 계산
  const totalDuration = careDetailList.reduce(
    (sum, activity) => sum + Number(activity.requiredMinutes),
    0,
  );

  // 시간을 시간:분 형식으로 변환
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
    }
    return `${mins}분`;
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

  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/caregiver/care-logs">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title="돌봄 일지 상세"
          description={`${patientName}님 - ${createDate}`}
          className="mb-0 flex-1"
        />
        {/* <Button variant="outline" size="icon">
          <Printer className="h-5 w-5" />
        </Button> */}
      </div>

      <div className="grid gap-6">
        {/* 기본 정보 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">요양보호사</p>
                </div>
                <p className="text-lg font-medium">{careGiverName}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">보호대상자</p>
                </div>
                <p className="text-lg font-medium">{patientName}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">날짜</p>
                </div>
                <p className="text-lg font-medium">{createDate}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">시간</p>
                </div>
                <p className="text-lg font-medium">
                  {startTime} - {endTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 돌봄 활동 */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-xl">돌봄 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 좋은 표현 방법임 ? */}
              {Object.entries(
                servicesByCategory as Record<
                  string,
                  CaregiverCareLogActivityItem[]
                >,
              ).map(([category, categoryActivities]) => {
                return (
                  <div key={category}>
                    <SectionHeader
                      title={getCareItemName(category)}
                      className="mb-3"
                    />
                    <div className="grid gap-3">
                      {categoryActivities.map(
                        (
                          activity: CaregiverCareLogActivityItem,
                          index: number,
                        ) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 border rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                              <div>
                                <span className="text-lg font-medium">
                                  {activity.careItemName}
                                </span>
                              </div>
                            </div>
                            <span className="text-lg font-medium text-primary">
                              {activity.requiredMinutes}분
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                <span className="text-xl font-semibold">총 소요 시간</span>
                <span className="text-xl font-bold text-primary">
                  {formatDuration(totalDuration)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 첨부 사진 */}
        {imageInfoList.length > 0 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">첨부 사진</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imageInfoList.map((photo, index) => (
                  <div key={`index_${index}`} className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={
                          photo.imageUrl ||
                          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                        }
                        alt={`${photo.imageType === "MEAL" ? "식사" : "투약"} 사진`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
                        <Camera className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          {photo.imageType === "MEAL" ? "식사" : "투약"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 특이사항 */}
        {description && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">특이사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-lg leading-relaxed">{description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 서명 */}
        {signUrl && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">요양보호사 서명</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-6 border rounded-lg bg-muted/30">
                <div className="max-w-md">
                  <img
                    src={signUrl}
                    alt="요양보호사 서명"
                    className="max-h-32 w-auto rounded"
                  />
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {careGiverName} 요양보호사
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-center space-x-4 pt-4">
          <Link href="/caregiver/care-logs">
            <Button variant="outline" size="lg" className="text-lg">
              목록으로 돌아가기
            </Button>
          </Link>
          {/* <Button variant="outline" size="lg" className="text-lg">
            <Printer className="mr-2 h-5 w-5" />
            인쇄하기
          </Button> */}
        </div>
      </div>
    </PageContainer>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Clock, User, Camera } from "lucide-react";
import Link from "next/link";

interface CareActivity {
  code: string;
  name: string;
  category: string;
  duration: number;
}

interface Photo {
  id: string;
  type: string;
  url: string;
}

interface CareLogDetailProps {
  patientName?: string;
  caregiverName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  activities?: CareActivity[];
  notes?: string;
  photos?: Photo[];
  signature?: string;
}

export function CareLogDetail({
  patientName = "이환자",
  caregiverName = "김요양",
  date = "2025-05-21",
  startTime = "09:00",
  endTime = "12:00",
  activities = [
    { code: "A07", name: "식사도움", category: "신체활동지원", duration: 30 },
    { code: "A06", name: "목욕도움", category: "신체활동지원", duration: 45 },
    {
      code: "B03",
      name: "청소 및 주변정돈",
      category: "일상생활지원",
      duration: 30,
    },
    {
      code: "D01",
      name: "말벗·격려 및 위로",
      category: "정서지원",
      duration: 45,
    },
  ],
  notes = "오늘은 식사를 잘 하셨습니다. 목욕 후 기분이 좋아지신 것 같습니다. 평소보다 기분이 밝으셔서 대화도 많이 나누었습니다.",
  photos = [
    { id: "1", type: "식사", url: "/placeholder.svg?height=200&width=300" },
    { id: "2", type: "투약", url: "/placeholder.svg?height=200&width=300" },
  ],
  signature = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
}: CareLogDetailProps) {
  // 카테고리별로 활동 그룹화
  const activitiesByCategory = activities.reduce(
    (acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    },
    {} as Record<string, CareActivity[]>,
  );

  // 총 소요 시간 계산
  const totalDuration = activities.reduce(
    (sum, activity) => sum + activity.duration,
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
          description={`${patientName}님 - ${date}`}
          className="mb-0 flex-1"
        />
        <Button variant="outline" size="icon">
          <Printer className="h-5 w-5" />
        </Button>
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
                <p className="text-lg font-medium">{caregiverName}</p>
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
                <p className="text-lg font-medium">{date}</p>
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
              {Object.entries(activitiesByCategory).map(
                ([category, categoryActivities]) => (
                  <div key={category}>
                    <SectionHeader title={category} className="mb-3" />
                    <div className="grid gap-3">
                      {categoryActivities.map((activity) => (
                        <div
                          key={activity.code}
                          className="flex justify-between items-center p-4 border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                            <div>
                              <span className="text-lg font-medium">
                                {activity.name}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({activity.code})
                              </span>
                            </div>
                          </div>
                          <span className="text-lg font-medium text-primary">
                            {activity.duration}분
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}

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
        {photos.length > 0 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">첨부 사진</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={`${photo.type} 사진`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
                        <Camera className="h-4 w-4 mr-2" />
                        <span className="font-medium">{photo.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 특이사항 */}
        {notes && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">특이사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-lg leading-relaxed">{notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 서명 */}
        {signature && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">요양보호사 서명</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-6 border rounded-lg bg-muted/30">
                <div className="max-w-md">
                  <img
                    src={signature || "/placeholder.svg"}
                    alt="요양보호사 서명"
                    className="max-h-32 w-auto border rounded"
                  />
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {caregiverName} 요양보호사
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
          <Button variant="outline" size="lg" className="text-lg">
            <Printer className="mr-2 h-5 w-5" />
            인쇄하기
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

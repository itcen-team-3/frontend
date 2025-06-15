import type { CaregiverDetailResponse } from "@/lib/types/member";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Edit, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface CaregiverDetailProps {
  data: CaregiverDetailResponse;
}

export function CaregiverDetail({ data }: CaregiverDetailProps) {
  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/caregivers">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title={`${name} 요양보호사`}
          description="요양보호사 상세 정보"
          className="mb-0 flex-1"
        />
        <Link href={`/admin/caregivers/${data.caregiverId}/edit`}>
          <Button variant="outline" size="lg">
            <Edit className="mr-2 h-5 w-5" />
            정보 수정
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-shadow md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src={
                  data.profileImage ||
                  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                }
                alt={data.name}
              />
              <AvatarFallback className="text-4xl">
                {data.name[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-1">{data.name}</h2>
            <p className="text-lg text-muted-foreground mb-4">
              요양보호사 / {data.age}세
            </p>

            <div className="w-full space-y-3">
              <div className="flex items-center p-3 border rounded-lg">
                <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-lg">{data.phoneNumber}</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-lg">{data.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">소개</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <p className="text-lg">{data.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow mt-6">
        <CardHeader>
          <CardTitle className="text-xl">근무 일정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.schedules.length > 0 ? (
              data.schedules.map((schedule, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">
                      {schedule.patientName} 님
                    </h3>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-base">{schedule.workDays}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* TODO : 데이터 테스트 필요 */}
                    {/* {schedule.days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {day}
                      </span>
                    ))} */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                등록된 근무 일정이 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

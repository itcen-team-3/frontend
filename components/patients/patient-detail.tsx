import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Edit, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

interface PatientSchedule {
  id: string;
  caregiverName: string;
  days: string[];
  time: string;
}

interface PatientDetailProps {
  id: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  medicalNotes: string;
  familyContact: string;
  imageUrl?: string;
  schedules: PatientSchedule[];
}

export function PatientDetail({
  id = "1",
  name = "이환자",
  age = 78,
  address = "서울시 강남구",
  phone = "010-1234-5678",
  medicalNotes = "고혈압 약 복용 중, 거동이 불편하여 휠체어 사용",
  familyContact = "010-9876-5432 (아들)",
  imageUrl = "/elderly-woman-knitting.png",
  schedules = [
    {
      id: "1",
      caregiverName: "김요양",
      days: ["월", "수", "금"],
      time: "09:00 - 12:00",
    },
    {
      id: "2",
      caregiverName: "박요양",
      days: ["화", "목"],
      time: "14:00 - 17:00",
    },
  ],
}: PatientDetailProps) {
  return (
    <PageContainer>
      <div className="flex items-center mb-6">
        <Link href="/admin/patients">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <PageHeader
          title={`${name} 님`}
          description="보호대상자 상세 정보"
          className="mb-0 flex-1"
        />
        <Link href={`/admin/patients/${id}/edit`}>
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
              <AvatarImage src={imageUrl || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="text-4xl">{name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-1">{name}</h2>
            <p className="text-lg text-muted-foreground mb-4">{age}세</p>

            <div className="w-full space-y-3">
              <div className="flex items-center p-3 border rounded-lg">
                <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-lg">{phone}</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-lg">{address}</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <User className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="text-lg">{familyContact}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">건강 상태 및 특이사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <p className="text-lg">{medicalNotes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">돌봄 일정</CardTitle>
            <Link href={`/admin/schedules/patient/${id}`}>
              <Button variant="outline">일정 관리</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">
                      {schedule.caregiverName} 요양보호사
                    </h3>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-base">{schedule.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {schedule.days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                등록된 돌봄 일정이 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

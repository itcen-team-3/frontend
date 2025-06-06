"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Plus, Search, Trash2, User } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorMessage } from "@/lib/types/api";
import { CaregiverListItem } from "@/lib/types/member";
import Loading from "../ui/loading-page";

interface CaregiverListProps {
  isLoading: boolean;
  error: ErrorMessage;
  onClickSearchButton: (args: string) => void;
  content: CaregiverListItem[];
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export function CaregiverList({
  isLoading,
  onClickSearchButton,
  content,
}: CaregiverListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<number | null>(
    null
  );

  if (isLoading) {
    return <Loading />;
  }

  const handleDeleteClick = (id: number) => {
    setSelectedCaregiverId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // 실제 구현에서는 여기서 삭제 API를 호출합니다
    console.log(`Deleting caregiver with ID: ${selectedCaregiverId}`);
    setDeleteDialogOpen(false);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageHeader
          title="요양보호사 관리"
          description="요양보호사 정보를 관리하세요"
          className="mb-0"
        />
        <Link href="/admin/caregivers/new">
          <Button size="lg" className="text-lg">
            <Plus className="mr-2 h-5 w-5" />새 요양보호사
          </Button>
        </Link>
      </div>

      <Card className="card-shadow mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">요양보호사 목록</CardTitle>
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"
                onClick={() => onClickSearchButton(searchTerm)}
              />
              <Input
                placeholder="이름으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onClickSearchButton(searchTerm);
                  }
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content && content.length > 0 ? (
              content.map((caregiver) => (
                <div
                  key={caregiver.caregiverId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      {/* TODO : caregiver.imageUrl 추가 */}
                      <AvatarImage
                        src={"/placeholder.svg"}
                        alt={caregiver.name}
                      />
                      <AvatarFallback>{caregiver.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{caregiver.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {caregiver.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/caregivers/${caregiver.caregiverId}`}>
                      <Button variant="outline" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/caregivers/${caregiver.caregiverId}/edit`}
                    >
                      <Button variant="outline" size="icon">
                        <Edit className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(caregiver.caregiverId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm
                  ? "검색 결과가 없습니다"
                  : "등록된 요양보호사가 없습니다"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">요양보호사 삭제</DialogTitle>
            <DialogDescription className="text-lg">
              정말로 이 요양보호사를 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

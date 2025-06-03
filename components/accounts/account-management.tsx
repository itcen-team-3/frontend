"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Search, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Account {
  id: string;
  username: string;
  name: string;
  role: "caregiver" | "family" | "admin";
  relatedName?: string;
  lastLogin?: string;
}

interface AccountManagementProps {
  accounts: Account[];
}

export function AccountManagement({
  accounts = [
    {
      id: "1",
      username: "caregiver1",
      name: "김요양",
      role: "caregiver",
      lastLogin: "2025-05-20 09:30",
    },
    {
      id: "2",
      username: "family1",
      name: "이가족",
      role: "family",
      relatedName: "이환자",
      lastLogin: "2025-05-19 14:20",
    },
    {
      id: "3",
      username: "admin1",
      name: "관리자",
      role: "admin",
      lastLogin: "2025-05-21 08:45",
    },
  ],
}: AccountManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);

  // 새 계정 생성 폼 상태
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    name: "",
    role: "caregiver",
    relatedId: "",
  });

  // 비밀번호 재설정 폼 상태
  const [resetPassword, setResetPassword] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });

  // 필터링된 계정
  const filteredAccounts = accounts.filter((account) => {
    // 검색어 필터링
    const matchesSearch =
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 역할 필터링
    const matchesRole = activeTab === "all" || account.role === activeTab;

    return matchesSearch && matchesRole;
  });

  const handleDeleteClick = (id: string) => {
    setSelectedAccountId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // 실제 구현에서는 여기서 삭제 API를 호출합니다
    console.log(`Deleting account with ID: ${selectedAccountId}`);
    setDeleteDialogOpen(false);
  };

  const handleCreateAccount = () => {
    // 실제 구현에서는 여기서 계정 생성 API를 호출합니다
    console.log("Creating new account:", newAccount);
    setIsCreateDialogOpen(false);
    // 폼 초기화
    setNewAccount({
      username: "",
      password: "",
      name: "",
      role: "caregiver",
      relatedId: "",
    });
  };

  const handleResetPassword = () => {
    // 실제 구현에서는 여기서 비밀번호 재설정 API를 호출합니다
    console.log("Resetting password:", resetPassword);
    setIsResetPasswordDialogOpen(false);
    // 폼 초기화
    setResetPassword({
      id: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleResetPasswordClick = (id: string) => {
    setResetPassword({
      id,
      password: "",
      confirmPassword: "",
    });
    setIsResetPasswordDialogOpen(true);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "caregiver":
        return "요양보호사";
      case "family":
        return "보호자";
      case "admin":
        return "관리자";
      default:
        return role;
    }
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <PageHeader
          title="계정 관리"
          description="사용자 계정을 관리하세요"
          className="mb-0"
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="text-lg">
              <UserPlus className="mr-2 h-5 w-5" />
              계정 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">새 계정 생성</DialogTitle>
              <DialogDescription className="text-lg">
                새로운 사용자 계정을 생성합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-lg">
                  역할
                </Label>
                <Select
                  value={newAccount.role}
                  onValueChange={(value) =>
                    setNewAccount({ ...newAccount, role: value })
                  }
                >
                  <SelectTrigger className="text-lg h-12">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caregiver" className="text-lg">
                      요양보호사
                    </SelectItem>
                    <SelectItem value="family" className="text-lg">
                      보호자
                    </SelectItem>
                    <SelectItem value="admin" className="text-lg">
                      관리자
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedId" className="text-lg">
                  {newAccount.role === "caregiver"
                    ? "요양보호사"
                    : "보호대상자"}
                </Label>
                <Select
                  value={newAccount.relatedId}
                  onValueChange={(value) =>
                    setNewAccount({ ...newAccount, relatedId: value })
                  }
                >
                  <SelectTrigger className="text-lg h-12">
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAccount.role === "caregiver" ? (
                      <>
                        <SelectItem value="c1" className="text-lg">
                          김요양
                        </SelectItem>
                        <SelectItem value="c2" className="text-lg">
                          박요양
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="p1" className="text-lg">
                          이환자
                        </SelectItem>
                        <SelectItem value="p2" className="text-lg">
                          최환자
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-lg">
                  아이디
                </Label>
                <Input
                  id="username"
                  value={newAccount.username}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, username: e.target.value })
                  }
                  className="text-lg h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  className="text-lg h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">
                  이름
                </Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="text-lg h-12"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                취소
              </Button>
              <Button size="lg" onClick={handleCreateAccount}>
                생성
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full mt-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all" className="text-lg">
            전체
          </TabsTrigger>
          <TabsTrigger value="caregiver" className="text-lg">
            요양보호사
          </TabsTrigger>
          <TabsTrigger value="family" className="text-lg">
            보호자
          </TabsTrigger>
          <TabsTrigger value="admin" className="text-lg">
            관리자
          </TabsTrigger>
        </TabsList>

        <Card className="card-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">계정 목록</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 ID로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">아이디</TableHead>
                    <TableHead className="text-base">이름</TableHead>
                    <TableHead className="text-base">역할</TableHead>
                    <TableHead className="text-base">관련 정보</TableHead>
                    <TableHead className="text-base">최근 로그인</TableHead>
                    <TableHead className="text-base text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="text-base font-medium">
                          {account.username}
                        </TableCell>
                        <TableCell className="text-base">
                          {account.name}
                        </TableCell>
                        <TableCell className="text-base">
                          {getRoleName(account.role)}
                        </TableCell>
                        <TableCell className="text-base">
                          {account.relatedName || "-"}
                        </TableCell>
                        <TableCell className="text-base">
                          {account.lastLogin || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleResetPasswordClick(account.id)
                              }
                            >
                              비밀번호 재설정
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteClick(account.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        검색 결과가 없습니다
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* 비밀번호 재설정 다이얼로그 */}
      <Dialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">비밀번호 재설정</DialogTitle>
            <DialogDescription className="text-lg">
              사용자의 비밀번호를 재설정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-lg">
                새 비밀번호
              </Label>
              <Input
                id="new-password"
                type="password"
                value={resetPassword.password}
                onChange={(e) =>
                  setResetPassword({
                    ...resetPassword,
                    password: e.target.value,
                  })
                }
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-lg">
                비밀번호 확인
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={resetPassword.confirmPassword}
                onChange={(e) =>
                  setResetPassword({
                    ...resetPassword,
                    confirmPassword: e.target.value,
                  })
                }
                className="text-lg h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              size="lg"
              onClick={handleResetPassword}
              disabled={
                !resetPassword.password ||
                resetPassword.password !== resetPassword.confirmPassword
              }
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계정 삭제 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">계정 삭제</DialogTitle>
            <DialogDescription className="text-lg">
              정말로 이 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

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
import { AccountItem, RoleItem, RoleNameItem } from "@/lib/types/member";
import { LoadingSpinner } from "../ui/loading-spinner";
import { RoleRequest, PasswordRequest, IdRequest } from "@/lib/types/member";

interface AccountManagementProps {
  roleNameList: RoleItem[];
  setSearchName: (value: string) => void;
  setSearchRole: (value: string) => void;
  accounts: AccountItem[];
  isGetAccountsLoading: boolean;
  setRoleName: (value: string) => void;
  nameListByRole: RoleNameItem[];
  createAccount: (body: RoleRequest) => void;
  editPassword: (memberId: string, body: PasswordRequest) => void;
  editId: (memberId: string, body: IdRequest) => void;
  deleteAccount: (memberId: string) => void;
}

export function AccountManagement({
  roleNameList,
  accounts,
  setSearchRole,
  setSearchName,
  setRoleName,
  isGetAccountsLoading,
  nameListByRole,
  createAccount,
  editPassword,
  editId,
  deleteAccount,
}: AccountManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<IdRequest>({
    memberId: "",
    loginNewId: "",
  });

  // 새 계정 생성 폼 상태
  const [newAccount, setNewAccount] = useState<RoleRequest>({
    id: "",
    password: "",
    memberId: "",
    role: "CAREGIVER",
  });

  // 비밀번호 재설정 폼 상태
  const [resetPassword, setResetPassword] = useState({
    memberId: "",
    password: "",
    confirmPassword: "",
  });

  const handleDeleteClick = (id: string) => {
    setSelectedAccountId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteAccount(selectedAccountId || "");
    setDeleteDialogOpen(false);
  };

  const handleCreateAccount = () => {
    createAccount(newAccount);
    // 폼 초기화
    setNewAccount({
      id: "",
      password: "",
      memberId: "",
      role: "CAREGIVER",
    });
    setIsCreateDialogOpen(false);
  };

  const handleResetPassword = () => {
    // 실제 구현에서는 여기서 비밀번호 재설정 API를 호출합니다
    console.log("Resetting password:", resetPassword);
    editPassword(resetPassword.memberId, {
      loginNewPw: resetPassword.password,
      loginNewPwConfirm: resetPassword.confirmPassword,
    });
    setIsResetPasswordDialogOpen(false);
    // 폼 초기화
    setResetPassword({
      memberId: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleResetPasswordClick = (memberId: string) => {
    setResetPassword({
      memberId,
      password: "",
      confirmPassword: "",
    });
    setIsResetPasswordDialogOpen(true);
  };

  const handleEditClick = (account: AccountItem) => {
    setEditAccount({
      memberId: account.memberId,
      loginNewId: account.loginId,
    });
    setIsEditDialogOpen(true);
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

  const onClickTab = (role: string) => {
    setSearchRole(role);
    setSearchTerm("");
    setSearchName("");
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
                  onValueChange={(value) => {
                    setNewAccount({ ...newAccount, role: value });
                    setRoleName(value);
                  }}
                >
                  <SelectTrigger className="text-lg h-12">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAREGIVER" className="text-lg">
                      요양보호사
                    </SelectItem>
                    <SelectItem value="PATIENT" className="text-lg">
                      보호자
                    </SelectItem>
                    {/* <SelectItem value="admin" className="text-lg">
                      관리자
                    </SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id" className="text-lg">
                  {newAccount.role === "CAREGIVER"
                    ? "요양보호사"
                    : "보호대상자"}
                </Label>
                <Select
                  value={newAccount.memberId}
                  onValueChange={(value) =>
                    setNewAccount({ ...newAccount, memberId: value })
                  }
                >
                  <SelectTrigger className="text-lg h-12">
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {nameListByRole.map((item, idx) => {
                      return (
                        <SelectItem
                          key={`name_${idx}`}
                          value={item.memberId}
                          className="text-lg"
                        >
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id" className="text-lg">
                  아이디
                </Label>
                <Input
                  id="id"
                  value={newAccount.id}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, id: e.target.value })
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
        defaultValue="CAREGIVER"
        className="w-full mt-6"
        onValueChange={onClickTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          {roleNameList.map((role, idx) => {
            return (
              <TabsTrigger
                key={`role_${idx}`}
                value={role.name}
                className="text-lg"
              >
                {role.displayName}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {isGetAccountsLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">계정 목록</CardTitle>
                <div className="relative w-64">
                  <Search
                    className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"
                    onClick={() => {
                      setSearchName(searchTerm);
                    }}
                  />
                  <Input
                    placeholder="이름 또는 ID로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearchName(searchTerm);
                      }
                    }}
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
                      <TableHead className="text-base text-right">
                        관리
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.length > 0 ? (
                      accounts.map((account) => (
                        <TableRow key={account.loginId}>
                          <TableCell className="text-base font-medium">
                            {account.loginId}
                          </TableCell>
                          <TableCell className="text-base">
                            {account.name}
                          </TableCell>
                          <TableCell className="text-base">
                            {getRoleName(account.role)}
                          </TableCell>
                          <TableCell className="text-base">
                            {account.patientName || "-"}
                          </TableCell>
                          <TableCell className="text-base">
                            {account.lastLoginAt || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleResetPasswordClick(account.memberId)
                                }
                              >
                                비밀번호 재설정
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditClick(account)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleDeleteClick(account.memberId)
                                }
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
        )}
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
              정말로 이 계정을 삭제하시겠습니까? <br /> 이 작업은 되돌릴 수
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">계정 수정</DialogTitle>
            <DialogDescription className="text-lg">
              계정 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-loginNewId" className="text-lg">
                아이디
              </Label>
              <Input
                id="edit-loginNewId"
                value={editAccount.loginNewId}
                onChange={(e) =>
                  setEditAccount({ ...editAccount, loginNewId: e.target.value })
                }
                className="text-lg h-12"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsEditDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              size="lg"
              onClick={() => {
                console.log("Updating account:", editAccount);
                editId(editAccount.memberId || "", {
                  loginNewId: editAccount.loginNewId,
                });
                setIsEditDialogOpen(false);
              }}
            >
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

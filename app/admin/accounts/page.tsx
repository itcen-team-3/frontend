"use client";

import { useState } from "react";
import { AccountManagement } from "@/components/accounts/account-management";
import { useGetAccounts } from "@/features/member/useGetAccounts";
import { useGetRoleList } from "@/features/member/useGetRoleList";
import { useGetNameListByRole } from "@/features/member/useGetNameListByRole";
import Loading from "@/components/ui/loading-page";
import { useCreateAccount } from "@/features/member/useCreateAccount";
import { useEditPassword } from "@/features/member/useEditPassword";
import { useEditId } from "@/features/member/useEditId";
import { useDeleteAccount } from "@/features/member/useDeleteAccount";

export default function AccountsPage() {
  const [searchName, setSearchName] = useState<string>("");
  const [searchRole, setSearchRole] = useState<string>("CAREGIVER");

  const { roleNameList, isRoleListLoading } = useGetRoleList();
  const { data, isGetAccountsLoading } = useGetAccounts(searchName, searchRole);

  // create pop-up
  const [roleName, setRoleName] = useState<string>("CAREGIVER");
  const { nameListByRole } = useGetNameListByRole(roleName);
  const { createAccount } = useCreateAccount();

  // edit pop-up (id, password)
  const { editPassword } = useEditPassword();
  const { editId } = useEditId();
  const { deleteAccount } = useDeleteAccount();

  if (isRoleListLoading) {
    return <Loading />;
  }

  return (
    <AccountManagement
      roleNameList={roleNameList || []}
      setSearchName={setSearchName}
      setSearchRole={setSearchRole}
      setRoleName={setRoleName}
      accounts={data?.content || []}
      isGetAccountsLoading={isGetAccountsLoading}
      nameListByRole={nameListByRole || []}
      createAccount={createAccount}
      editPassword={editPassword}
      editId={editId}
      deleteAccount={deleteAccount}
    />
  );
}

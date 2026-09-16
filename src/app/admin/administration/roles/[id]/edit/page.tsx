"use client";

import UrlGuard from "@/lib/UrlGuard";
import { useGetSingleRoleQuery } from "@/store/apis/auth/authentication.api";
import { useParams } from "next/navigation";
import React from "react";
import RoleForm from "../../form";

const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: role, isFetching } = useGetSingleRoleQuery(id);

  let content: React.ReactNode = null;
  if (isFetching) {
    content = (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else if (role) {
    content = <RoleForm initial={role} id={role.id} isUpdate />;
  }

  return (
    <UrlGuard permission="change_group">
      <div className="m-auto p-7 bg-white mt-10">
        {content}
      </div>
    </UrlGuard>
  );
};

export default EditRolePage;

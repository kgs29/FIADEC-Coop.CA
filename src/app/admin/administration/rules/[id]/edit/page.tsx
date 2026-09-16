"use client";

import UrlGuard from "@/lib/UrlGuard";
import { useGetSingleRuleQuery } from "@/store/apis/auth/authentication.api";
import { useParams } from "next/navigation";
import React from "react";
import RuleForm from "../../form";

const EditRulePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: rule, isFetching } = useGetSingleRuleQuery(id);

  let content: React.ReactNode = null;
  if (isFetching) {
    content = (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else if (rule) {
    content = <RuleForm initial={rule} id={id} isUpdate />;
  }

  return (
    <UrlGuard permission="change_group">
      <div className="m-auto p-7 bg-white mt-10">
        {content}
      </div>
    </UrlGuard>
  );
};

export default EditRulePage;

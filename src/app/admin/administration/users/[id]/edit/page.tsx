import React from "react";
import EditUserComponent from "./EditComponent";
import UrlGuard from "@/lib/UrlGuard";

const BasePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  return (
    <UrlGuard permission="change_user">
      <EditUserComponent params={resolvedParams} />
    </UrlGuard>
  );
};

export default BasePage;

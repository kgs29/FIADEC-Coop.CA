'use client'

import React, { Suspense } from "react";
import ResetPasswordConfirmComponent from "./ResetPasswordConfirmComponent";
import { useSearchParams } from "next/navigation";

const ResetPasswordConfirmContent = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  return (
    <div>
      <ResetPasswordConfirmComponent uid={uid} token={token} />
    </div>
  );
};

const ResetPasswordConfirmPage = () => (
  <Suspense fallback={null}>
    <ResetPasswordConfirmContent />
  </Suspense>
);

export default ResetPasswordConfirmPage;

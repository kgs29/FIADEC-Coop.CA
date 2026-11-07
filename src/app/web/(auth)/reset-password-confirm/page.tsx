'use client'

import React from "react";
import ResetPasswordConfirmComponent from "./ResetPasswordConfirmComponent";
import { useParams } from "next/navigation";

const ResetPasswordConfirmPage = () => {
  const { uid, token } = useParams();

  return (
    <div>
      <ResetPasswordConfirmComponent uid={uid as string} token={token as string} />
    </div>
  );
};

export default ResetPasswordConfirmPage;

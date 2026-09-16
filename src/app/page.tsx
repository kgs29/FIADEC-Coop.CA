"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    redirect("/web");
  });
  return <div></div>;
};

export default Main;

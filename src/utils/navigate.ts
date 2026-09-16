"use client";

import { useRouter } from "next/navigation";

export const useNavigate = () => {
  const router = useRouter();

  return (path: string) => {
    if (!path) return;
    router.push(path);
  };
};

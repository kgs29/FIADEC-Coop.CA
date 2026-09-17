"use client";

import { useRouter } from "next/navigation";
import { generateBreadcrumbs } from "./breackcrumbs-config";

export const useNavigateBack = () => {
  const router = useRouter();

  return () => {
    const links = generateBreadcrumbs(document.location.pathname);
    if (links.length > 1) {
      router.push(links[links.length - 2].path);
    } else {
      router.push("/web");
    }
  };
};

export const useNavigateBackPortal = () => {
  const router = useRouter();

  return () => {
    const links = generateBreadcrumbs(document.location.pathname);
    if (links.length > 1) {
      router.push(links[links.length - 1].path);
    } else {
      router.push("/web/"); 
    }
  };
};

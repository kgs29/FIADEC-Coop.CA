"use client";
import React from "react";
import usePermission from "../hooks/use-permissions";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { Oops } from "@/components/dashboard/ErrorComponent";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import { PermissionInterface, PermissionKey } from "@/types/permission.type";

interface UrlGuardProps {
  permission: PermissionKey;
  children: React.ReactNode;
}

const UrlGuard: React.FC<UrlGuardProps> = ({ permission, children }) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  // Aggregate permissions from ALL groups before any conditional return (Rules of Hooks)
  const allPermissions: PermissionInterface[] = user.groups.reduce<PermissionInterface[]>(
    (acc, g) => {
      const perms = Array.isArray(g.permissions) ? g.permissions : [];
      return acc.concat(perms.filter((p): p is PermissionInterface => p != null));
    },
    []
  );

  const { hasPermission } = usePermission(allPermissions);

  // Superuser and staff bypass all permission checks
  if (user.is_superuser || user.is_staff) return <>{children}</>;

  if (!hasPermission(permission)) {
    return (
      <div className="w-full h-full flex-col justify-center items-center pt-20">
        <div className="flex justify-center items-center flex-col">
          <Image alt="unauthorized" className="aspect-square" src={IMAGES.undraw_unauthorized} width={300} />
          <Oops />
        </div>
        <p className="text-center text-muted-foreground">{t("unauthorized_page")}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default UrlGuard;

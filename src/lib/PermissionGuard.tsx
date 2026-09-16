import React from "react";
import usePermission from "../hooks/use-permissions";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { PermissionKey } from "@/types/permission.type";

interface PermissionGuardProps {
  permission: PermissionKey;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, children }) => {
  const user = useAppSelector((state) => state.auth.user);

  // Always call hooks unconditionally before any early return
  const allPermissions = user.groups.flatMap((g) => g.permissions ?? []).filter((p): p is NonNullable<typeof p> => p != null);
  const { hasPermission } = usePermission(allPermissions);

  // Superuser/staff bypass
  if (user.is_superuser || user.is_staff) return <>{children}</>;

  if (!hasPermission(permission)) return null;
  return <>{children}</>;
};

export default PermissionGuard;

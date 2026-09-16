// use-permission.tsx

import { PermissionInterface, PermissionKey } from "@/types/permission.type";


type UsePermission = (permissions: PermissionInterface[] ) => {
  hasPermission: (permissionCodename:   PermissionKey) => boolean;
};

const usePermission: UsePermission = (permissions : PermissionInterface[]) => {
  const hasPermission = (
    permissionCodename:    PermissionKey
  ): boolean => {
    const permissionCodenames = new Set(permissions.map((p) => p.codename));
    
    return permissionCodenames.has(permissionCodename);
  };

  return { hasPermission };
};

export default usePermission;

"use client";
import { IMAGES } from "@/assets/images";
import { useAppSelector } from "@/hooks/redux-toolkit";
import Image from "next/image";
import Link from "next/link";

interface SidebarLogoProps {
  isCollapsed?: boolean;
}

export function SidebarLogo({ isCollapsed = false }: SidebarLogoProps) {
  const config = useAppSelector((state: any) => state.config?.config);
  const logoUrl = config?.app_logo_url || null;
  const appName = config?.app_name || "Administration";

  if (isCollapsed) {
    return (
      <div className="h-[73px] border-b border-border flex items-center justify-center">
        <Link href="/web">
          {logoUrl ? (
            <Image src={logoUrl} width={36} height={36} alt={appName} className="object-contain w-9 h-9" unoptimized />
          ) : (
            <Image src={IMAGES.logo} width={36} height={36} alt={appName} className="object-contain" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-border flex items-center gap-3">
      <Link href="/web">
        {logoUrl ? (
          <Image src={logoUrl} width={130} height={36} alt={appName} className="object-contain max-h-9 max-w-[130px]" unoptimized />
        ) : (
          <Image src={IMAGES.logo} width={130} alt={appName} />
        )}
      </Link>
      <div className="ml-auto">
        <span className="text-sm font-bold text-primary truncate max-w-[100px]" title={appName}>
          {appName}
        </span>
      </div>
    </div>
  );
}

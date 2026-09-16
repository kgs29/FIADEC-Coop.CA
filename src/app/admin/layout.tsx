"use client";
import CustumBreadcrumb from "@/components/CustumBreadcrumb";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/dashboard/UserMenu";
import { useAppSelector } from "@/hooks/redux-toolkit";

import { redirect } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useAuthReady } from "../providers";
const SKELETON_ROWS = ["a", "b", "c", "d", "e", "f"];

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse bg-background">
      <div className="hidden md:block w-64 bg-card border-r border-border">
        <div className="p-4 space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="space-y-2">
            {SKELETON_ROWS.map((id) => (
              <div key={id} className="h-8 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <header className="sticky top-0 flex items-center justify-end bg-card p-3 border-b border-border">
          <div className="h-9 w-9 bg-muted rounded-full" />
        </header>
        <div className="p-4 space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted/50 rounded-lg" />
          <div className="h-40 bg-muted/50 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthReady = useAuthReady();
  const user = useAppSelector((state) => state.auth);

  // Auth pas encore hydraté → skeleton
  if (!isAuthReady) {
    return <DashboardSkeleton />;
  }

  // Auth hydraté mais pas connecté → login
  if (!user.isLoggedIn) {
    redirect("/web/login");
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />

      <main className="aside-main">
        <header className="sticky z-50 top-0 flex items-center justify-end gap-1 bg-card border-b border-border px-4 py-2">
          <ThemeToggle />
          <UserMenu />
        </header>
        <CustumBreadcrumb />
        {children}
      </main>
    </div>
  );
}

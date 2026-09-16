"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar/Sidebar";
import UserMenu from "./UserMenu";
import { t } from "i18next";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          aria-label={t("menu")}
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <Sidebar isMobile open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-end bg-card border-b border-border px-4 py-2.5">
          <UserMenu />
        </header>
      </main>
    </div>
  );
}

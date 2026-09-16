"use client";
import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import DataSection from "./datasection";
import LinkSection from "./linksection";
import RolesStats from "./RolesStats";
import { Archive } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const RolesPage = () => {
  const { t } = useTranslation();
  const [archived, setArchived] = useState(false);

  const filterButtons = (
    <div className="flex gap-2">
      <button
        onClick={() => setArchived(false)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${archived ? "text-gray-500 hover:bg-gray-100 dark:hover:bg-muted" : "bg-primary text-white"}`}
      >
        {t("active")}
      </button>
      <button
        onClick={() => setArchived(true)}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${archived ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-muted"}`}
      >
        <Archive className="h-3 w-3" />
        {t("archived")}
      </button>
    </div>
  );

  return (
    <UrlGuard permission="view_group">
      <div>
        <LinkSection />
        <StatsTabLayout
          statsPanel={<RolesStats />}
          headerRight={filterButtons}
        >
          <DataSection archived={archived} />
        </StatsTabLayout>
      </div>
    </UrlGuard>
  );
};

export default RolesPage;

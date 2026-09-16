"use client";
import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import LogsContentPage from "./logs-content-page";
import LogsStats from "./LogsStats";
import { ScrollText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LogsPage = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState<number | null>(null);

  return (
    <UrlGuard permission="view_activitylog">
      <StatsTabLayout
        statsPanel={<LogsStats />}
        aboveSearch={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ScrollText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t("logs")}</h2>
            {count !== null && (
              <span className="ml-auto text-sm text-muted-foreground">
                {count} {t("entries")}
              </span>
            )}
          </div>
        }
      >
        <LogsContentPage onCountUpdate={setCount} />
      </StatsTabLayout>
    </UrlGuard>
  );
};

export default LogsPage;

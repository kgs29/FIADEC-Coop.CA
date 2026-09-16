"use client";
import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import DevicesContentPage from "./devices-content-page";
import DevicesStats from "./DevicesStats";
import { Monitor } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DevicesPage = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState<number | null>(null);

  return (
    <UrlGuard permission="add_logentry">
      <StatsTabLayout
        statsPanel={<DevicesStats />}
        aboveSearch={
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl font-bold">{t("Dashboard.sidebar.devices") ?? "Appareils connectés"}</h1>
            {count !== null && (
              <span className="ml-auto text-sm text-muted-foreground">
                {count} {t("sessions") ?? "session(s)"}
              </span>
            )}
          </div>
        }
      >
        <DevicesContentPage onCountUpdate={setCount} />
      </StatsTabLayout>
    </UrlGuard>
  );
};

export default DevicesPage;

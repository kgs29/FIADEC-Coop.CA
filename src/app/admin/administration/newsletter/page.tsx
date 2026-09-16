"use client";
import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import NewsletterContentPage from "./newsletter-content-page";
import NewsletterStats from "./NewsletterStats";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const NewsletterPage = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<{ total: number; active: number } | null>(null);

  return (
    <UrlGuard permission="view_user">
      <StatsTabLayout
        statsPanel={<NewsletterStats />}
        aboveSearch={
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t("Dashboard.sidebar.newsletter")}</h2>
            {info && (
              <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                <span className="px-3 py-1 bg-muted rounded-full">
                  {t("active")} : <strong className="text-emerald-600">{info.active}</strong>
                </span>
                <span className="px-3 py-1 bg-muted rounded-full">
                  Total : <strong>{info.total}</strong>
                </span>
              </div>
            )}
          </div>
        }
      >
        <NewsletterContentPage onCountUpdate={setInfo} />
      </StatsTabLayout>
    </UrlGuard>
  );
};

export default NewsletterPage;

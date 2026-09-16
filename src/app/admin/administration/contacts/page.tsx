"use client";
import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import ContactsContentPage from "./contacts-content-page";
import ContactsStats from "./ContactsStats";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ContactsPage = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<{ total: number; newCount: number } | null>(null);

  return (
    <UrlGuard permission="view_user">
      <StatsTabLayout
        statsPanel={<ContactsStats />}
        aboveSearch={
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{t("contact_messages")}</h2>
            {info && (
              <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
                {info.newCount > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {info.newCount} {t("contact_status_new")}
                  </span>
                )}
                <span className="px-3 py-1 bg-muted rounded-full">
                  Total : <strong>{info.total}</strong>
                </span>
              </div>
            )}
          </div>
        }
      >
        <ContactsContentPage onCountUpdate={setInfo} />
      </StatsTabLayout>
    </UrlGuard>
  );
};

export default ContactsPage;

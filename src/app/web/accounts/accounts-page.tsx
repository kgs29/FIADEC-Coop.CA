"use client";

import Link from "next/link";
import { Wallet, PiggyBank, Clock3, CheckCircle2, BadgeCheck, MapPinned, Camera, Banknote, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";

const accountTypes = [
  { key: "type_1", Icon: Wallet, featured: false },
  { key: "type_2", Icon: PiggyBank, featured: true },
  { key: "type_3", Icon: Clock3, featured: false },
];

const requirements = [
  { key: "req_1", Icon: BadgeCheck },
  { key: "req_2", Icon: MapPinned },
  { key: "req_3", Icon: Camera },
  { key: "req_4", Icon: Banknote },
];

export default function AccountsPage() {
  const { t } = useTranslation();

  return (
    <main className="font-inter">
      {/* Hero */}
      <section className="relative bg-muted py-16 md:py-24 border-b border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("web_accounts.hero_title")}
            </h1>
            <p className="font-inter text-lg text-muted-foreground mb-8 max-w-xl">{t("web_accounts.hero_subtitle")}</p>
            <a
              href="#open-account"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-sm"
            >
              {t("web_accounts.hero_cta")}
            </a>
          </div>
          <div className="md:w-1/2 relative h-[280px] md:h-[360px] w-full rounded-2xl overflow-hidden shadow-sm border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/web-site/hero3.jpg" alt={t("web_accounts.hero_title")} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Account types */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">{t("web_accounts.types_title")}</h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">{t("web_accounts.types_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {accountTypes.map(({ key, Icon, featured }) => (
              <div
                key={key}
                className={`bg-card border rounded-xl p-8 flex flex-col relative transition-shadow duration-300 ${
                  featured
                    ? "border-primary/40 shadow-[0px_12px_32px_rgba(0,0,0,0.08)] md:-translate-y-4"
                    : "border-border hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)]"
                }`}
              >
                {featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    {t(`web_accounts.${key}_badge`)}
                  </div>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                    featured ? "bg-accent text-accent-foreground" : "bg-muted text-primary"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-foreground mb-2">{t(`web_accounts.${key}_title`)}</h3>
                <p className="font-inter text-muted-foreground mb-6 flex-grow">{t(`web_accounts.${key}_desc`)}</p>
                <ul className="space-y-3 mb-8">
                  {["feat_1", "feat_2", "feat_3"].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-foreground font-inter text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {t(`web_accounts.${key}_${f}`)}
                    </li>
                  ))}
                </ul>
                <a
                  href="#open-account"
                  className={`block text-center font-bold px-6 py-3 rounded-full transition-colors w-full ${
                    featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : "border-2 border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  {t("web_accounts.type_cta")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 md:py-20 bg-muted" id="open-account">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="md:w-1/3">
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">
                {t("web_accounts.eligibility_title")}
              </h2>
              <p className="font-inter text-muted-foreground mb-8">{t("web_accounts.eligibility_text")}</p>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-poppins font-bold text-foreground mb-2">{t("web_accounts.help_title")}</h4>
                <p className="font-inter text-muted-foreground mb-4 text-sm">{t("web_accounts.help_text")}</p>
                <Link href="/web/contact-us" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                  <Headset className="w-5 h-5" />
                  {t("web_accounts.help_cta")}
                </Link>
              </div>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {requirements.map(({ key, Icon }) => (
                <div key={key} className="bg-card p-6 rounded-lg border border-border flex items-start gap-4">
                  <Icon className="w-6 h-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-poppins font-bold text-foreground mb-1">{t(`web_accounts.${key}_title`)}</h4>
                    <p className="font-inter text-muted-foreground text-sm">{t(`web_accounts.${key}_desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/web/contact-us"
              className="inline-block bg-primary text-primary-foreground font-bold px-10 py-5 rounded-full hover:bg-primary/90 transition-all shadow-sm"
            >
              {t("web_accounts.large_cta_button")}
            </Link>
            <p className="mt-4 text-muted-foreground text-xs uppercase tracking-wide">{t("web_accounts.large_cta_note")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

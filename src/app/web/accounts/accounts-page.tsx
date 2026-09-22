"use client";

import Link from "next/link";
import {
  Wallet,
  PiggyBank,
  Building2,
  CheckCircle2,
  BadgeCheck,
  MapPinned,
  Camera,
  Banknote,
  Headset,
  FileText,
  Briefcase,
  Tractor,
  Store,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const accountTypes = [
  { key: "courant_physique", Icon: Wallet, featured: false, color: "emerald" },
  { key: "courant_association_entreprise", Icon: Building2, featured: true, color: "primary" },
  { key: "epargne_physique", Icon: PiggyBank, featured: false, color: "amber" },
  { key: "epargne_entreprise", Icon: CreditCard, featured: false, color: "purple" },
];

const targets = [
  { key: "entrepreneurs", Icon: Briefcase },
  { key: "sauveteurs", Icon: ShieldCheck },
  { key: "bayam_sellam", Icon: Store },
  { key: "pme", Icon: Building2 },
  { key: "commerçants", Icon: CreditCard },
  { key: "agriculteurs", Icon: Tractor },
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
          <div className="md:w-1/2 relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-border bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/web-site/compte-courant.jpg" alt={t("web_accounts.hero_title")} className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Cibles */}
      <section className="py-14 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-3">{t("web_accounts.targets_title")}</h2>
            <p className="font-inter text-muted-foreground max-w-xl mx-auto">{t("web_accounts.targets_subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {targets.map(({ key, Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-inter text-sm font-medium text-foreground">{t(`web_accounts.target_${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account types */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">{t("web_accounts.types_title")}</h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">{t("web_accounts.types_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {accountTypes.map(({ key, Icon, featured }) => (
              <div
                key={key}
                className={`bg-card border rounded-xl p-8 flex flex-col relative transition-all duration-300 ${
                  featured
                    ? "border-primary/50 shadow-[0px_12px_32px_rgba(0,0,0,0.12)] md:-translate-y-2"
                    : "border-border hover:shadow-[0px_4px_20px_rgba(0,0,0,0.07)] hover:-translate-y-1"
                }`}
              >
                {featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    {t(`web_accounts.${key}_badge`)}
                  </div>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                    featured ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-foreground mb-2">{t(`web_accounts.${key}_title`)}</h3>
                <p className="font-inter text-muted-foreground mb-5 flex-grow text-sm">{t(`web_accounts.${key}_desc`)}</p>

                {/* Frais d'ouverture */}
                <div className="bg-muted/60 rounded-lg p-3 mb-5 border border-border">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{t("web_accounts.opening_fee_label")}</p>
                  <p className="font-poppins font-bold text-primary text-base">{t(`web_accounts.${key}_frais`)}</p>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {["doc_1", "doc_2", "doc_3", "doc_4", "doc_5", "doc_6", "doc_7", "doc_8", "doc_9"].map((d) => {
                    const val = t(`web_accounts.${key}_${d}`, { defaultValue: "" });
                    if (!val) return null;
                    return (
                      <li key={d} className="flex items-start gap-3 text-foreground font-inter text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {val}
                      </li>
                    );
                  })}
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

      {/* Conditions générales d'adhésion */}
      <section className="py-16 md:py-20 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">{t("web_accounts.adhesion_title")}</h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">{t("web_accounts.adhesion_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["frais_adhesion","valeur_part","min_parts","fonds_solidarite","total_adhesion"].map((key) => (
              <div key={key} className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-foreground text-sm mb-1">{t(`web_accounts.adhesion_${key}_label`)}</h4>
                  <p className="font-inter text-primary font-semibold">{t(`web_accounts.adhesion_${key}_value`)}</p>
                </div>
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
              {[
                { key: "req_1", Icon: BadgeCheck },
                { key: "req_2", Icon: MapPinned },
                { key: "req_3", Icon: Camera },
                { key: "req_4", Icon: Banknote },
                { key: "req_5", Icon: FileText },
              ].map(({ key, Icon }) => (
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

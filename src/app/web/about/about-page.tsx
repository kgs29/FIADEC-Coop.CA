"use client";

import Link from "next/link";
import { Flag, Eye, Handshake, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const branches = ["branch_yaounde", "branch_fongo_tongo", "branch_douala"];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="font-inter">
      {/* Hero */}
      <section className="relative bg-muted py-16 md:py-28 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-poppins text-3xl md:text-5xl font-bold text-primary mb-6">{t("web_about.hero_title")}</h1>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">{t("web_about.hero_subtitle")}</p>
        </div>
      </section>

      {/* Présentation institutionnelle */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground">
              {t("web_about.institutional_title")}
            </h2>
            <div className="w-16 h-1 bg-primary" />
            <p className="font-inter text-muted-foreground leading-relaxed">{t("web_about.institutional_text_1")}</p>
            <p className="font-inter text-muted-foreground leading-relaxed">{t("web_about.institutional_text_2")}</p>

            {/* Badge agrément */}
            <div className="pt-2 space-y-3">
              <div className="flex items-start gap-4 bg-card p-4 border border-border rounded-lg">
                <div className="bg-accent text-accent-foreground p-3 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-foreground mb-1">{t("web_about.badge_title")}</h4>
                  <p className="font-inter text-sm text-muted-foreground">{t("web_about.badge_text")}</p>
                </div>
              </div>

              {/* Détails légaux */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                <h4 className="font-poppins font-bold text-foreground text-sm uppercase tracking-wide mb-2">
                  {t("web_about.license_title")}
                </h4>
                {[
                  "license_cobac",
                  "license_minfi",
                  "license_category",
                  "license_siege",
                  "license_bp",
                ].map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-inter text-sm text-foreground">{t(`web_about.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative h-[320px] lg:h-[420px] rounded-xl overflow-hidden border border-border shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/web-site/about-hero.jpg" alt={t("web_about.institutional_title")} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Nos agences */}
      <section className="py-16 md:py-24 bg-muted border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground">
              {t("web_about.branches_title")}
            </h2>
            <p className="font-inter text-muted-foreground mt-4 max-w-2xl mx-auto">{t("web_about.branches_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {branches.map((key) => (
              <div
                key={key}
                className="group relative w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-green-600/70 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h4 className="font-poppins font-bold text-foreground">{t(`web_about.${key}_title`)}</h4>
                  <p className="font-inter text-sm text-muted-foreground transition-colors duration-300 group-hover:text-white">
                    {t(`web_about.${key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Valeurs */}
      <section className="bg-muted py-16 md:py-24 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground">
              {t("web_about.foundations_title")}
            </h2>
            <p className="font-inter text-muted-foreground mt-4">{t("web_about.foundations_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <div className="group relative w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-green-600/70 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                  <Flag className="h-6 w-6" />
                </div>
                <h3 className="mb-4 font-poppins text-xl font-bold text-foreground">{t("web_about.mission_title")}</h3>
                <p className="font-inter text-muted-foreground transition-colors duration-300 group-hover:text-white">
                  {t("web_about.mission_text")}
                </p>
              </div>
            </div>
            <div className="group relative w-full max-w-[320px] overflow-hidden rounded-xl bg-primary p-8 text-primary-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg md:translate-y-4">
              <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 via-green-500/20 to-emerald-700/60 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mb-4 font-poppins text-xl font-bold">{t("web_about.vision_title")}</h3>
                <p className="font-inter opacity-90">{t("web_about.vision_text")}</p>
              </div>
            </div>
            <div className="group relative w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-green-600/70 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                  <Handshake className="h-6 w-6" />
                </div>
                <h3 className="mb-4 font-poppins text-xl font-bold text-foreground">{t("web_about.values_title")}</h3>
                <ul className="space-y-3 font-inter text-muted-foreground transition-colors duration-300 group-hover:text-white">
                  {["value_1", "value_2", "value_3", "value_4"].map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {t(`web_about.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6">
        <div className="rounded-xl overflow-hidden border border-border shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/web-site/about-team.jpg"
            alt={t("web_about.team_title")}
            className="w-full h-[280px] md:h-[380px] object-cover"
          />
        </div>
        <div className="text-center max-w-2xl mx-auto mt-8">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t("web_about.team_title")}
          </h2>
          <p className="font-inter text-muted-foreground leading-relaxed">{t("web_about.team_text")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-background text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-6">{t("web_about.cta_title")}</h2>
          <p className="font-inter text-lg text-muted-foreground mb-8">{t("web_about.cta_text")}</p>
          <Link
            href="/web/contact-us"
            className="inline-block bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            {t("web_about.cta_button")}
          </Link>
        </div>
      </section>
    </main>
  );
}

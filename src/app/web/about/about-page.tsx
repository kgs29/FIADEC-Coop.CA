"use client";

import Link from "next/link";
import { Flag, Eye, Handshake, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const branches = ["branch_siege", "branch_dschang", "branch_yaounde", "branch_douala"];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((key) => (
              <div key={key} className="bg-card p-6 border border-border rounded-xl shadow-sm flex flex-col items-start gap-3">
                <div className="w-11 h-11 bg-accent text-accent-foreground flex items-center justify-center rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-poppins font-bold text-foreground">{t(`web_about.${key}_title`)}</h4>
                <p className="font-inter text-muted-foreground text-sm">{t(`web_about.${key}_desc`)}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 border border-border rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-accent text-accent-foreground flex items-center justify-center rounded-lg mb-6">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="font-poppins text-xl font-bold text-foreground mb-4">{t("web_about.mission_title")}</h3>
              <p className="font-inter text-muted-foreground">{t("web_about.mission_text")}</p>
            </div>
            <div className="bg-primary text-primary-foreground p-8 rounded-xl shadow-sm md:translate-y-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary-foreground/15 text-primary-foreground flex items-center justify-center rounded-lg mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-poppins text-xl font-bold mb-4">{t("web_about.vision_title")}</h3>
              <p className="font-inter opacity-90">{t("web_about.vision_text")}</p>
            </div>
            <div className="bg-card p-8 border border-border rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-accent text-accent-foreground flex items-center justify-center rounded-lg mb-6">
                <Handshake className="w-6 h-6" />
              </div>
              <h3 className="font-poppins text-xl font-bold text-foreground mb-4">{t("web_about.values_title")}</h3>
              <ul className="space-y-3 font-inter text-muted-foreground">
                {["value_1", "value_2", "value_3", "value_4"].map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {t(`web_about.${key}`)}
                  </li>
                ))}
              </ul>
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

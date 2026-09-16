"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  Landmark,
  PiggyBank,
  Quote,
  Star,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const stats = [
  { key: "stat_1", Icon: Users },
  { key: "stat_2", Icon: Landmark },
  { key: "stat_3", Icon: Award },
];

const products = [
  { key: "product_1", Icon: Wallet },
  { key: "product_2", Icon: PiggyBank },
  { key: "product_3", Icon: Store },
];

const HomePage = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      initials: "AB",
      name: "Amina B.",
      role: t("web_home.testimonial_1_role"),
      text: t("web_home.testimonial_1_text"),
    },
    {
      initials: "JT",
      name: "Jean T.",
      role: t("web_home.testimonial_2_role"),
      text: t("web_home.testimonial_2_text"),
    },
    {
      initials: "MN",
      name: "Marie N.",
      role: t("web_home.testimonial_3_role"),
      text: t("web_home.testimonial_3_text"),
    },
  ];

  return (
    <div className="flex flex-col w-full font-inter">
      {/* Hero */}
      <section className="relative bg-muted overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t("web_home.hero_title_before")}{" "}
              <span className="text-primary">{t("web_home.hero_title_highlight")}</span>{" "}
              {t("web_home.hero_title_after")}
            </h1>
            <p className="font-inter text-lg text-muted-foreground max-w-xl">
              {t("web_home.hero_subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/web/services"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all font-bold shadow-sm"
              >
                {t("web_home.hero_cta_primary")}
              </Link>
              <Link
                href="/web/contact-us"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/10 transition-all font-bold"
              >
                {t("web_home.hero_cta_secondary")}
              </Link>
            </div>
          </div>
          <div className="relative h-[320px] lg:h-[460px] rounded-xl overflow-hidden shadow-sm border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/web-site/hero5.jpg"
              alt={t("web_home.hero_title_highlight")}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Key stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(({ key, Icon }) => (
            <div
              key={key}
              className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow"
            >
              <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-poppins text-3xl font-bold text-foreground mb-2">{t(`web_home.${key}_value`)}</h3>
              <p className="font-inter text-sm text-muted-foreground uppercase tracking-wider">
                {t(`web_home.${key}_label`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 rounded-xl overflow-hidden h-[300px] border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/web-site/equipe.jpg" alt={t("web_home.mission_title")} className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-6">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground">
              {t("web_home.mission_title")}
            </h2>
            <p className="font-inter text-muted-foreground leading-relaxed">{t("web_home.mission_text")}</p>
            <div>
              <Link
                href="/web/about"
                className="text-primary font-bold hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-2"
              >
                {t("web_home.mission_cta")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products preview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t("web_home.products_title")}
            </h2>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">{t("web_home.products_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(({ key, Icon }) => (
              <div
                key={key}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all p-6"
              >
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-foreground mb-3">{t(`web_home.${key}_title`)}</h3>
                <p className="font-inter text-muted-foreground mb-6">{t(`web_home.${key}_desc`)}</p>
                <Link href="/web/services" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                  {t("web_home.product_cta")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 md:py-24 bg-muted text-center overflow-hidden">
        <div className="relative container mx-auto px-6">
          <span className="text-primary font-poppins font-extrabold uppercase tracking-wide text-[17px]">
            {t("web_home.testimonials_kicker")}
          </span>
          <p className="mt-2 text-muted-foreground text-lg font-inter">
            {t("web_home.testimonials_subtitle_prefix")} <em>{t("web_home.testimonials_subtitle_emphasis")}</em>
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="relative bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[380px] transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center text-primary-foreground font-extrabold text-2xl mb-4 border-4 border-background">
                    {item.initials}
                  </div>
                  <div className="flex justify-center gap-1 text-yellow-400 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={`${item.name}-star-${i}`} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="mt-2 text-foreground leading-relaxed text-center italic">
                    <Quote className="inline-block w-5 h-5 text-primary/60 align-top mr-1" />
                    <span className="not-italic text-justify block">&quot;{item.text}&quot;</span>
                  </p>
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <div className="font-bold text-primary text-lg">{item.name}</div>
                  <div className="text-muted-foreground text-sm font-medium">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-8">
          <h2 className="font-poppins text-2xl md:text-4xl font-bold">{t("web_home.cta_title")}</h2>
          <p className="font-inter text-lg text-primary-foreground/90">{t("web_home.cta_text")}</p>
          <Link
            href="/web/contact-us"
            className="bg-card text-primary px-8 py-4 rounded-lg hover:bg-background transition-all font-bold shadow-sm"
          >
            {t("web_home.cta_button")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

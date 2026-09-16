"use client";

import { Cpu, GraduationCap, Landmark, Lightbulb, Network, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const categoryIcons = [Cpu, GraduationCap, Landmark];
const benefitIcons = [Lightbulb, Network, Users, TrendingUp];

export default function PartnersPage() {
  const { t } = useTranslation();

  const categories = categoryIcons.map((Icon, index) => ({
    Icon,
    title: t(`web_partners.category_${index + 1}_title`),
    desc: t(`web_partners.category_${index + 1}_desc`),
  }));

  const benefits = benefitIcons.map((Icon, index) => ({
    Icon,
    title: t(`web_partners.benefit_${index + 1}_title`),
    desc: t(`web_partners.benefit_${index + 1}_desc`),
  }));

  return (
    <main className="font-inter">
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            {t("web_partners.hero_badge")}
          </span>
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">{t("web_partners.hero_title")}</h1>
          <p className="text-lg md:text-xl opacity-90">{t("web_partners.hero_subtitle")}</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t("web_partners.intro_title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">{t("web_partners.intro_text")}</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-2xl flex items-center justify-center mb-5">
                <category.Icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm">{category.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            {t("web_partners.benefits_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <benefit.Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-primary text-white p-8 md:p-12 text-center shadow-2xl">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3">{t("web_partners.cta_title")}</h2>
          <p className="text-lg opacity-90 mb-8">{t("web_partners.cta_text")}</p>
          <a
            href="/web/contact-us"
            className="relative z-10 inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition"
          >
            {t("web_partners.cta_button")}
          </a>
        </div>
      </section>
    </main>
  );
}

"use client";

import { EMAIL_ADDRESS } from "@/constants/env";
import { ArrowRight, Clock4, GraduationCap, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const benefitIcons = [Users, GraduationCap, Sparkles, Clock4];
const processSteps = [1, 2, 3, 4, 5];

export default function CareersPage() {
  const { t } = useTranslation();

  const benefits = benefitIcons.map((Icon, index) => ({
    Icon,
    title: t(`web_careers.benefit_${index + 1}_title`),
    desc: t(`web_careers.benefit_${index + 1}_desc`),
  }));

  const process = processSteps.map((step) => ({
    step,
    title: t(`web_careers.process_${step}_title`),
    desc: t(`web_careers.process_${step}_desc`),
  }));

  return (
    <main className="font-inter">
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            {t("web_careers.hero_badge")}
          </span>
          <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">{t("web_careers.hero_title")}</h1>
          <p className="text-lg md:text-xl opacity-90">{t("web_careers.hero_subtitle")}</p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            {t("web_careers.benefits_title")}
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

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
            {t("web_careers.process_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gray-200 mx-16" />
            {process.map((item) => (
              <div key={item.step} className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-10">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {t("web_careers.open_positions_title")}
          </h2>
          <p className="text-gray-600 leading-relaxed">{t("web_careers.open_positions_text")}</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-primary text-white p-8 md:p-12 text-center shadow-2xl">
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3">{t("web_careers.cta_title")}</h2>
          <p className="text-lg opacity-90 mb-8">{t("web_careers.cta_text")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a
              href={`mailto:${EMAIL_ADDRESS}?subject=Candidature%20spontanee`}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
            >
              {t("web_careers.cta_button_apply")} <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/web/about"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-primary transition"
            >
              {t("web_careers.cta_button_about")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

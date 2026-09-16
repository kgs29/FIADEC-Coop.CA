"use client";

import { EMAIL_ADDRESS } from "@/constants/env";
import { ChevronDown, Mail, MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type CategoryId = "all" | "general" | "accounts" | "credits" | "support" | "security";

const QUESTION_CATEGORIES: Exclude<CategoryId, "all">[] = [
  "general",
  "general",
  "general",
  "accounts",
  "accounts",
  "accounts",
  "credits",
  "credits",
  "credits",
  "support",
  "support",
  "security",
  "security",
];

export default function FaqPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const categories: { id: CategoryId; label: string }[] = [
    { id: "all", label: t("web_faq.category_all") },
    { id: "general", label: t("web_faq.category_general") },
    { id: "accounts", label: t("web_faq.category_accounts") },
    { id: "credits", label: t("web_faq.category_credits") },
    { id: "support", label: t("web_faq.category_support") },
    { id: "security", label: t("web_faq.category_security") },
  ];

  const questions = useMemo(
    () =>
      QUESTION_CATEGORIES.map((category, index) => {
        const id = index + 1;
        const rawTags = t(`web_faq.q${id}_tags`, { returnObjects: true });
        return {
          id,
          category,
          question: t(`web_faq.q${id}_question`),
          answer: t(`web_faq.q${id}_answer`),
          tags: Array.isArray(rawTags) ? (rawTags as string[]) : [],
        };
      }),
    [t],
  );

  const filtered = questions.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      item.question.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term) ||
      item.tags.some((tag) => tag.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="font-inter">
      <section className="relative bg-muted border-b border-border py-16 md:py-20 px-6 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-poppins text-3xl md:text-5xl font-bold text-foreground mb-4">{t("web_faq.hero_title")}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">{t("web_faq.hero_subtitle")}</p>
        </div>
      </section>

      <section className="py-10 px-6 bg-background">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("web_faq.search_placeholder")}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground border border-border hover:border-primary/40"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                type="button"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
                aria-expanded={openId === item.id}
              >
                <h3 className="font-poppins text-base md:text-lg font-semibold text-foreground">{item.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openId === item.id && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <h3 className="font-poppins text-xl font-bold text-foreground mb-2">{t("web_faq.no_results_title")}</h3>
              <p className="text-muted-foreground mb-6">{t("web_faq.no_results_message")}</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition"
              >
                {t("web_faq.no_results_reset")}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 text-center shadow-sm">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3">{t("web_faq.contact_title")}</h2>
          <p className="text-lg opacity-90 mb-8">{t("web_faq.contact_subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="inline-flex items-center justify-center gap-2 bg-card text-primary font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-background transition"
            >
              <Mail className="w-4 h-4" />
              {t("web_faq.contact_email_cta")}
            </a>
            <a
              href="/web/contact-us"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary-foreground/10 transition"
            >
              <MessageCircle className="w-4 h-4" />
              {t("web_faq.contact_form_cta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

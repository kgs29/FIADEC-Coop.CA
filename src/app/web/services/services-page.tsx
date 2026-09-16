"use client";

import { CheckCircle2, Wallet, Clock3, Banknote, Store, Sprout, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const ALL = "all";

const products = [
  { key: "product_1", category: "accounts", Icon: Wallet, href: "/web/accounts" },
  { key: "product_2", category: "savings", Icon: Clock3, href: "/web/accounts" },
  { key: "product_3", category: "credits", Icon: Banknote, href: "/web/contact-us" },
  { key: "product_4", category: "sme", Icon: Store, href: "/web/contact-us" },
  { key: "product_5", category: "agriculture", Icon: Sprout, href: "/web/contact-us" },
  { key: "product_6", category: "savings", Icon: GraduationCap, href: "/web/accounts" },
] as const;

const filters = [
  { key: ALL, label: "filter_all" },
  { key: "accounts", label: "filter_accounts" },
  { key: "savings", label: "filter_savings" },
  { key: "credits", label: "filter_credits" },
  { key: "sme", label: "filter_sme" },
  { key: "agriculture", label: "filter_agriculture" },
] as const;

export default function ServicesPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  const visibleProducts = useMemo(
    () => (activeFilter === ALL ? products : products.filter((p) => p.category === activeFilter)),
    [activeFilter],
  );

  return (
    <main className="font-inter">
      {/* Hero */}
      <section className="bg-muted py-16 md:py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-poppins text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t("web_services.hero_title")}
          </h1>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("web_services.hero_subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-full border font-inter text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {t(`web_services.${filter.label}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProducts.map(({ key, Icon, href }) => (
              <article
                key={key}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow flex flex-col h-full"
              >
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-foreground mb-3">{t(`web_services.${key}_title`)}</h3>
                <p className="font-inter text-muted-foreground mb-6 flex-grow">{t(`web_services.${key}_desc`)}</p>
                <div className="border-t border-border pt-4 mb-6">
                  <ul className="space-y-2">
                    {["feat_1", "feat_2"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-foreground text-xs font-inter">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {t(`web_services.${key}_${f}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={href}
                  className="w-full text-center py-3 text-primary border-2 border-primary rounded-lg font-inter text-sm font-bold hover:bg-accent transition-colors mt-auto"
                >
                  {t("web_services.product_cta")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 px-6 text-center bg-primary text-primary-foreground">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-poppins text-2xl md:text-4xl font-bold mb-6">{t("web_services.cta_title")}</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 font-inter">{t("web_services.cta_text")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/web/contact-us"
              className="px-8 py-4 bg-card text-primary font-bold rounded-full shadow-lg hover:bg-background transition-all duration-300"
            >
              {t("web_services.cta_button_consultation")}
            </Link>
            <Link
              href="/web/realisations"
              className="px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-bold rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
            >
              {t("web_services.cta_button_realisations")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

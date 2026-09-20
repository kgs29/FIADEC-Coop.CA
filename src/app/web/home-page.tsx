"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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

const heroSlides = [
  { key: "hero_slide_1", image: "/web-site/hero-fiadec.png" },
  { key: "hero_slide_2", image: "/web-site/slide-credit.jpg" },
  { key: "hero_slide_3", image: "/web-site/gerez_compte_quotidien.png" },
  { key: "hero_slide_4", image: "/web-site/PME.jpg" },
];

const HomePage = () => {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplayPaused = useRef(false);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (!autoplayPaused.current) api.scrollNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [api]);

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
      {/* Hero Carousel */}
      <section
        className="relative overflow-hidden"
        onMouseEnter={() => (autoplayPaused.current = true)}
        onMouseLeave={() => (autoplayPaused.current = false)}
      >
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
          <CarouselContent className="ml-0">
            {heroSlides.map(({ key, image }, index) => (
              <CarouselItem key={key} className="pl-0">
                <div className="relative h-[520px] md:h-[620px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={t(`web_home.${key}_title`)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                  <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-20 md:pb-24">
                    <div className="max-w-xl">
                      <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                        {t(`web_home.${key}_title`)}
                      </h1>
                      <p className="font-inter text-base md:text-lg text-white/90 max-w-lg mb-8">
                        {t(`web_home.${key}_text`)}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href="/web/services"
                          className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all font-bold shadow-sm"
                        >
                          {t("web_home.hero_cta_primary")}
                        </Link>
                        <Link
                          href="/web/contact-us"
                          className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all font-bold"
                        >
                          {t("web_home.hero_cta_secondary")}
                        </Link>
                      </div>
                    </div>
                  </div>
                  <span className="sr-only">
                    {index + 1} / {heroSlides.length}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Slide indicators */}
        <div className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map(({ key }, index) => (
            <button
              key={key}
              type="button"
              aria-label={`${t("web_home.hero_slide_indicator")} ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                current === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
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
            <img src="/web-site/mission-vision.jpg" alt={t("web_home.mission_title")} className="w-full h-full object-cover" />
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

"use client";

import { useGetProjectCategoriesQuery, useGetProjectsQuery } from "@/store/apis/core/project.api";
import { Project } from "@/types/project.types";
import { Landmark, Sprout, HandCoins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const LOCALE_FR = "fr-FR";
const ALL_CATEGORIES = "all";

function RealisationCard({ project }: Readonly<{ project: Project }>) {
  const { t } = useTranslation();

  const buyParams = new URLSearchParams({
    amount: project.price ?? "0",
    description: `Financement : ${project.title}`,
    project_id: project.id,
  });

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300">
      <Link href={`/web/projects/${project.slug}`} className="block">
        <div className="relative overflow-hidden h-56 bg-muted">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Landmark className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {project.category_name && (
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-md border border-border text-xs font-semibold text-foreground">
              {project.category_name}
            </div>
          )}
        </div>
        <div className="p-6 flex-1">
          <h3 className="font-poppins text-lg font-bold text-foreground mb-2 line-clamp-2">{project.title}</h3>
          {project.excerpt && <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{project.excerpt}</p>}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{project.author_name}</span>
            {project.published_at && (
              <span>
                {new Date(project.published_at).toLocaleDateString(LOCALE_FR, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </Link>

      {project.is_purchasable && project.price && (
        <div className="px-6 pb-6">
          <Link
            href={`/web/paiement?${buyParams.toString()}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <HandCoins className="h-4 w-4" />
            {t("web_realisations.support_project")}
          </Link>
        </div>
      )}
    </article>
  );
}

function RealisationCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-56 bg-muted" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export default function RealisationsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);

  const { data: categoriesData } = useGetProjectCategoriesQuery("page=0&size=50&is_active=true");

  const projectsQuery = useMemo(() => {
    const params = new URLSearchParams({
      page: "0",
      size: "12",
      status: "published",
      ordering: "-published_at",
    });
    if (activeCategory !== ALL_CATEGORIES) params.set("category", activeCategory);
    return params.toString();
  }, [activeCategory]);

  const { data, isFetching } = useGetProjectsQuery(projectsQuery);

  const filters = useMemo(
    () => [
      { key: ALL_CATEGORIES, label: t("web_realisations.filter_all") },
      ...((categoriesData?.results ?? []).map((cat) => ({ key: cat.id, label: cat.name }))),
    ],
    [categoriesData, t],
  );

  const projectsCount = data?.count ?? 0;
  const categoriesCount = categoriesData?.count ?? 0;

  return (
    <main className="min-h-screen bg-background font-inter">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="text-primary font-poppins font-bold uppercase tracking-widest text-sm">
            {t("web_realisations.hero_eyebrow")}
          </span>
          <h1 className="font-poppins text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            {t("web_realisations.hero_title")}
          </h1>
          <p className="font-inter text-lg text-muted-foreground mb-10 leading-relaxed">
            {t("web_realisations.hero_subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-muted border border-border px-6 py-4 rounded-xl flex items-center gap-3">
              <HandCoins className="text-primary w-8 h-8" />
              <div>
                <div className="font-poppins text-2xl font-bold text-foreground">{projectsCount}+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("web_realisations.stat_projects_label")}
                </div>
              </div>
            </div>
            <div className="bg-muted border border-border px-6 py-4 rounded-xl flex items-center gap-3">
              <Sprout className="text-primary w-8 h-8" />
              <div>
                <div className="font-poppins text-2xl font-bold text-foreground">{categoriesCount}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("web_realisations.stat_categories_label")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres + projets financés (depuis l'API) */}
      <section className="py-16 bg-muted border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="font-poppins text-2xl font-bold text-foreground">{t("web_realisations.filter_heading")}</h2>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveCategory(filter.key)}
                  className={`px-5 py-2.5 rounded-full font-inter text-sm font-medium transition-colors ${
                    activeCategory === filter.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-transparent border-2 border-primary text-primary hover:bg-accent"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isFetching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
                <RealisationCardSkeleton key={k} />
              ))}
            </div>
          )}

          {!isFetching && (!data?.results || data.results.length === 0) && (
            <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
              <Landmark className="h-16 w-16 opacity-40" />
              <p className="text-lg font-medium">{t("web_realisations.no_results")}</p>
            </div>
          )}

          {!isFetching && data?.results && data.results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.results.map((project) => (
                <RealisationCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-4">{t("web_realisations.cta_title")}</h2>
          <p className="text-lg mb-8 opacity-90">{t("web_realisations.cta_text")}</p>
          <Link
            href="/web/contact-us"
            className="inline-block px-8 py-3 bg-card hover:bg-background text-primary font-bold rounded-lg transition shadow-sm"
          >
            {t("web_realisations.cta_button")}
          </Link>
        </div>
      </section>
    </main>
  );
}

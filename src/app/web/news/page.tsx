"use client";
import { useGetProjectsQuery } from "@/store/apis/core/project.api";
import { Project } from "@/types/project.types";
import { Code, HandCoins, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const LOCALE_FR = "fr-FR";

function ProjectCard({ project }: Readonly<{ project: Project }>) {
  const { t } = useTranslation();

  const buyParams = new URLSearchParams({
    amount: project.price ?? "0",
    description: `Achat : ${project.title}`,
    project_id: project.id,
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/web/projects/${project.slug}`} className="block">
        <div className="relative h-44 bg-muted overflow-hidden">
          {project.cover_image ? (
            <Image src={project.cover_image} alt={project.title} fill className="object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Code className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
          {project.is_purchasable && project.price && (
            <span className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
              {Number(project.price).toLocaleString(LOCALE_FR)} XOF
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs text-primary font-medium">{project.category_name}</span>
          <h3 className="mt-1 font-semibold text-foreground line-clamp-2 text-base">{project.title}</h3>
          {project.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{project.excerpt}</p>
          )}
          {project.technologies && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.technologies.split(",").slice(0, 3).map((tech) => (
                <span key={tech.trim()} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tech.trim()}</span>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{project.author_name}</span>
            {project.published_at && (
              <span>{new Date(project.published_at).toLocaleDateString(LOCALE_FR, { day: "numeric", month: "short", year: "numeric" })}</span>
            )}
          </div>
          <span className="mt-3 text-sm text-primary font-medium hover:underline">{t("news_read_more")}</span>
        </div>
      </Link>

      {project.is_purchasable && project.price && (
        <div className="px-4 pb-4">
          <Link
            href={`/web/paiement?${buyParams.toString()}`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors"
          >
            <HandCoins className="h-4 w-4" />
            {t("web_realisations.support_project")} - {Number(project.price).toLocaleString(LOCALE_FR)} XOF
          </Link>
        </div>
      )}
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-44 bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { t } = useTranslation();
  const { data, isFetching } = useGetProjectsQuery("page=0&size=12&status=published&ordering=-published_at");

  return (
    <main className="min-h-screen bg-background">
      <section className="px-4 md:px-8 lg:px-20 py-12 mx-auto max-w-7xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{t("news_title")}</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-10">{t("news_subtitle")}</p>

        {isFetching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["s1","s2","s3","s4","s5","s6"].map((k) => <ProjectCardSkeleton key={k} />)}
          </div>
        )}

        {!isFetching && (!data?.results || data.results.length === 0) && (
          <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
            <Code className="h-16 w-16 text-muted-foreground/20" />
            <p className="text-lg font-medium">Aucun projet publié pour le moment</p>
          </div>
        )}

        {!isFetching && data?.results && data.results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

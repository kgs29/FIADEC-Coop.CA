"use client";
import { useGetProjectsQuery, useGetProjectCategoriesQuery } from "@/store/apis/core/project.api";
import { useGetUserNotificationsQuery } from "@/store/apis/core/notification.api";
import { useGetAllPaymentsQuery } from "@/store/apis/payment/payment.api";
import {
  useGetADGroupMappingsQuery,
  useGetDevicesQuery,
  useGetRolesQuery,
  useGetRulesQuery,
  useGetUsersQuery,
} from "@/store/apis/auth/authentication.api";
import {
  Bell,
  BookOpen,
  CreditCard,
  FileText,
  FolderOpen,
  Laptop,
  Settings,
  Shield,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface StatCardProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: number | string;
  readonly href: string;
  readonly colorIcon: string;
  readonly colorBg: string;
}

function StatCard({ icon, label, value, href, colorIcon, colorBg }: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary/30 group"
    >
      <div className={`p-3 rounded-xl ${colorBg} shrink-0`}>
        <span className={colorIcon}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
          {value ?? "—"}
        </p>
      </div>
    </Link>
  );
}

interface SectionProps {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const { t } = useTranslation();

  // ── Utilisateurs & administration ──────────────────────────────
  const { data: usersData,   isFetching: fUsers }   = useGetUsersQuery("size=1");
  const { data: rolesData,   isFetching: fRoles }   = useGetRolesQuery("size=1");
  const { data: rulesData,   isFetching: fRules }   = useGetRulesQuery("size=1");
  const { data: adData,      isFetching: fAD }      = useGetADGroupMappingsQuery("size=1");
  const { data: devicesData, isFetching: fDevices } = useGetDevicesQuery("size=1");

  // ── Projets ────────────────────────────────────────────────────
  const { data: projectsData,    isFetching: fProjects }   = useGetProjectsQuery("size=1");
  const { data: publishedData }                             = useGetProjectsQuery("size=1&status=published");
  const { data: draftData }                                 = useGetProjectsQuery("size=1&status=draft");
  const { data: categoriesData,  isFetching: fCategories } = useGetProjectCategoriesQuery("size=1");

  // ── Paiements & notifications ──────────────────────────────────
  const { data: paymentsData,      isFetching: fPayments }      = useGetAllPaymentsQuery("size=1");
  const { data: notificationsData, isFetching: fNotifications } = useGetUserNotificationsQuery("size=1");

  const val = (fetching: boolean, count?: number) =>
    fetching ? "…" : (count ?? 0);

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl font-bold text-foreground">{t("dashboard")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("welcome_dashboard")}
          </p>
        </div>

        {/* ── Section Administration ── */}
        <Section title={t("Dashboard.sidebar.administration")} icon={<Settings className="w-4 h-4" />}>
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label={t("Dashboard.sidebar.users")}
            value={val(fUsers, usersData?.count)}
            href="/admin/administration/users"
            colorIcon="text-blue-600"
            colorBg="bg-blue-50 dark:bg-blue-950/40"
          />
          <StatCard
            icon={<Shield className="h-5 w-5" />}
            label={t("Dashboard.sidebar.roles")}
            value={val(fRoles, rolesData?.count)}
            href="/admin/administration/roles"
            colorIcon="text-violet-600"
            colorBg="bg-violet-50 dark:bg-violet-950/40"
          />
          <StatCard
            icon={<Tag className="h-5 w-5" />}
            label={t("Dashboard.sidebar.groups")}
            value={val(fRules, rulesData?.count)}
            href="/admin/administration/rules"
            colorIcon="text-orange-600"
            colorBg="bg-orange-50 dark:bg-orange-950/40"
          />
          <StatCard
            icon={<Settings className="h-5 w-5" />}
            label={t("Dashboard.sidebar.ad_group_mappings")}
            value={val(fAD, adData?.count)}
            href="/admin/administration/ad-group-mappings"
            colorIcon="text-sky-600"
            colorBg="bg-sky-50 dark:bg-sky-950/40"
          />
          <StatCard
            icon={<Laptop className="h-5 w-5" />}
            label={t("Dashboard.sidebar.devices")}
            value={val(fDevices, devicesData?.count)}
            href="/admin/administration/devices"
            colorIcon="text-teal-600"
            colorBg="bg-teal-50 dark:bg-teal-950/40"
          />
          <StatCard
            icon={<Bell className="h-5 w-5" />}
            label={t("Dashboard.sidebar.notifications")}
            value={val(fNotifications, notificationsData?.count)}
            href="/admin/administration/notifications"
            colorIcon="text-yellow-600"
            colorBg="bg-yellow-50 dark:bg-yellow-950/40"
          />
        </Section>

        {/* ── Section Projets ── */}
        <Section title={t("Dashboard.sidebar.projects")} icon={<FileText className="w-4 h-4" />}>
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label={t("Dashboard.sidebar.projects")}
            value={val(fProjects, projectsData?.count)}
            href="/admin/projects"
            colorIcon="text-emerald-600"
            colorBg="bg-emerald-50 dark:bg-emerald-950/40"
          />
          <StatCard
            icon={<FolderOpen className="h-5 w-5" />}
            label={t("Dashboard.sidebar.project_categories")}
            value={val(fCategories, categoriesData?.count)}
            href="/admin/projects/categories"
            colorIcon="text-lime-600"
            colorBg="bg-lime-50 dark:bg-lime-950/40"
          />
        </Section>

        {/* ── Section Paiements ── */}
        <Section title={t("Dashboard.sidebar.payments")} icon={<CreditCard className="w-4 h-4" />}>
          <StatCard
            icon={<CreditCard className="h-5 w-5" />}
            label={t("Dashboard.sidebar.all_payments")}
            value={val(fPayments, paymentsData?.count)}
            href="/admin/paiements"
            colorIcon="text-rose-600"
            colorBg="bg-rose-50 dark:bg-rose-950/40"
          />
        </Section>

        {/* ── Détail projets ── */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t("Dashboard.sidebar.projects")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900">
              <div className="flex items-center gap-3">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  {t("published")}
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {fProjects ? "…" : (publishedData?.count ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl border border-yellow-100 dark:border-yellow-900">
              <div className="flex items-center gap-3">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300">
                  {t("draft")}
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {fProjects ? "…" : (draftData?.count ?? 0)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  useGetStatsConfigQuery,
  useUpdateStatsConfigMutation,
} from "@/store/apis/auth/authentication.api";
import { DEFAULT_CHART_COLORS, DEFAULT_DARK_CHART_COLORS } from "@/hooks/useStatsConfig";
import {
  BarChart2,
  Bell,
  BookOpen,
  Cpu,
  FileText,
  GitMerge,
  LayoutGrid,
  Mail,
  MessageSquare,
  ScrollText,
  Shield,
  Tag,
  Users,
} from "lucide-react";

// ── Chart registry ────────────────────────────────────────────

interface ChartDef {
  readonly id: string;
  readonly label: string;
  /** Index in global palette to use as fallback color. Omit for pie charts. */
  readonly colorIndex?: number;
}

interface ModuleDef {
  readonly module: string;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly charts: readonly ChartDef[];
}

export const CHART_REGISTRY: ModuleDef[] = [
  {
    module: "users",
    label: "Utilisateurs",
    icon: <Users className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_active",        label: "Actifs / Inactifs",        colorIndex: 0 },
      { id: "pie_types",         label: "Types d'utilisateurs",     colorIndex: 1 },
      { id: "bar_security",      label: "Sécurité (2FA / Captcha)", colorIndex: 2 },
      { id: "bar_registrations", label: "Inscriptions par mois",    colorIndex: 3 },
    ],
  },
  {
    module: "roles",
    label: "Rôles",
    icon: <Shield className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_active_archived", label: "Actifs / Archivés",    colorIndex: 0 },
      { id: "bar_permissions",     label: "Permissions par rôle", colorIndex: 1 },
    ],
  },
  {
    module: "rules",
    label: "Groupes de permissions",
    icon: <GitMerge className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_perms",       label: "Avec / Sans permissions", colorIndex: 0 },
      { id: "bar_perms_count", label: "Permissions par groupe",  colorIndex: 1 },
    ],
  },
  {
    module: "ad_group_mappings",
    label: "Mappings groupes AD",
    icon: <Cpu className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_active_archived", label: "Actifs / Archivés",  colorIndex: 0 },
      { id: "bar_roles",           label: "Mappings par rôle",  colorIndex: 2 },
    ],
  },
  {
    module: "devices",
    label: "Appareils connectés",
    icon: <LayoutGrid className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_session_status", label: "Statut des sessions", colorIndex: 0 },
      { id: "pie_device_type",    label: "Type d'appareil",     colorIndex: 1 },
      { id: "bar_top_users",      label: "Top utilisateurs",    colorIndex: 2 },
      { id: "bar_activity",       label: "Activité récente",    colorIndex: 3 },
    ],
  },
  {
    module: "logs",
    label: "Journaux de connexion",
    icon: <ScrollText className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_http_status", label: "Par statut HTTP",     colorIndex: 0 },
      { id: "bar_method",      label: "Par méthode HTTP",    colorIndex: 1 },
      { id: "bar_top_users",   label: "Top utilisateurs",    colorIndex: 4 },
      { id: "bar_endpoints",   label: "Top endpoints",       colorIndex: 2 },
    ],
  },
  {
    module: "notifications",
    label: "Notifications",
    icon: <Bell className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_read_unread", label: "Lues / Non lues",          colorIndex: 0 },
      { id: "bar_months",      label: "Notifications par mois",   colorIndex: 1 },
    ],
  },
  {
    module: "newsletter",
    label: "Newsletter",
    icon: <Mail className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_status", label: "Actifs / Inactifs",       colorIndex: 0 },
      { id: "bar_months", label: "Inscriptions par mois",   colorIndex: 1 },
    ],
  },
  {
    module: "contacts",
    label: "Messages reçus",
    icon: <MessageSquare className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_status", label: "Par statut",         colorIndex: 0 },
      { id: "bar_months", label: "Messages par mois",  colorIndex: 3 },
    ],
  },
  {
    module: "projects",
    label: "Projets",
    icon: <FileText className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_status",      label: "Répartition par statut",    colorIndex: 0 },
      { id: "bar_category",    label: "Par catégorie",              colorIndex: 1 },
      { id: "bar_difficulty",  label: "Par niveau de difficulté",   colorIndex: 4 },
      { id: "line_months",     label: "Publications par mois",      colorIndex: 2 },
    ],
  },
  {
    module: "project-categories",
    label: "Catégories de projets",
    icon: <Tag className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_status", label: "Actives / Inactives",      colorIndex: 0 },
      { id: "bar_detail", label: "Détail des catégories",    colorIndex: 1 },
    ],
  },
  {
    module: "payments",
    label: "Paiements",
    icon: <BookOpen className="w-4 h-4 text-primary" />,
    charts: [
      { id: "pie_status",  label: "Répartition par statut",   colorIndex: 0 },
      { id: "bar_method",  label: "Montant par méthode",      colorIndex: 1 },
      { id: "line_months", label: "Évolution des paiements",  colorIndex: 2 },
    ],
  },
];

// ── ModuleChartSection ────────────────────────────────────────

type ModuleConfig = Record<string, unknown>;

interface ModuleSectionProps extends ModuleDef {
  readonly onChange: (module: string, config: ModuleConfig) => void;
}

function ModuleChartSection({ module, label, icon, charts, onChange }: ModuleSectionProps) {
  const { t } = useTranslation();
  const { data } = useGetStatsConfigQuery(module);
  const [local, setLocal] = useState<ModuleConfig>(() =>
    Object.fromEntries(charts.map((c) => [c.id, true]))
  );

  useEffect(() => {
    if (!data?.config) return;
    const cfg: ModuleConfig = {};
    charts.forEach((c) => {
      cfg[c.id] = data.config[c.id] !== false;
      const lk = `chart_color_${c.id}`;
      const dk = `dark_chart_color_${c.id}`;
      if (data.config[lk]) cfg[lk] = data.config[lk];
      if (data.config[dk]) cfg[dk] = data.config[dk];
    });
    setLocal(cfg);
    onChange(module, cfg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const update = (next: ModuleConfig) => { setLocal(next); onChange(module, next); };

  const toggle = (id: string) =>
    update({ ...local, [id]: !local[id] });

  const setColor = (id: string, mode: "light" | "dark", color: string) => {
    const key = mode === "dark" ? `dark_chart_color_${id}` : `chart_color_${id}`;
    update({ ...local, [key]: color });
  };

  const allOn = charts.every((c) => local[c.id] !== false);
  const toggleAll = () =>
    update({
      ...local,
      ...Object.fromEntries(charts.map((c) => [c.id, !allOn])),
    });

  const lightColorOf = (c: ChartDef) => {
    const saved = local[`chart_color_${c.id}`];
    return typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved)
      ? saved
      : DEFAULT_CHART_COLORS[c.colorIndex ?? 0];
  };

  const darkColorOf = (c: ChartDef) => {
    const saved = local[`dark_chart_color_${c.id}`];
    return typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved)
      ? saved
      : DEFAULT_DARK_CHART_COLORS[c.colorIndex ?? 0];
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Module header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{label}</span>
          <span className="text-xs text-muted-foreground">
            ({charts.length} graphique{charts.length > 1 ? "s" : ""})
          </span>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-primary hover:underline"
        >
          {allOn ? t("hide_all") : t("show_all")}
        </button>
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-2 pl-2">
        {charts.map((chart) => (
          <div key={chart.id} className="flex items-center gap-3">
            {/* Visibility */}
            <label className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0">
              <input
                type="checkbox"
                checked={local[chart.id] !== false}
                onChange={() => toggle(chart.id)}
                className="w-4 h-4 rounded border-border accent-primary shrink-0"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {chart.label}
              </span>
            </label>

            {/* Color pickers - all chart types */}
            {(
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-muted-foreground" title={t("light_mode")}>☀</span>
                <input
                  type="color"
                  value={lightColorOf(chart)}
                  onChange={(e) => setColor(chart.id, "light", e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-border p-0.5 bg-background"
                  title={t("light_mode_color")}
                />
                <span className="text-xs text-muted-foreground" title={t("dark_mode")}>☾</span>
                <input
                  type="color"
                  value={darkColorOf(chart)}
                  onChange={(e) => setColor(chart.id, "dark", e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-border p-0.5 bg-background"
                  title={t("dark_mode_color")}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── StatsChartsTab ────────────────────────────────────────────

export interface StatsChartsTabHandle {
  save: () => Promise<void>;
}

export const StatsChartsTab = forwardRef<StatsChartsTabHandle>(
  function StatsChartsTab(_props, ref) {
    const { t } = useTranslation();
    const [allConfigs, setAllConfigs] = useState<Record<string, ModuleConfig>>({});
    const [updateStatsConfig] = useUpdateStatsConfigMutation();

    useImperativeHandle(ref, () => ({
      save: async () => {
        await Promise.all(
          Object.entries(allConfigs).map(([module, config]) =>
            updateStatsConfig({ module, config }).unwrap()
          )
        );
      },
    }));

    const handleChange = (module: string, config: ModuleConfig) => {
      setAllConfigs((prev) => ({ ...prev, [module]: config }));
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <span className="text-primary">
            <BarChart2 className="w-4 h-4" />
          </span>
          <h2 className="font-semibold text-base">{t("stats_charts_title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-2">
          {t("stats_charts_description")}
        </p>

        <div className="flex flex-col gap-5">
          {CHART_REGISTRY.map((def, idx) => (
            <div key={def.module}>
              <ModuleChartSection {...def} onChange={handleChange} />
              {idx < CHART_REGISTRY.length - 1 && (
                <div className="mt-5 border-b border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

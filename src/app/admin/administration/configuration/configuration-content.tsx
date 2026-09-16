"use client";
import { applyThemeConfig } from "@/lib/applyTheme";
import {
  useGetConfigurationQuery,
  useResetConfigurationMutation,
  useUpdateConfigurationMutation,
} from "@/store/apis/core/configuration.api";
import { setConfig } from "@/store/slices/configSlice";
import { AppConfigInterface, DEFAULT_CONFIG } from "@/types/configuration.types";
import {
  Archive,
  BarChart2,
  Copy,
  Download,
  Image as ImageIcon,
  KeyRound,
  List,
  Loader2,
  Lock,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  MousePointerClick,
  Navigation,
  Palette,
  Pencil,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  SendHorizontal,
  Settings,
  Sun,
  Table2,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  useGetStatsConfigQuery,
  useUpdateStatsConfigMutation,
} from "@/store/apis/auth/authentication.api";
import { StatsChartsTab, StatsChartsTabHandle } from "./StatsChartsTab";
import { DEFAULT_CHART_COLORS, DEFAULT_DARK_CHART_COLORS } from "@/hooks/useStatsConfig";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

type Tab = "general" | "light" | "dark" | "buttons" | "tables" | "forms" | "breadcrumb" | "selects" | "login" | "stats" | "charts";

// Shared preview background colors (dark/light) reused across the tab preview components below.
const PREVIEW_DARK_BG = "#0F172A";
const PREVIEW_LIGHT_BG = "#F8FAFC";

type ColorField = Readonly<{
  key: keyof AppConfigInterface;
  labelKey: string;
}>;

const LIGHT_COLORS: ColorField[] = [
  { key: "light_primary",    labelKey: "config.colorPrimary" },
  { key: "light_secondary",  labelKey: "config.colorSecondary" },
  { key: "light_button",     labelKey: "config.colorButton" },
  { key: "light_text",       labelKey: "config.colorText" },
  { key: "light_background", labelKey: "config.colorBackground" },
];

const DARK_COLORS: ColorField[] = [
  { key: "dark_primary",    labelKey: "config.colorPrimary" },
  { key: "dark_secondary",  labelKey: "config.colorSecondary" },
  { key: "dark_button",     labelKey: "config.colorButton" },
  { key: "dark_text",       labelKey: "config.colorText" },
  { key: "dark_background", labelKey: "config.colorBackground" },
];

const TABLE_LIGHT: ColorField[] = [
  { key: "table_header_bg",   labelKey: "config.tableHeaderBg" },
  { key: "table_header_text", labelKey: "config.tableHeaderText" },
  { key: "table_row_hover",   labelKey: "config.tableRowHover" },
  { key: "table_border",      labelKey: "config.tableBorder" },
  { key: "table_text",        labelKey: "config.tableText" },
];

const TABLE_DARK: ColorField[] = [
  { key: "dark_table_header_bg",   labelKey: "config.tableHeaderBg" },
  { key: "dark_table_header_text", labelKey: "config.tableHeaderText" },
  { key: "dark_table_row_hover",   labelKey: "config.tableRowHover" },
  { key: "dark_table_border",      labelKey: "config.tableBorder" },
  { key: "dark_table_text",        labelKey: "config.tableText" },
];

const FORM_LIGHT: ColorField[] = [
  { key: "form_input_bg",     labelKey: "config.formInputBg" },
  { key: "form_input_border", labelKey: "config.formInputBorder" },
  { key: "form_label_color",  labelKey: "config.formLabelColor" },
  { key: "form_focus_color",  labelKey: "config.formFocusColor" },
];

const FORM_DARK: ColorField[] = [
  { key: "dark_form_input_bg",     labelKey: "config.formInputBg" },
  { key: "dark_form_input_border", labelKey: "config.formInputBorder" },
  { key: "dark_form_label_color",  labelKey: "config.formLabelColor" },
  { key: "dark_form_focus_color",  labelKey: "config.formFocusColor" },
];

const PAGINATION_LIGHT: ColorField[] = [
  { key: "pagination_bg",          labelKey: "config.paginationBg" },
  { key: "pagination_text",        labelKey: "config.paginationText" },
  { key: "pagination_active_bg",   labelKey: "config.paginationActiveBg" },
  { key: "pagination_active_text", labelKey: "config.paginationActiveText" },
  { key: "pagination_border",      labelKey: "config.paginationBorder" },
];

const PAGINATION_DARK: ColorField[] = [
  { key: "dark_pagination_bg",          labelKey: "config.paginationBg" },
  { key: "dark_pagination_text",        labelKey: "config.paginationText" },
  { key: "dark_pagination_active_bg",   labelKey: "config.paginationActiveBg" },
  { key: "dark_pagination_active_text", labelKey: "config.paginationActiveText" },
  { key: "dark_pagination_border",      labelKey: "config.paginationBorder" },
];

const SELECT_LIGHT: ColorField[] = [
  { key: "select_bg",           labelKey: "config.selectBg" },
  { key: "select_border",       labelKey: "config.selectBorder" },
  { key: "select_text",         labelKey: "config.selectText" },
  { key: "select_focus",        labelKey: "config.selectFocus" },
  { key: "select_option_hover", labelKey: "config.selectOptionHover" },
];

const SELECT_DARK: ColorField[] = [
  { key: "dark_select_bg",           labelKey: "config.selectBg" },
  { key: "dark_select_border",       labelKey: "config.selectBorder" },
  { key: "dark_select_text",         labelKey: "config.selectText" },
  { key: "dark_select_focus",        labelKey: "config.selectFocus" },
  { key: "dark_select_option_hover", labelKey: "config.selectOptionHover" },
];

const BREADCRUMB_LIGHT: ColorField[] = [
  { key: "breadcrumb_bg",        labelKey: "config.breadcrumbBg" },
  { key: "breadcrumb_text",      labelKey: "config.breadcrumbText" },
  { key: "breadcrumb_link",      labelKey: "config.breadcrumbLink" },
  { key: "breadcrumb_separator", labelKey: "config.breadcrumbSeparator" },
];

const BREADCRUMB_DARK: ColorField[] = [
  { key: "dark_breadcrumb_bg",        labelKey: "config.breadcrumbBg" },
  { key: "dark_breadcrumb_text",      labelKey: "config.breadcrumbText" },
  { key: "dark_breadcrumb_link",      labelKey: "config.breadcrumbLink" },
  { key: "dark_breadcrumb_separator", labelKey: "config.breadcrumbSeparator" },
];

const LOGIN_COLORS: ColorField[] = [
  { key: "login_bg_from", labelKey: "config.loginBgFrom" },
  { key: "login_bg_to",   labelKey: "config.loginBgTo" },
  { key: "login_accent",  labelKey: "config.loginAccent" },
  { key: "login_card_bg", labelKey: "config.loginCardBg" },
];

type BtnDef = Readonly<{
  lightKey: keyof AppConfigInterface;
  darkKey:  keyof AppConfigInterface;
  labelKey: string;
  icon: React.ReactNode;
}>;

const BTN_DEFS: BtnDef[] = [
  { lightKey: "btn_save_bg",      darkKey: "dark_btn_save_bg",      labelKey: "config.btnSave",      icon: <Save           className="w-3 h-3" /> },
  { lightKey: "btn_delete_bg",    darkKey: "dark_btn_delete_bg",    labelKey: "config.btnDelete",    icon: <Trash2         className="w-3 h-3" /> },
  { lightKey: "btn_edit_bg",      darkKey: "dark_btn_edit_bg",      labelKey: "config.btnEdit",      icon: <Pencil         className="w-3 h-3" /> },
  { lightKey: "btn_export_bg",    darkKey: "dark_btn_export_bg",    labelKey: "config.btnExport",    icon: <Download       className="w-3 h-3" /> },
  { lightKey: "btn_import_bg",    darkKey: "dark_btn_import_bg",    labelKey: "config.btnImport",    icon: <Upload         className="w-3 h-3" /> },
  { lightKey: "btn_duplicate_bg", darkKey: "dark_btn_duplicate_bg", labelKey: "config.btnDuplicate", icon: <Copy           className="w-3 h-3" /> },
  { lightKey: "btn_action_bg",    darkKey: "dark_btn_action_bg",    labelKey: "config.btnAction",    icon: <MoreHorizontal className="w-3 h-3" /> },
  { lightKey: "btn_create_bg",    darkKey: "dark_btn_create_bg",    labelKey: "config.btnCreate",    icon: <PlusCircle     className="w-3 h-3" /> },
  { lightKey: "btn_cancel_bg",    darkKey: "dark_btn_cancel_bg",    labelKey: "config.btnCancel",    icon: <X              className="w-3 h-3" /> },
  { lightKey: "btn_archive_bg",   darkKey: "dark_btn_archive_bg",   labelKey: "config.btnArchive",   icon: <Archive        className="w-3 h-3" /> },
  { lightKey: "btn_reset_bg",     darkKey: "dark_btn_reset_bg",     labelKey: "config.btnReset",     icon: <RotateCcw      className="w-3 h-3" /> },
  { lightKey: "btn_search_bg",    darkKey: "dark_btn_search_bg",    labelKey: "config.btnSearch",    icon: <Search         className="w-3 h-3" /> },
  { lightKey: "btn_send_bg",      darkKey: "dark_btn_send_bg",      labelKey: "config.btnSend",      icon: <SendHorizontal className="w-3 h-3" /> },
  { lightKey: "btn_neutral_bg",   darkKey: "dark_btn_neutral_bg",   labelKey: "config.btnNeutral",   icon: <Minus          className="w-3 h-3" /> },
];

function pickColor(
  form: Partial<AppConfigInterface>,
  merged: AppConfigInterface,
  key: string
): string {
  const k = key as keyof AppConfigInterface;
  return ((form[k] ?? merged[k]) as string) || "#000";
}

/* ── Tab sub-components ─────────────────────────────────────── */

type TabBaseProps = Readonly<{
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
  handleColor: (key: keyof AppConfigInterface, value: string) => void;
  t: (k: string) => string;
}>;

type GeneralTabProps = Readonly<{
  form: Partial<AppConfigInterface>;
  setForm: React.Dispatch<React.SetStateAction<Partial<AppConfigInterface>>>;
  merged: AppConfigInterface;
  logoPreview: string | null;
  setLogoPreview: (v: string | null) => void;
  faviconPreview: string | null;
  setFaviconPreview: (v: string | null) => void;
  logoRef: React.RefObject<HTMLInputElement | null>;
  faviconRef: React.RefObject<HTMLInputElement | null>;
  logoFile: React.RefObject<File | null>;
  faviconFile: React.RefObject<File | null>;
  logoCleared: React.RefObject<boolean>;
  faviconCleared: React.RefObject<boolean>;
  handleFile: (type: "logo" | "favicon", file: File) => void;
  t: (k: string) => string;
}>;

function GeneralTab({
  form, setForm, merged, logoPreview, setLogoPreview,
  faviconPreview, setFaviconPreview, logoRef, faviconRef,
  logoFile, faviconFile, logoCleared, faviconCleared, handleFile, t,
}: GeneralTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<Settings className="w-4 h-4" />} title={t("config.sectionGeneral")} />

      <Field label={t("config.fieldAppName")}>
        <input
          type="text"
          value={form.app_name ?? merged.app_name}
          onChange={(e) => setForm({ ...form, app_name: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("config.fieldAppNamePlaceholder")}
        />
      </Field>

      <Field label={t("config.fieldDescription")}>
        <input
          type="text"
          value={form.app_description ?? merged.app_description}
          onChange={(e) => setForm({ ...form, app_description: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("config.fieldDescriptionPlaceholder")}
        />
      </Field>

      <Field label={t("config.fieldLogo")}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
            onClick={() => logoRef.current?.click()}
            aria-label={t("config.fieldLogo")}
          >
            {logoPreview ? (
              <NextImage src={logoPreview} alt="Logo" width={96} height={96} className="object-contain w-full h-full" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs">PNG, SVG</span>
              </div>
            )}
          </button>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => logoRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" /> {t("config.chooseFile")}
            </button>
            {logoPreview && (
              <button
                onClick={() => {
                  setLogoPreview(null);
                  logoFile.current = null;
                  logoCleared.current = true;
                }}
                className="text-xs text-destructive hover:underline text-left"
              >
                {t("delete")}
              </button>
            )}
            <p className="text-xs text-muted-foreground">{t("config.logoHint")}</p>
          </div>
          <input ref={logoRef} type="file" className="hidden" accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile("logo", e.target.files[0])} />
        </div>
      </Field>

      <Field label={t("config.fieldFavicon")}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
            onClick={() => faviconRef.current?.click()}
            aria-label={t("config.fieldFavicon")}
          >
            {faviconPreview ? (
              <NextImage src={faviconPreview} alt="Favicon" width={64} height={64} className="object-contain" />
            ) : (
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => faviconRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" /> {t("config.chooseFile")}
            </button>
            {faviconPreview && (
              <button
                onClick={() => {
                  setFaviconPreview(null);
                  faviconFile.current = null;
                  faviconCleared.current = true;
                }}
                className="text-xs text-destructive hover:underline text-left"
              >
                {t("delete")}
              </button>
            )}
            <p className="text-xs text-muted-foreground">{t("config.faviconHint")}</p>
          </div>
          <input ref={faviconRef} type="file" className="hidden" accept="image/*,.ico"
            onChange={(e) => e.target.files?.[0] && handleFile("favicon", e.target.files[0])} />
        </div>
      </Field>
    </div>
  );
}

function LightTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<Sun className="w-4 h-4" />} title={t("config.tabLight")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {LIGHT_COLORS.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
        </div>
        <ThemePreview mode="light"
          primary={pickColor(form, merged, "light_primary")}
          secondary={pickColor(form, merged, "light_secondary")}
          button={pickColor(form, merged, "light_button")}
          text={pickColor(form, merged, "light_text")}
          background={pickColor(form, merged, "light_background")}
          previewLabel={t("config.preview")} />
      </div>
    </div>
  );
}

function DarkTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<Moon className="w-4 h-4" />} title={t("config.tabDark")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {DARK_COLORS.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
        </div>
        <ThemePreview mode="dark"
          primary={pickColor(form, merged, "dark_primary")}
          secondary={pickColor(form, merged, "dark_secondary")}
          button={pickColor(form, merged, "dark_button")}
          text={pickColor(form, merged, "dark_text")}
          background={pickColor(form, merged, "dark_background")}
          previewLabel={t("config.preview")} />
      </div>
    </div>
  );
}

function ButtonsTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<MousePointerClick className="w-4 h-4" />} title={t("config.sectionButtons")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {BTN_DEFS.map(({ lightKey, labelKey, icon }) => (
            <ColorPicker key={lightKey} label={t(labelKey)} prefixIcon={icon}
              value={pickColor(form, merged, lightKey)}
              onChange={(v) => handleColor(lightKey, v)} />
          ))}
          <ButtonPreview mode="light" form={form} merged={merged} previewLabel={t("config.preview")} tFn={t} />
        </div>
        <div className="flex flex-col gap-4">
          <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {BTN_DEFS.map(({ darkKey, labelKey, icon }) => (
            <ColorPicker key={darkKey} label={t(labelKey)} prefixIcon={icon}
              value={pickColor(form, merged, darkKey)}
              onChange={(v) => handleColor(darkKey, v)} />
          ))}
          <ButtonPreview mode="dark" form={form} merged={merged} previewLabel={t("config.preview")} tFn={t} />
        </div>
      </div>
    </div>
  );
}

function TablesTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<Table2 className="w-4 h-4" />} title={t("config.sectionTables")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {TABLE_LIGHT.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <TablePreview mode="light" form={form} merged={merged} />
        </div>
        <div className="flex flex-col gap-4">
          <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {TABLE_DARK.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <TablePreview mode="dark" form={form} merged={merged} />
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("config.pagination")}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
            {PAGINATION_LIGHT.map(({ key, labelKey }) => (
              <ColorPicker key={key} label={t(labelKey)}
                value={pickColor(form, merged, key)}
                onChange={(v) => handleColor(key, v)} />
            ))}
            <PaginationPreview mode="light" form={form} merged={merged} previewLabel={t("config.preview")} />
          </div>
          <div className="flex flex-col gap-4">
            <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
            {PAGINATION_DARK.map(({ key, labelKey }) => (
              <ColorPicker key={key} label={t(labelKey)}
                value={pickColor(form, merged, key)}
                onChange={(v) => handleColor(key, v)} />
            ))}
            <PaginationPreview mode="dark" form={form} merged={merged} previewLabel={t("config.preview")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FormsTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<Type className="w-4 h-4" />} title={t("config.sectionForms")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {FORM_LIGHT.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <FormPreview mode="light" form={form} merged={merged} />
        </div>
        <div className="flex flex-col gap-4">
          <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {FORM_DARK.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <FormPreview mode="dark" form={form} merged={merged} />
        </div>
      </div>
    </div>
  );
}

function BreadcrumbTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<Navigation className="w-4 h-4" />} title={t("config.sectionBreadcrumb")} />
      <p className="text-sm text-muted-foreground -mt-2">{t("config.breadcrumbSubtitle")}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {BREADCRUMB_LIGHT.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <BreadcrumbPreview form={form} merged={merged} mode="light" />
        </div>
        <div className="flex flex-col gap-4">
          <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {BREADCRUMB_DARK.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <BreadcrumbPreview form={form} merged={merged} mode="dark" />
        </div>
      </div>
    </div>
  );
}

function SelectsTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<List className="w-4 h-4" />} title={t("config.sectionSelects")} />
      <p className="text-sm text-muted-foreground -mt-2">{t("config.selectSubtitle")}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {SELECT_LIGHT.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <SelectPreview mode="light" form={form} merged={merged} previewLabel={t("config.preview")} />
        </div>
        <div className="flex flex-col gap-4">
          <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {SELECT_DARK.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
          <SelectPreview mode="dark" form={form} merged={merged} previewLabel={t("config.preview")} />
        </div>
      </div>
    </div>
  );
}

function LoginTab({ form, merged, handleColor, t }: TabBaseProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<KeyRound className="w-4 h-4" />} title={t("config.sectionLogin")} />
      <p className="text-sm text-muted-foreground -mt-2">{t("config.loginSubtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {LOGIN_COLORS.map(({ key, labelKey }) => (
            <ColorPicker key={key} label={t(labelKey)}
              value={pickColor(form, merged, key)}
              onChange={(v) => handleColor(key, v)} />
          ))}
        </div>
        <LoginPreview
          bgFrom={pickColor(form, merged, "login_bg_from")}
          bgTo={pickColor(form, merged, "login_bg_to")}
          accent={pickColor(form, merged, "login_accent")}
          cardBg={pickColor(form, merged, "login_card_bg")}
          previewLabel={t("config.preview")}
        />
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

export default function ConfigurationContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: serverConfig, isLoading } = useGetConfigurationQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateConfigurationMutation();
  const [resetConfig, { isLoading: isResetting }] = useResetConfigurationMutation();
  const { data: globalStatsData } = useGetStatsConfigQuery("__global__");
  const [updateStatsConfig] = useUpdateStatsConfigMutation();

  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [form, setForm] = useState<Partial<AppConfigInterface>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const logoFile = useRef<File | null>(null);
  const faviconFile = useRef<File | null>(null);
  const logoCleared = useRef(false);
  const faviconCleared = useRef(false);
  const chartsTabRef = useRef<StatsChartsTabHandle>(null);

  const [statsLightColors, setStatsLightColors] = useState<string[]>(() =>
    resolveStatsColors(globalStatsData?.config, "color_", DEFAULT_CHART_COLORS)
  );
  const [statsDarkColors, setStatsDarkColors] = useState<string[]>(() =>
    resolveStatsColors(globalStatsData?.config, "dark_color_", DEFAULT_DARK_CHART_COLORS)
  );

  useEffect(() => {
    if (serverConfig) {
      setForm(serverConfig);
      setLogoPreview(serverConfig.app_logo_url);
      setFaviconPreview(serverConfig.favicon_url);
    }
  }, [serverConfig]);

  useEffect(() => {
    if (globalStatsData?.config) {
      setStatsLightColors(resolveStatsColors(globalStatsData.config, "color_", DEFAULT_CHART_COLORS));
      setStatsDarkColors(resolveStatsColors(globalStatsData.config, "dark_color_", DEFAULT_DARK_CHART_COLORS));
    }
  }, [globalStatsData]);

  const merged = { ...DEFAULT_CONFIG, ...serverConfig, ...form } as AppConfigInterface;

  const handleColor = (key: keyof AppConfigInterface, value: string) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    applyThemeConfig({ ...merged, ...updated });
  };

  const handleFile = (type: "logo" | "favicon", file: File) => {
    const url = URL.createObjectURL(file);
    if (type === "logo") {
      setLogoPreview(url);
      logoFile.current = file;
      logoCleared.current = false;
    } else {
      setFaviconPreview(url);
      faviconFile.current = file;
      faviconCleared.current = false;
    }
  };

  const handleSave = async () => {
    const fd = new FormData();
    const IMAGE_KEYS = new Set(["app_logo", "app_logo_url", "favicon", "favicon_url", "id", "updated_at"]);
    Object.entries(form).forEach(([k, v]) => {
      if (!IMAGE_KEYS.has(k) && v !== null && v !== undefined) {
        fd.append(k, String(v));
      }
    });
    if (logoFile.current) {
      fd.set("app_logo", logoFile.current);
    } else if (logoCleared.current) {
      fd.set("app_logo", "");
    }
    if (faviconFile.current) {
      fd.set("favicon", faviconFile.current);
    } else if (faviconCleared.current) {
      fd.set("favicon", "");
    }
    try {
      const result = await updateConfig(fd).unwrap();
      dispatch(setConfig(result));
      applyThemeConfig(result);
      logoFile.current = null;
      faviconFile.current = null;
      logoCleared.current = false;
      faviconCleared.current = false;
      const statsConfig: Record<string, string> = {};
      statsLightColors.forEach((c, i) => { statsConfig[`color_${i}`] = c; });
      statsDarkColors.forEach((c, i) => { statsConfig[`dark_color_${i}`] = c; });
      await updateStatsConfig({ module: "__global__", config: statsConfig });
      await chartsTabRef.current?.save();
      toast.success(t("config.saveSuccess"));
    } catch {
      toast.error(t("config.saveError"));
    }
  };

  const handleReset = async () => {
    if (!confirm(t("config.resetConfirm"))) return;
    try {
      const result = await resetConfig().unwrap();
      dispatch(setConfig(result));
      applyThemeConfig(result);
      setForm(result);
      setLogoPreview(null);
      setFaviconPreview(null);
      logoFile.current = null;
      faviconFile.current = null;
      logoCleared.current = false;
      faviconCleared.current = false;
      setStatsLightColors([...DEFAULT_CHART_COLORS]);
      setStatsDarkColors([...DEFAULT_DARK_CHART_COLORS]);
      toast.success(t("config.resetSuccess"));
    } catch {
      toast.error(t("config.resetError"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "general",    label: t("config.tabGeneral"),    icon: <Settings          className="w-4 h-4" /> },
    { id: "light",      label: t("config.tabLight"),      icon: <Sun               className="w-4 h-4" /> },
    { id: "dark",       label: t("config.tabDark"),       icon: <Moon              className="w-4 h-4" /> },
    { id: "buttons",    label: t("config.tabButtons"),    icon: <MousePointerClick className="w-4 h-4" /> },
    { id: "tables",     label: t("config.tabTables"),     icon: <Table2            className="w-4 h-4" /> },
    { id: "forms",      label: t("config.tabForms"),      icon: <Type              className="w-4 h-4" /> },
    { id: "breadcrumb", label: t("config.tabBreadcrumb"), icon: <Navigation        className="w-4 h-4" /> },
    { id: "selects",    label: t("config.tabSelects"),    icon: <List              className="w-4 h-4" /> },
    { id: "login",      label: t("config.tabLogin"),      icon: <KeyRound          className="w-4 h-4" /> },
    { id: "stats",      label: t("config.tabStats"),      icon: <BarChart2         className="w-4 h-4" /> },
    { id: "charts",     label: t("config.tabCharts"),     icon: <Monitor           className="w-4 h-4" /> },
  ];

  const tabBaseProps: TabBaseProps = { form, merged, handleColor, t };

  return (
    <div className="m-4 flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t("config.pageTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("config.pageSubtitle")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {t("config.btnReset")}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t("config.btnSave")}
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* ── Sidebar tabs ── */}
        <div className="lg:w-52 flex flex-row flex-wrap lg:flex-col gap-1 bg-card rounded-xl border border-border p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors lg:w-full text-left ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 bg-card rounded-xl border border-border p-6">
          {activeTab === "general" && (
            <GeneralTab
              form={form} setForm={setForm} merged={merged}
              logoPreview={logoPreview} setLogoPreview={setLogoPreview}
              faviconPreview={faviconPreview} setFaviconPreview={setFaviconPreview}
              logoRef={logoRef} faviconRef={faviconRef}
              logoFile={logoFile} faviconFile={faviconFile}
              logoCleared={logoCleared} faviconCleared={faviconCleared}
              handleFile={handleFile} t={t}
            />
          )}
          {activeTab === "light"      && <LightTab      {...tabBaseProps} />}
          {activeTab === "dark"       && <DarkTab       {...tabBaseProps} />}
          {activeTab === "buttons"    && <ButtonsTab    {...tabBaseProps} />}
          {activeTab === "tables"     && <TablesTab     {...tabBaseProps} />}
          {activeTab === "forms"      && <FormsTab      {...tabBaseProps} />}
          {activeTab === "breadcrumb" && <BreadcrumbTab {...tabBaseProps} />}
          {activeTab === "selects"    && <SelectsTab    {...tabBaseProps} />}
          {activeTab === "login"      && <LoginTab      {...tabBaseProps} />}
          {activeTab === "stats" && (
            <StatsColorsTab
              t={t}
              lightColors={statsLightColors}
              darkColors={statsDarkColors}
              onLightChange={setStatsLightColors}
              onDarkChange={setStatsDarkColors}
            />
          )}
          {activeTab === "charts" && (
            <StatsChartsTab ref={chartsTabRef} />
          )}
        </div>
      </div>
    </div>
  );
}

function resolveStatsColors(cfg: Record<string, unknown> | undefined, prefix: string, defaults: string[]) {
  return defaults.map((def, i) => {
    const saved = cfg?.[`${prefix}${i}`];
    return typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved) ? saved : def;
  });
}

type StatsColorsTabProps = Readonly<{
  t: (k: string) => string;
  lightColors: string[];
  darkColors: string[];
  onLightChange: (colors: string[]) => void;
  onDarkChange: (colors: string[]) => void;
}>;

function StatsColorsTab({ t, lightColors, darkColors, onLightChange, onDarkChange }: StatsColorsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle icon={<BarChart2 className="w-4 h-4" />} title={t("config.sectionStats")} />
      <p className="text-sm text-muted-foreground">{t("config.statsColorsDesc")}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <ModeLabel mode="light" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {lightColors.map((color, i) => (
            <ColorPicker
              key={`light-chart-${i + 1}`}
              label={`${t("config.chartColor")} ${i + 1}`}
              value={color}
              onChange={(v) => onLightChange(lightColors.map((c, j) => j === i ? v : c))}
              prefixIcon={<span className="w-3 h-3 rounded-full inline-block border border-border/40" style={{ backgroundColor: color }} />}
            />
          ))}
          <button
            onClick={() => onLightChange([...DEFAULT_CHART_COLORS])}
            className="mt-1 self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            {t("config.resetColors")}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <ModeLabel mode="dark" lightLabel={t("config.modeLight")} darkLabel={t("config.modeDark")} />
          {darkColors.map((color, i) => (
            <ColorPicker
              key={`dark-chart-${i + 1}`}
              label={`${t("config.chartColor")} ${i + 1}`}
              value={color}
              onChange={(v) => onDarkChange(darkColors.map((c, j) => j === i ? v : c))}
              prefixIcon={<span className="w-3 h-3 rounded-full inline-block border border-border/40" style={{ backgroundColor: color }} />}
            />
          ))}
          <button
            onClick={() => onDarkChange([...DEFAULT_DARK_CHART_COLORS])}
            className="mt-1 self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            {t("config.resetColors")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

type SectionTitleProps = Readonly<{ icon: React.ReactNode; title: string }>;
function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      <span className="text-primary">{icon}</span>
      <h2 className="font-semibold text-base">{title}</h2>
    </div>
  );
}

type FieldProps = Readonly<{ label: string; children: React.ReactNode }>;
function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

type ModeLabelProps = Readonly<{ mode: "light" | "dark"; lightLabel: string; darkLabel: string }>;
function ModeLabel({ mode, lightLabel, darkLabel }: ModeLabelProps) {
  const modeClass = mode === "light"
    ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    : "bg-slate-800/10 text-slate-600 dark:bg-slate-700/30 dark:text-slate-300";
  const modeIcon = mode === "light" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />;
  const modeLabel = mode === "light" ? lightLabel : darkLabel;
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-md w-fit ${modeClass}`}>
      {modeIcon}
      {modeLabel}
    </div>
  );
}

type ColorPickerProps = Readonly<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefixIcon?: React.ReactNode;
}>;
function ColorPicker({ label, value, onChange, prefixIcon }: ColorPickerProps) {
  const safeValue = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000";
  return (
    <div className="flex items-center gap-3">
      <label
        aria-label={label}
        className="relative w-10 h-10 rounded-lg border border-border cursor-pointer shadow-sm hover:scale-105 transition-transform overflow-hidden flex-shrink-0"
        style={{ backgroundColor: safeValue }}
      >
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
      <div className="flex-1">
        <p className="text-sm font-medium flex items-center gap-1.5">
          {prefixIcon && <span className="text-muted-foreground">{prefixIcon}</span>}
          {label}
        </p>
        <p className="text-xs text-muted-foreground font-mono">{safeValue.toUpperCase()}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
        className="w-24 px-2 py-1.5 text-xs font-mono border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
      />
    </div>
  );
}

function contrastText(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1E293B" : "#FFFFFF";
}

/* ── ThemePreview ── */
type ThemePreviewProps = Readonly<{
  mode: "light" | "dark";
  primary: string; secondary: string; button: string; text: string; background: string;
  previewLabel: string;
}>;
function ThemePreview({ mode, primary, secondary, button, text, background, previewLabel }: ThemePreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {mode === "light" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        <span>{previewLabel}</span>
        <Monitor className="w-3.5 h-3.5 ml-auto" />
      </div>
      <div className="rounded-xl border overflow-hidden shadow-md text-[11px]"
        style={{ backgroundColor: background, color: text, borderColor: `${text}20` }}>
        <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: primary }}>
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <span className="font-semibold text-white text-[10px]">Mon Application</span>
        </div>
        <div className="flex" style={{ minHeight: 120 }}>
          <div className="w-20 flex flex-col gap-1 p-2"
            style={{ backgroundColor: `${text}08`, borderRight: `1px solid ${text}15` }}>
            {["Tableau de bord", "Articles", "Paramètres"].map((item, i) => (
              <div key={item} className="px-1.5 py-1 rounded text-[9px] truncate"
                style={i === 0 ? { backgroundColor: `${primary}20`, color: primary, fontWeight: 600 }
                              : { color: `${text}80` }}>
                {item}
              </div>
            ))}
          </div>
          <div className="flex-1 p-2 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-1.5">
              {([{ color: primary, label: "Indicateur 1", value: "1 240" }, { color: secondary, label: "Indicateur 2", value: "89 %" }]).map(({ color, label, value }) => (
                <div key={label} className="rounded-lg p-2"
                  style={{ backgroundColor: `${color}15`, borderLeft: `2px solid ${color}` }}>
                  <div className="text-[8px]" style={{ color: `${text}70` }}>{label}</div>
                  <div className="font-bold" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>
            <button className="self-start px-2 py-1 rounded text-white text-[9px] font-medium"
              style={{ backgroundColor: button }}>
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ButtonPreview ── */
type ButtonPreviewProps = Readonly<{
  mode: "light" | "dark";
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
  previewLabel: string;
  tFn: (key: string) => string;
}>;
function ButtonPreview({ mode, form, merged, previewLabel, tFn }: ButtonPreviewProps) {
  const bg = mode === "dark" ? PREVIEW_DARK_BG : PREVIEW_LIGHT_BG;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{previewLabel}</p>
      <div className="rounded-xl border border-border p-4 flex flex-col gap-3" style={{ backgroundColor: bg }}>
        <div className="flex flex-wrap gap-2">
          {BTN_DEFS.map(({ lightKey, darkKey, labelKey: btnLabel, icon }) => {
            const key = mode === "dark" ? darkKey : lightKey;
            const btnBg = pickColor(form, merged, key) || "#64748B";
            const color = contrastText(btnBg);
            return (
              <span key={key} role="img" aria-label={tFn(btnLabel)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm select-none"
                style={{ backgroundColor: btnBg, color }}>
                {icon}
                {tFn(btnLabel)}
              </span>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Classe CSS : <code className="bg-black/10 px-1 rounded">.btn-save</code>{" "}
          <code className="bg-black/10 px-1 rounded">.btn-create</code>{" "}
          <code className="bg-black/10 px-1 rounded">.btn-delete</code>…
        </p>
      </div>
    </div>
  );
}

/* ── TablePreview ── */
type TablePreviewProps = Readonly<{
  mode: "light" | "dark";
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
}>;
function TablePreview({ mode, form, merged }: TablePreviewProps) {
  const prefix = mode === "dark" ? "dark_" : "";
  const get = (k: string) => pickColor(form, merged, `${prefix}${k}`);

  const headerBg   = get("table_header_bg");
  const headerText = get("table_header_text");
  const rowHover   = get("table_row_hover");
  const border     = get("table_border");
  const text       = get("table_text");
  const bg         = mode === "dark" ? PREVIEW_DARK_BG : "#FFFFFF";

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm" style={{ borderColor: border, backgroundColor: bg }}>
      <table className="w-full text-[11px]" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: headerBg }}>
            {["Nom", "Rôle", "Statut"].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold"
                style={{ color: headerText, borderBottom: `1px solid ${border}` }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["Alice Dupont", "Bob Martin", "Claire Morel"].map((name, i) => (
            <tr key={name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ backgroundColor: hovered === i ? rowHover : "transparent", transition: "background 0.15s" }}>
              <td className="px-3 py-2" style={{ color: text, borderBottom: `1px solid ${border}` }}>{name}</td>
              <td className="px-3 py-2" style={{ color: text, borderBottom: `1px solid ${border}` }}>Admin</td>
              <td className="px-3 py-2" style={{ color: text, borderBottom: `1px solid ${border}` }}>Actif</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── BreadcrumbPreview ── */
type BreadcrumbPreviewProps = Readonly<{
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
  mode?: "light" | "dark";
}>;
function BreadcrumbPreview({ form, merged, mode = "light" }: BreadcrumbPreviewProps) {
  const prefix = mode === "dark" ? "dark_" : "";
  const get = (k: string) => pickColor(form, merged, `${prefix}${k}`);

  const bg        = get("breadcrumb_bg");
  const text      = get("breadcrumb_text");
  const link      = get("breadcrumb_link");
  const separator = get("breadcrumb_separator");
  const bodyBg    = mode === "dark" ? PREVIEW_DARK_BG : PREVIEW_LIGHT_BG;

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm" style={{ borderColor: `${bg}40` }}>
      <div className="px-6 py-3 flex items-center gap-1 text-sm" style={{ backgroundColor: bg }}>
        <span style={{ color: link, opacity: 0.85 }}>Administration</span>
        <span className="mx-1 text-xs" style={{ color: separator }}>/</span>
        <span style={{ color: link, opacity: 0.85 }}>Paramètres</span>
        <span className="mx-1 text-xs" style={{ color: separator }}>/</span>
        <span className="font-semibold" style={{ color: text }}>Configuration</span>
      </div>
      <div className="p-4 flex flex-col gap-2" style={{ backgroundColor: bodyBg }}>
        <div className="h-3 w-32 rounded" style={{ backgroundColor: `${text}20` }} />
        <div className="h-2 w-48 rounded" style={{ backgroundColor: `${text}15` }} />
        <div className="h-2 w-40 rounded" style={{ backgroundColor: `${text}10` }} />
      </div>
    </div>
  );
}

/* ── PaginationPreview ── */
type PaginationPreviewProps = Readonly<{
  mode: "light" | "dark";
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
  previewLabel: string;
}>;
function PaginationPreview({ mode, form, merged, previewLabel }: PaginationPreviewProps) {
  const prefix = mode === "dark" ? "dark_" : "";
  const get = (k: string) => pickColor(form, merged, `${prefix}${k}`);

  const bg         = get("pagination_bg");
  const text       = get("pagination_text");
  const activeBg   = get("pagination_active_bg");
  const activeText = get("pagination_active_text");
  const border     = get("pagination_border");
  const container  = mode === "dark" ? PREVIEW_DARK_BG : PREVIEW_LIGHT_BG;

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{previewLabel}</p>
      <div className="rounded-xl border border-border p-4" style={{ backgroundColor: container }}>
        <div className="flex items-center gap-1 flex-wrap">
          {["‹", "1", "2", "3", "...", "8", "›"].map((p, i) => {
            const isActive = p === "2";
            const isEllipsis = p === "...";
            let itemBg: string;
            if (isActive) {
              itemBg = activeBg;
            } else if (hovered === i && !isEllipsis) {
              itemBg = `${bg}cc`;
            } else {
              itemBg = bg;
            }
            return (
              <button
                key={p}
                type="button"
                tabIndex={isEllipsis ? -1 : 0}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={isEllipsis}
                disabled={isEllipsis}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-xs font-medium cursor-pointer transition-all select-none"
                style={{
                  backgroundColor: itemBg,
                  color: isActive ? activeText : text,
                  border: `1px solid ${isActive ? activeBg : border}`,
                  opacity: isEllipsis ? 0.5 : 1,
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── SelectPreview ── */
type SelectPreviewProps = Readonly<{
  mode: "light" | "dark";
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
  previewLabel: string;
}>;
function SelectPreview({ mode, form, merged, previewLabel }: SelectPreviewProps) {
  const prefix = mode === "dark" ? "dark_" : "";
  const get = (k: string) => pickColor(form, merged, `${prefix}${k}`);

  const bg          = get("select_bg");
  const border      = get("select_border");
  const text        = get("select_text");
  const focus       = get("select_focus");
  const optionHover = get("select_option_hover");
  const container   = mode === "dark" ? PREVIEW_DARK_BG : PREVIEW_LIGHT_BG;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Option A");
  const [hoveredOpt, setHoveredOpt] = useState<string | null>(null);

  const options = ["Option A", "Option B", "Option C"];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{previewLabel}</p>
      <div className="rounded-xl border border-border p-4 flex flex-col gap-3" style={{ backgroundColor: container }}>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${mode}-select-trigger`} className="text-xs font-medium" style={{ color: text }}>Sélect simple</label>
          <div className="relative">
            <button
              id={`${mode}-select-trigger`}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: bg,
                border: `1px solid ${open ? focus : border}`,
                color: text,
                boxShadow: open ? `0 0 0 2px ${focus}33` : "none",
              }}
            >
              <span>{selected}</span>
              <span style={{ color: text, opacity: 0.5, fontSize: 10 }}>▾</span>
            </button>
            {open && (
              <div className="absolute z-10 mt-1 w-full rounded-lg shadow-md overflow-hidden"
                style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setSelected(opt); setOpen(false); }}
                    onMouseEnter={() => setHoveredOpt(opt)}
                    onMouseLeave={() => setHoveredOpt(null)}
                    className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                    style={{
                      backgroundColor: hoveredOpt === opt ? optionHover : "transparent",
                      color: selected === opt ? focus : text,
                      fontWeight: selected === opt ? 600 : 400,
                    }}
                  >
                    {selected === opt && <span className="mr-1.5">✓</span>}
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium" style={{ color: text }}>Sélect multiple</div>
          <div className="flex flex-wrap gap-1 px-3 py-2 rounded-lg min-h-[36px]"
            style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
            {["Tag 1", "Tag 2"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ backgroundColor: `${focus}18`, color: focus }}>
                {tag} ×
              </span>
            ))}
            <span className="text-[10px] self-center ml-1" style={{ color: text, opacity: 0.4 }}>+ Ajouter…</span>
          </div>
        </div>
        <div className="text-[10px] font-medium px-2 py-1 rounded self-start"
          style={{ color: focus, backgroundColor: `${focus}18` }}>
          Focus : {focus.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

/* ── LoginPreview ── */
type LoginPreviewProps = Readonly<{ bgFrom: string; bgTo: string; accent: string; cardBg: string; previewLabel: string }>;
function LoginPreview({ bgFrom, bgTo, accent, cardBg, previewLabel }: LoginPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <KeyRound className="w-3.5 h-3.5" />
        <span>{previewLabel}</span>
        <Monitor className="w-3.5 h-3.5 ml-auto" />
      </div>
      <div className="rounded-xl overflow-hidden shadow-md text-[11px]"
        style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})`, padding: "16px" }}>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <div className="h-2 w-20 rounded mb-1.5" style={{ backgroundColor: "rgba(255,255,255,0.6)" }} />
            <div className="h-1.5 w-28 rounded" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
            <div className="h-1.5 w-24 rounded mt-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          </div>
          <div className="w-36 rounded-xl p-3 border border-white/20"
            style={{ backgroundColor: `color-mix(in srgb, ${cardBg} 10%, transparent)`, backdropFilter: "blur(8px)" }}>
            <div className="w-7 h-7 rounded-lg mx-auto mb-2 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 60%, ${PREVIEW_DARK_BG}))` }}>
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="h-1.5 w-16 rounded mx-auto mb-3" style={{ backgroundColor: "rgba(255,255,255,0.7)" }} />
            <div className="flex flex-col gap-1.5 mb-2">
              <div className="h-5 rounded-lg w-full border border-white/15" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
              <div className="h-5 rounded-lg w-full border border-white/15" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
            </div>
            <div className="h-5 rounded-lg w-full flex items-center justify-center gap-1"
              style={{ background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 60%, ${PREVIEW_DARK_BG}))` }}>
              <span className="text-white font-semibold" style={{ fontSize: 8 }}>Connexion</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap mt-1">
          {[{ label: "Début", color: bgFrom }, { label: "Fin", color: bgTo }, { label: "Accent", color: accent }, { label: "Carte", color: cardBg }].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}>
              <span className="w-2 h-2 rounded-full inline-block border border-white/30" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── FormPreview ── */
type FormPreviewProps = Readonly<{
  mode: "light" | "dark";
  form: Partial<AppConfigInterface>;
  merged: AppConfigInterface;
}>;
function FormPreview({ mode, form, merged }: FormPreviewProps) {
  const prefix = mode === "dark" ? "dark_" : "";
  const get = (k: string) => pickColor(form, merged, `${prefix}${k}`);

  const inputBg     = get("form_input_bg");
  const inputBorder = get("form_input_border");
  const labelColor  = get("form_label_color");
  const focusColor  = get("form_focus_color");
  const bg          = mode === "dark" ? PREVIEW_DARK_BG : PREVIEW_LIGHT_BG;
  const textColor   = mode === "dark" ? "#E2E8F0" : "#1E293B";

  const [focused, setFocused] = useState(false);

  return (
    <div className="rounded-xl border border-border p-4 flex flex-col gap-3" style={{ backgroundColor: bg }}>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${mode}-form-name`} className="text-xs font-medium" style={{ color: labelColor }}>Nom complet</label>
        <input
          id={`${mode}-form-name`}
          type="text"
          placeholder="ex. Jean Dupont"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="px-3 py-1.5 rounded-md text-xs outline-none transition-all"
          style={{
            backgroundColor: inputBg,
            border: `1px solid ${focused ? focusColor : inputBorder}`,
            boxShadow: focused ? `0 0 0 2px ${focusColor}33` : "none",
            color: textColor,
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${mode}-form-role`} className="text-xs font-medium" style={{ color: labelColor }}>Rôle</label>
        <select id={`${mode}-form-role`} className="px-3 py-1.5 rounded-md text-xs outline-none transition-all"
          style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textColor }}>
          <option>Administrateur</option>
          <option>Utilisateur</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${mode}-form-notes`} className="text-xs font-medium" style={{ color: labelColor }}>Notes</label>
        <textarea id={`${mode}-form-notes`} rows={2} placeholder="Commentaire…"
          className="px-3 py-1.5 rounded-md text-xs outline-none resize-none"
          style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: textColor }} />
      </div>
      <div className="text-[10px] font-medium px-2 py-1 rounded self-start"
        style={{ color: focusColor, backgroundColor: `${focusColor}18` }}>
        Focus : {focusColor.toUpperCase()}
      </div>
    </div>
  );
}

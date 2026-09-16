import { AppConfigInterface } from "@/types/configuration.types";

/** Hex (#RRGGBB) → "H S% L%" pour les variables shadcn/ui. */
function toHsl(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (delta) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / delta + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / delta + 2) / 6; break;
      case b: h = ((r - g) / delta + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Couleur texte contraste auto (hex → hex). */
function ct(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1E293B" : "#FFFFFF";
}

/**
 * Injecte dynamiquement les CSS variables + classes utilitaires dans <head>.
 * S'applique à toute l'application sans modifier les composants.
 *
 * Couvre :
 *  - Variables shadcn/ui (--primary, --banner, --destructive, --background…)
 *  - Variables boutons sémantiques (--btn-save-bg…) + classes .btn-*
 *  - Variables tableaux + CSS global pour tables (avec !important)
 *  - Variables formulaires + CSS global pour inputs/selects/textareas
 */
export function applyThemeConfig(config: AppConfigInterface) {
  if (typeof document === "undefined") return;

  const css = `
    /* ─────────────────────────────────────────────────────────
       VARIABLES GLOBALES (shadcn/ui + sémantiques)
    ───────────────────────────────────────────────────────── */
    :root {
      /* Thème shadcn/ui */
      --primary:            ${toHsl(config.light_primary)};
      --ring:               ${toHsl(config.light_primary)};
      --secondary:          ${toHsl(config.light_secondary)};
      --foreground:         ${toHsl(config.light_text)};
      --card-foreground:    ${toHsl(config.light_text)};
      --popover-foreground: ${toHsl(config.light_text)};
      --background:         ${toHsl(config.light_background)};
      --card:               ${toHsl(config.light_background)};

      /* --banner = couleur bouton principal (variant="default" du Button shadcn) */
      --banner:             ${toHsl(config.light_button)};

      /* --destructive = couleur bouton Supprimer */
      --destructive:        ${toHsl(config.btn_delete_bg)};

      /* ── Boutons sémantiques - mode clair ── */
      --btn-save-bg:        ${config.btn_save_bg};        --btn-save-text:        ${ct(config.btn_save_bg)};
      --btn-delete-bg:      ${config.btn_delete_bg};      --btn-delete-text:      ${ct(config.btn_delete_bg)};
      --btn-edit-bg:        ${config.btn_edit_bg};        --btn-edit-text:        ${ct(config.btn_edit_bg)};
      --btn-export-bg:      ${config.btn_export_bg};      --btn-export-text:      ${ct(config.btn_export_bg)};
      --btn-import-bg:      ${config.btn_import_bg};      --btn-import-text:      ${ct(config.btn_import_bg)};
      --btn-duplicate-bg:   ${config.btn_duplicate_bg};   --btn-duplicate-text:   ${ct(config.btn_duplicate_bg)};
      --btn-action-bg:      ${config.btn_action_bg};      --btn-action-text:      ${ct(config.btn_action_bg)};
      --btn-create-bg:      ${config.btn_create_bg};      --btn-create-text:      ${ct(config.btn_create_bg)};
      --btn-cancel-bg:      ${config.btn_cancel_bg};      --btn-cancel-text:      ${ct(config.btn_cancel_bg)};
      --btn-archive-bg:     ${config.btn_archive_bg};     --btn-archive-text:     ${ct(config.btn_archive_bg)};
      --btn-reset-bg:       ${config.btn_reset_bg};       --btn-reset-text:       ${ct(config.btn_reset_bg)};
      --btn-search-bg:      ${config.btn_search_bg};      --btn-search-text:      ${ct(config.btn_search_bg)};
      --btn-send-bg:        ${config.btn_send_bg};        --btn-send-text:        ${ct(config.btn_send_bg)};
      --btn-neutral-bg:     ${config.btn_neutral_bg};     --btn-neutral-text:     ${ct(config.btn_neutral_bg)};

      /* ── Champs Select - mode clair ── */
      --select-bg:           ${config.select_bg};
      --select-border:       ${config.select_border};
      --select-text:         ${config.select_text};
      --select-focus:        ${config.select_focus};
      --select-option-hover: ${config.select_option_hover};

      /* ── Breadcrumb - mode clair ── */
      --breadcrumb-bg:        ${config.breadcrumb_bg};
      --breadcrumb-text:      ${config.breadcrumb_text};
      --breadcrumb-link:      ${config.breadcrumb_link};
      --breadcrumb-separator: ${config.breadcrumb_separator};

      /* ── Pagination - mode clair ── */
      --pagination-bg:          ${config.pagination_bg};
      --pagination-text:        ${config.pagination_text};
      --pagination-active-bg:   ${config.pagination_active_bg};
      --pagination-active-text: ${config.pagination_active_text};
      --pagination-border:      ${config.pagination_border};

      /* ── Tableaux - mode clair ── */
      --table-header-bg:    ${config.table_header_bg};
      --table-header-text:  ${config.table_header_text};
      --table-row-hover:    ${config.table_row_hover};
      --table-border:       ${config.table_border};
      --table-text:         ${config.table_text};

      /* ── Formulaires - mode clair ── */
      --form-input-bg:      ${config.form_input_bg};
      --form-input-border:  ${config.form_input_border};
      --form-label:         ${config.form_label_color};
      --form-focus:         ${config.form_focus_color};

      /* ── Page de connexion ── */
      --login-bg-from:  ${config.login_bg_from};
      --login-bg-to:    ${config.login_bg_to};
      --login-accent:   ${config.login_accent};
      --login-card-bg:  ${config.login_card_bg};
    }

    /* ─────────────────────────────────────────────────────────
       MODE SOMBRE - overrides
    ───────────────────────────────────────────────────────── */
    .dark {
      --primary:            ${toHsl(config.dark_primary)};
      --ring:               ${toHsl(config.dark_primary)};
      --secondary:          ${toHsl(config.dark_secondary)};
      --foreground:         ${toHsl(config.dark_text)};
      --card-foreground:    ${toHsl(config.dark_text)};
      --popover-foreground: ${toHsl(config.dark_text)};
      --background:         ${toHsl(config.dark_background)};
      --card:               ${toHsl(config.dark_background)};
      --banner:             ${toHsl(config.dark_button)};
      --destructive:        ${toHsl(config.dark_btn_delete_bg)};

      /* Boutons sémantiques - mode sombre */
      --btn-save-bg:        ${config.dark_btn_save_bg};      --btn-save-text:        ${ct(config.dark_btn_save_bg)};
      --btn-delete-bg:      ${config.dark_btn_delete_bg};    --btn-delete-text:      ${ct(config.dark_btn_delete_bg)};
      --btn-edit-bg:        ${config.dark_btn_edit_bg};      --btn-edit-text:        ${ct(config.dark_btn_edit_bg)};
      --btn-export-bg:      ${config.dark_btn_export_bg};    --btn-export-text:      ${ct(config.dark_btn_export_bg)};
      --btn-import-bg:      ${config.dark_btn_import_bg};    --btn-import-text:      ${ct(config.dark_btn_import_bg)};
      --btn-duplicate-bg:   ${config.dark_btn_duplicate_bg}; --btn-duplicate-text:   ${ct(config.dark_btn_duplicate_bg)};
      --btn-action-bg:      ${config.dark_btn_action_bg};    --btn-action-text:      ${ct(config.dark_btn_action_bg)};
      --btn-create-bg:      ${config.dark_btn_create_bg};    --btn-create-text:      ${ct(config.dark_btn_create_bg)};
      --btn-cancel-bg:      ${config.dark_btn_cancel_bg};    --btn-cancel-text:      ${ct(config.dark_btn_cancel_bg)};
      --btn-archive-bg:     ${config.dark_btn_archive_bg};   --btn-archive-text:     ${ct(config.dark_btn_archive_bg)};
      --btn-reset-bg:       ${config.dark_btn_reset_bg};     --btn-reset-text:       ${ct(config.dark_btn_reset_bg)};
      --btn-search-bg:      ${config.dark_btn_search_bg};    --btn-search-text:      ${ct(config.dark_btn_search_bg)};
      --btn-send-bg:        ${config.dark_btn_send_bg};      --btn-send-text:        ${ct(config.dark_btn_send_bg)};
      --btn-neutral-bg:     ${config.dark_btn_neutral_bg};   --btn-neutral-text:     ${ct(config.dark_btn_neutral_bg)};

      /* Champs Select - mode sombre */
      --select-bg:           ${config.dark_select_bg};
      --select-border:       ${config.dark_select_border};
      --select-text:         ${config.dark_select_text};
      --select-focus:        ${config.dark_select_focus};
      --select-option-hover: ${config.dark_select_option_hover};

      /* Breadcrumb - mode sombre */
      --breadcrumb-bg:        ${config.dark_breadcrumb_bg};
      --breadcrumb-text:      ${config.dark_breadcrumb_text};
      --breadcrumb-link:      ${config.dark_breadcrumb_link};
      --breadcrumb-separator: ${config.dark_breadcrumb_separator};

      /* Pagination - mode sombre */
      --pagination-bg:          ${config.dark_pagination_bg};
      --pagination-text:        ${config.dark_pagination_text};
      --pagination-active-bg:   ${config.dark_pagination_active_bg};
      --pagination-active-text: ${config.dark_pagination_active_text};
      --pagination-border:      ${config.dark_pagination_border};

      /* Tableaux - mode sombre */
      --table-header-bg:    ${config.dark_table_header_bg};
      --table-header-text:  ${config.dark_table_header_text};
      --table-row-hover:    ${config.dark_table_row_hover};
      --table-border:       ${config.dark_table_border};
      --table-text:         ${config.dark_table_text};

      /* Formulaires - mode sombre */
      --form-input-bg:      ${config.dark_form_input_bg};
      --form-input-border:  ${config.dark_form_input_border};
      --form-label:         ${config.dark_form_label_color};
      --form-focus:         ${config.dark_form_focus_color};
    }

    /* ─────────────────────────────────────────────────────────
       CLASSES SÉMANTIQUES DE BOUTONS
       Usage : <button className="btn-save">…</button>
               <Button semantic="save">…</Button>
    ───────────────────────────────────────────────────────── */
    .btn-save      { background-color: var(--btn-save-bg) !important;      color: var(--btn-save-text) !important; }
    .btn-delete    { background-color: var(--btn-delete-bg) !important;    color: var(--btn-delete-text) !important; }
    .btn-edit      { background-color: var(--btn-edit-bg) !important;      color: var(--btn-edit-text) !important; }
    .btn-export    { background-color: var(--btn-export-bg) !important;    color: var(--btn-export-text) !important; }
    .btn-import    { background-color: var(--btn-import-bg) !important;    color: var(--btn-import-text) !important; }
    .btn-duplicate { background-color: var(--btn-duplicate-bg) !important; color: var(--btn-duplicate-text) !important; }
    .btn-action    { background-color: var(--btn-action-bg) !important;    color: var(--btn-action-text) !important; }
    .btn-create    { background-color: var(--btn-create-bg) !important;    color: var(--btn-create-text) !important; }
    .btn-cancel    { background-color: var(--btn-cancel-bg) !important;    color: var(--btn-cancel-text) !important; }
    .btn-archive   { background-color: var(--btn-archive-bg) !important;   color: var(--btn-archive-text) !important; }
    .btn-reset     { background-color: var(--btn-reset-bg) !important;     color: var(--btn-reset-text) !important; }
    .btn-search    { background-color: var(--btn-search-bg) !important;    color: var(--btn-search-text) !important; }
    .btn-send      { background-color: var(--btn-send-bg) !important;      color: var(--btn-send-text) !important; }
    .btn-neutral   { background-color: var(--btn-neutral-bg) !important;   color: var(--btn-neutral-text) !important; }

    .btn-save:hover, .btn-delete:hover, .btn-edit:hover, .btn-export:hover,
    .btn-import:hover, .btn-duplicate:hover, .btn-action:hover,
    .btn-create:hover, .btn-cancel:hover, .btn-archive:hover, .btn-reset:hover,
    .btn-search:hover, .btn-send:hover, .btn-neutral:hover {
      opacity: 0.88 !important;
    }

    /* ─────────────────────────────────────────────────────────
       BOUTONS - icône seule sur petit écran (< 640 px)
       + tooltip sur hover via attribut title
    ───────────────────────────────────────────────────────── */
    @media (max-width: 639px) {
      .btn-save, .btn-delete, .btn-edit, .btn-export, .btn-import,
      .btn-duplicate, .btn-action, .btn-create, .btn-cancel, .btn-archive,
      .btn-reset, .btn-search, .btn-send, .btn-neutral {
        font-size: 0 !important;
        padding-left:  0.5rem !important;
        padding-right: 0.5rem !important;
        min-width: 2.25rem;
        justify-content: center;
        position: relative;
      }
      /* Icônes SVG restent visibles */
      .btn-save svg, .btn-delete svg, .btn-edit svg, .btn-export svg,
      .btn-import svg, .btn-duplicate svg, .btn-action svg, .btn-create svg,
      .btn-cancel svg, .btn-archive svg, .btn-reset svg, .btn-search svg,
      .btn-send svg, .btn-neutral svg {
        font-size: initial;
      }
    }

    /* ─────────────────────────────────────────────────────────
       PAGINATION - appliquée aux composants shadcn/ui Pagination
    ───────────────────────────────────────────────────────── */
    [data-slot="pagination-link"],
    nav[aria-label="pagination"] a,
    nav[aria-label="pagination"] button {
      background-color: var(--pagination-bg) !important;
      color:            var(--pagination-text) !important;
      border-color:     var(--pagination-border) !important;
    }
    [data-slot="pagination-link"][aria-current="page"],
    [data-slot="pagination-link"].bg-secondary,
    nav[aria-label="pagination"] a[aria-current="page"] {
      background-color: var(--pagination-active-bg) !important;
      color:            var(--pagination-active-text) !important;
      border-color:     var(--pagination-active-bg) !important;
    }
    nav[aria-label="pagination"] a:hover,
    nav[aria-label="pagination"] button:hover {
      opacity: 0.85 !important;
    }

    /* ─────────────────────────────────────────────────────────
       CHAMPS SELECT PERSONNALISÉS (SearchableSelect + MultiSelect)
    ───────────────────────────────────────────────────────── */
    [data-searchable-select] button,
    [data-multi-select] button[data-trigger] {
      background-color: var(--select-bg, #FFFFFF) !important;
      border-color:     var(--select-border, #CBD5E1) !important;
      color:            var(--select-text, #1E293B) !important;
    }
    [data-searchable-select] [data-dropdown],
    [data-multi-select] [data-dropdown] {
      background-color: var(--select-bg, #FFFFFF) !important;
      border-color:     var(--select-border, #CBD5E1) !important;
    }
    [data-searchable-select] [data-option]:hover,
    [data-multi-select] [data-option]:hover {
      background-color: var(--select-option-hover, #F1F5F9) !important;
    }

    /* ─────────────────────────────────────────────────────────
       TABLEAUX - appliqué globalement à tous les <table>
       !important override les classes Tailwind hardcodées
       (text-gray-*, hover:bg-gray-*, divide-gray-*, border-gray-*)
    ───────────────────────────────────────────────────────── */
    table thead,
    table thead tr,
    table thead th,
    table thead td {
      background-color: var(--table-header-bg) !important;
      color:            var(--table-header-text) !important;
      border-color:     var(--table-border) !important;
    }

    /* Cellules du corps */
    table tbody td,
    table tbody th {
      color:        var(--table-text) !important;
      border-color: var(--table-border) !important;
    }

    /* Séparateurs entre lignes (divide-y, divide-gray-*) */
    table tbody tr,
    table tbody tr + tr,
    table tbody > :not([hidden]) ~ :not([hidden]) {
      border-color: var(--table-border) !important;
    }

    /* Survol de ligne */
    table tbody tr:hover > td,
    table tbody tr:hover > th {
      background-color: var(--table-row-hover) !important;
      color:            var(--table-text) !important;
    }

    /* Bordures générales */
    table td, table th {
      border-color: var(--table-border) !important;
    }

    /* ─────────────────────────────────────────────────────────
       FORMULAIRES - inputs, selects, textareas
       Cible à la fois les éléments natifs et les composants
       shadcn/ui (qui utilisent data-slot="input" etc.)
    ───────────────────────────────────────────────────────── */

    /* Fond et bordure des champs */
    input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="range"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]),
    select,
    textarea,
    [data-slot="input"],
    [data-slot="select-trigger"],
    [data-slot="textarea"] {
      background-color: var(--form-input-bg) !important;
      border-color:     var(--form-input-border) !important;
      color:            var(--form-label) !important;
    }

    /* ─────────────────────────────────────────────────────────
       BREADCRUMB - barre de navigation en haut des pages
    ───────────────────────────────────────────────────────── */
    [data-breadcrumb-wrapper] {
      background-color: var(--breadcrumb-bg) !important;
    }
    [data-slot="breadcrumb-page"] {
      color: var(--breadcrumb-text) !important;
    }
    [data-slot="breadcrumb-link"] {
      color: var(--breadcrumb-link) !important;
    }
    [data-slot="breadcrumb-link"]:hover {
      color: var(--breadcrumb-text) !important;
    }
    [data-slot="breadcrumb-separator"] {
      color: var(--breadcrumb-separator) !important;
    }

    /* ─────────────────────────────────────────────────────────
       PAGE DE CONNEXION - inputs focus avec accent
    ───────────────────────────────────────────────────────── */
    .login-input:focus {
      background-color: rgba(255,255,255,0.10) !important;
      border-color: color-mix(in srgb, var(--login-accent, #10B981) 50%, transparent) !important;
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--login-accent, #10B981) 20%, transparent) !important;
    }

    /* Focus */
    input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="range"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):focus,
    input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="range"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):focus-within,
    select:focus,
    textarea:focus,
    [data-slot="input"]:focus,
    [data-slot="input"]:focus-within,
    [data-slot="select-trigger"]:focus,
    [data-slot="select-trigger"][data-state="open"],
    [data-slot="textarea"]:focus {
      border-color:  var(--form-focus) !important;
      outline-color: var(--form-focus) !important;
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--form-focus) 20%, transparent) !important;
    }

    /* Labels */
    [data-slot="form-label"],
    label:not([class*="checkbox"]):not([class*="radio"]):not([class*="switch"]):not([class*="toggle"]) {
      color: var(--form-label) !important;
    }
  `;

  let el = document.getElementById("app-theme-config");
  if (!el) {
    el = document.createElement("style");
    el.id = "app-theme-config";
    document.head.appendChild(el);
  }
  el.textContent = css;

  // Titre de l'onglet
  if (config.app_name) document.title = config.app_name;

  // Favicon
  if (config.favicon_url) {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = config.favicon_url;
  }
}

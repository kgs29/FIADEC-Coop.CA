export interface AppConfigInterface {
  id: number;
  app_name: string;
  app_description: string;
  app_logo: string | null;
  app_logo_url: string | null;
  favicon: string | null;
  favicon_url: string | null;
  // Thème
  light_primary: string;   light_secondary: string;  light_button: string;
  light_text: string;      light_background: string;
  dark_primary: string;    dark_secondary: string;   dark_button: string;
  dark_text: string;       dark_background: string;
  // Boutons - mode clair
  btn_save_bg: string;     btn_delete_bg: string;    btn_edit_bg: string;
  btn_export_bg: string;   btn_import_bg: string;    btn_duplicate_bg: string;
  btn_action_bg: string;   btn_create_bg: string;    btn_cancel_bg: string;
  btn_archive_bg: string;  btn_reset_bg: string;    btn_search_bg: string;
  btn_send_bg: string;     btn_neutral_bg: string;
  // Boutons - mode sombre
  dark_btn_save_bg: string;     dark_btn_delete_bg: string;    dark_btn_edit_bg: string;
  dark_btn_export_bg: string;   dark_btn_import_bg: string;    dark_btn_duplicate_bg: string;
  dark_btn_action_bg: string;   dark_btn_create_bg: string;    dark_btn_cancel_bg: string;
  dark_btn_archive_bg: string;  dark_btn_reset_bg: string;     dark_btn_search_bg: string;
  dark_btn_send_bg: string;     dark_btn_neutral_bg: string;
  // Selects - mode clair
  select_bg: string;     select_border: string;     select_text: string;
  select_focus: string;  select_option_hover: string;
  // Selects - mode sombre
  dark_select_bg: string;     dark_select_border: string;     dark_select_text: string;
  dark_select_focus: string;  dark_select_option_hover: string;
  // Breadcrumb - mode clair
  breadcrumb_bg: string;    breadcrumb_text: string;
  breadcrumb_link: string;  breadcrumb_separator: string;
  // Breadcrumb - mode sombre
  dark_breadcrumb_bg: string;    dark_breadcrumb_text: string;
  dark_breadcrumb_link: string;  dark_breadcrumb_separator: string;
  // Pagination - mode clair
  pagination_bg: string;     pagination_text: string;
  pagination_active_bg: string;  pagination_active_text: string;  pagination_border: string;
  // Pagination - mode sombre
  dark_pagination_bg: string;     dark_pagination_text: string;
  dark_pagination_active_bg: string;  dark_pagination_active_text: string;  dark_pagination_border: string;
  // Tableaux - mode clair
  table_header_bg: string; table_header_text: string;
  table_row_hover: string; table_border: string;     table_text: string;
  // Tableaux - mode sombre
  dark_table_header_bg: string; dark_table_header_text: string;
  dark_table_row_hover: string; dark_table_border: string; dark_table_text: string;
  // Formulaires - mode clair
  form_input_bg: string;   form_input_border: string;
  form_label_color: string; form_focus_color: string;
  // Formulaires - mode sombre
  dark_form_input_bg: string;   dark_form_input_border: string;
  dark_form_label_color: string; dark_form_focus_color: string;
  // Page de connexion
  login_bg_from: string;
  login_bg_to: string;
  login_accent: string;
  login_card_bg: string;
  updated_at: string;
}

export const DEFAULT_CONFIG: Omit<AppConfigInterface, 'id' | 'app_logo' | 'app_logo_url' | 'favicon' | 'favicon_url' | 'updated_at'> = {
  app_name: 'Mon Application',
  app_description: '',
  light_primary: '#0D9488',   light_secondary: '#3B82F6',  light_button: '#0D9488',
  light_text: '#1E293B',      light_background: '#F8FAFC',
  dark_primary: '#2DD4BF',    dark_secondary: '#60A5FA',   dark_button: '#2DD4BF',
  dark_text: '#F1F5F9',       dark_background: '#0F172A',
  btn_save_bg: '#0D9488',     btn_delete_bg: '#EF4444',    btn_edit_bg: '#3B82F6',
  btn_export_bg: '#10B981',   btn_import_bg: '#8B5CF6',    btn_duplicate_bg: '#F59E0B',
  btn_action_bg: '#64748B',   btn_create_bg: '#0D9488',    btn_cancel_bg: '#94A3B8',
  btn_archive_bg: '#64748B',  btn_reset_bg: '#F59E0B',    btn_search_bg: '#3B82F6',
  btn_send_bg: '#4F46E5',     btn_neutral_bg: '#71717A',
  dark_btn_save_bg: '#0D9488',     dark_btn_delete_bg: '#EF4444',    dark_btn_edit_bg: '#3B82F6',
  dark_btn_export_bg: '#10B981',   dark_btn_import_bg: '#8B5CF6',    dark_btn_duplicate_bg: '#F59E0B',
  dark_btn_action_bg: '#475569',   dark_btn_create_bg: '#0D9488',    dark_btn_cancel_bg: '#475569',
  dark_btn_archive_bg: '#475569',  dark_btn_reset_bg: '#D97706',     dark_btn_search_bg: '#2563EB',
  dark_btn_send_bg: '#4338CA',     dark_btn_neutral_bg: '#52525B',
  select_bg: '#FFFFFF',     select_border: '#CBD5E1',   select_text: '#1E293B',
  select_focus: '#0D9488',  select_option_hover: '#F1F5F9',
  dark_select_bg: '#1E293B',     dark_select_border: '#334155',   dark_select_text: '#E2E8F0',
  dark_select_focus: '#2DD4BF',  dark_select_option_hover: '#334155',
  breadcrumb_bg: '#0D9488',  breadcrumb_text: '#FFFFFF',
  breadcrumb_link: '#CCFBF1', breadcrumb_separator: '#99F6E4',
  dark_breadcrumb_bg: '#134E4A',    dark_breadcrumb_text: '#F0FDFA',
  dark_breadcrumb_link: '#5EEAD4',  dark_breadcrumb_separator: '#2DD4BF',
  pagination_bg: '#FFFFFF',     pagination_text: '#374151',
  pagination_active_bg: '#0D9488',  pagination_active_text: '#FFFFFF',  pagination_border: '#E2E8F0',
  dark_pagination_bg: '#1E293B',     dark_pagination_text: '#CBD5E1',
  dark_pagination_active_bg: '#2DD4BF',  dark_pagination_active_text: '#0F172A',  dark_pagination_border: '#334155',
  table_header_bg: '#F1F5F9', table_header_text: '#475569',
  table_row_hover: '#F8FAFC', table_border: '#E2E8F0',     table_text: '#1E293B',
  dark_table_header_bg: '#1E293B', dark_table_header_text: '#94A3B8',
  dark_table_row_hover: '#334155', dark_table_border: '#334155', dark_table_text: '#E2E8F0',
  form_input_bg: '#FFFFFF',   form_input_border: '#CBD5E1',
  form_label_color: '#374151', form_focus_color: '#0D9488',
  dark_form_input_bg: '#1E293B',   dark_form_input_border: '#334155',
  dark_form_label_color: '#CBD5E1', dark_form_focus_color: '#2DD4BF',
  login_bg_from: '#064E3B',
  login_bg_to: '#134E4A',
  login_accent: '#10B981',
  login_card_bg: '#FFFFFF',
};

import { describe, it, expect, beforeEach } from 'vitest'
import { applyThemeConfig } from './applyTheme'
import type { AppConfigInterface } from '@/types/configuration.types'

const hex = '#1A2B3C'
const makeConfig = (overrides: Partial<AppConfigInterface> = {}): AppConfigInterface => ({
  light_primary: hex, light_secondary: hex, light_text: hex, light_background: hex,
  light_button: hex, dark_primary: hex, dark_secondary: hex, dark_text: hex,
  dark_background: hex, dark_button: hex, btn_save_bg: hex, btn_delete_bg: hex,
  btn_edit_bg: hex, btn_export_bg: hex, btn_import_bg: hex, btn_duplicate_bg: hex,
  btn_action_bg: hex, btn_create_bg: hex, btn_cancel_bg: hex, btn_archive_bg: hex,
  btn_reset_bg: hex, btn_search_bg: hex, btn_send_bg: hex, btn_neutral_bg: hex,
  dark_btn_save_bg: hex, dark_btn_delete_bg: hex, dark_btn_edit_bg: hex,
  dark_btn_export_bg: hex, dark_btn_import_bg: hex, dark_btn_duplicate_bg: hex,
  dark_btn_action_bg: hex, dark_btn_create_bg: hex, dark_btn_cancel_bg: hex,
  dark_btn_archive_bg: hex, dark_btn_reset_bg: hex, dark_btn_search_bg: hex,
  dark_btn_send_bg: hex, dark_btn_neutral_bg: hex,
  select_bg: hex, select_border: hex, select_text: hex, select_focus: hex, select_option_hover: hex,
  dark_select_bg: hex, dark_select_border: hex, dark_select_text: hex, dark_select_focus: hex, dark_select_option_hover: hex,
  breadcrumb_bg: hex, breadcrumb_text: hex, breadcrumb_link: hex, breadcrumb_separator: hex,
  dark_breadcrumb_bg: hex, dark_breadcrumb_text: hex, dark_breadcrumb_link: hex, dark_breadcrumb_separator: hex,
  pagination_bg: hex, pagination_text: hex, pagination_active_bg: hex, pagination_active_text: hex, pagination_border: hex,
  dark_pagination_bg: hex, dark_pagination_text: hex, dark_pagination_active_bg: hex, dark_pagination_active_text: hex, dark_pagination_border: hex,
  table_header_bg: hex, table_header_text: hex, table_row_hover: hex, table_border: hex, table_text: hex,
  dark_table_header_bg: hex, dark_table_header_text: hex, dark_table_row_hover: hex, dark_table_border: hex, dark_table_text: hex,
  form_input_bg: hex, form_input_border: hex, form_label_color: hex, form_focus_color: hex,
  dark_form_input_bg: hex, dark_form_input_border: hex, dark_form_label_color: hex, dark_form_focus_color: hex,
  login_bg_from: hex, login_bg_to: hex, login_accent: hex, login_card_bg: hex,
  app_name: 'TestApp', favicon_url: '',
  ...overrides,
} as unknown as AppConfigInterface)

describe('applyThemeConfig', () => {
  beforeEach(() => {
    document.getElementById('app-theme-config')?.remove()
  })

  it('injecte un élément <style> dans le <head>', () => {
    applyThemeConfig(makeConfig())
    expect(document.getElementById('app-theme-config')).toBeTruthy()
  })

  it('met à jour le titre de l\'onglet si app_name est fourni', () => {
    applyThemeConfig(makeConfig({ app_name: 'MonApp' } as unknown))
    expect(document.title).toBe('MonApp')
  })

  it('réutilise l\'élément existant au deuxième appel', () => {
    applyThemeConfig(makeConfig())
    applyThemeConfig(makeConfig())
    expect(document.querySelectorAll('#app-theme-config').length).toBe(1)
  })

  it('le CSS contient des variables --primary', () => {
    applyThemeConfig(makeConfig())
    const el = document.getElementById('app-theme-config')!
    expect(el.textContent).toContain('--primary')
  })
})

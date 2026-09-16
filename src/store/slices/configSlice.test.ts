import { describe, it, expect } from 'vitest'
import configSlice, { setConfig } from './configSlice'
import type { AppConfigInterface } from '@/types/configuration.types'

const reducer = configSlice.reducer

const mockConfig: AppConfigInterface = {
  id: 1,
  app_name: 'TestApp',
  app_description: 'Description de test',
  app_logo: null,
  favicon: null,
  primary_color: '#6366f1',
  secondary_color: '#22c55e',
  background_color_light: '#ffffff',
  background_color_dark: '#000000',
  text_color_light: '#111111',
  text_color_dark: '#eeeeee',
  sidebar_color_light: '#f5f5f5',
  sidebar_color_dark: '#1a1a1a',
  header_color_light: '#ffffff',
  header_color_dark: '#111111',
  card_color_light: '#ffffff',
  card_color_dark: '#222222',
  border_color_light: '#e5e7eb',
  border_color_dark: '#374151',
}

describe('configSlice', () => {
  it('initialise avec config null', () => {
    const state = reducer(undefined, { type: 'unknown' })
    expect(state.config).toBeNull()
  })

  it('setConfig définit la configuration', () => {
    const state = reducer(undefined, setConfig(mockConfig))
    expect(state.config).toEqual(mockConfig)
  })

  it('setConfig remplace la configuration existante', () => {
    let state = reducer(undefined, setConfig(mockConfig))
    const updatedConfig = { ...mockConfig, app_name: 'NewApp' }
    state = reducer(state, setConfig(updatedConfig))
    expect(state.config?.app_name).toBe('NewApp')
  })

  it('le nom du slice est "config"', () => {
    expect(configSlice.name).toBe('config')
  })

  it('expose setConfig comme action creator', () => {
    expect(typeof setConfig).toBe('function')
    const action = setConfig(mockConfig)
    expect(action.type).toBe('config/setConfig')
    expect(action.payload).toEqual(mockConfig)
  })
})

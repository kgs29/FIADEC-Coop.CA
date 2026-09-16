import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { bulkDelete, bulkArchive, duplicateItem, importFile, exportFromApi } from './bulkApi'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  vi.stubGlobal('localStorage', {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('bulkDelete', () => {
  it('fait un POST vers bulk-delete avec les ids', async () => {
    mockFetch.mockResolvedValue({ ok: true })
    await bulkDelete('auth/users', ['1', '2'])
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/users/bulk-delete/'),
      expect.objectContaining({ method: 'POST' })
    )
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.ids).toEqual(['1', '2'])
  })

  it('lance une erreur si la réponse n\'est pas ok', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    await expect(bulkDelete('auth/users', ['1'])).rejects.toThrow('Bulk delete failed')
  })
})

describe('bulkArchive', () => {
  it('fait un POST vers bulk-archive avec les ids', async () => {
    mockFetch.mockResolvedValue({ ok: true })
    await bulkArchive('auth/roles', ['3', '4'])
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/roles/bulk-archive/'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('lance une erreur si la réponse n\'est pas ok', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    await expect(bulkArchive('auth/roles', ['1'])).rejects.toThrow('Bulk archive failed')
  })
})

describe('duplicateItem', () => {
  it('fait un POST vers duplicate et retourne le JSON', async () => {
    const mockData = { id: 99, name: 'Copie' }
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) })
    const result = await duplicateItem('auth/roles', '5')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/roles/5/duplicate/'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual(mockData)
  })

  it('lance une erreur si la réponse n\'est pas ok', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    await expect(duplicateItem('auth/roles', '5')).rejects.toThrow('Duplicate failed')
  })
})

describe('importFile', () => {
  it('fait un POST multipart vers import et retourne le JSON', async () => {
    const mockData = { created: 3, errors: [] }
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) })
    const file = new File(['name\nAlice'], 'data.csv', { type: 'text/csv' })
    const result = await importFile('auth/users', file)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/users/import/'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(result.created).toBe(3)
  })

  it('lance une erreur si la réponse n\'est pas ok', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    const file = new File([''], 'empty.csv')
    await expect(importFile('auth/users', file)).rejects.toThrow('Import failed')
  })
})

describe('exportFromApi', () => {
  it('fait un GET vers export avec les params', async () => {
    const mockBlob = new Blob(['data'])
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(mockBlob) })
    const result = await exportFromApi('auth/users', ['1', '2'], 'csv')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('auth/users/export/'),
      expect.any(Object)
    )
    expect(mockFetch.mock.calls[0][0]).toContain('format=csv')
    expect(result).toBeInstanceOf(Blob)
  })

  it('lance une erreur si la réponse n\'est pas ok', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    await expect(exportFromApi('auth/users', [], 'xlsx')).rejects.toThrow('Export failed')
  })

  it('inclut les ids dans les query params', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) })
    await exportFromApi('auth/users', ['10', '20'], 'csv')
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('ids=10')
    expect(url).toContain('ids=20')
  })
})

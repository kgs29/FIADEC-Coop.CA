import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateBreadcrumbs } from './breackcrumbs-config'

// Mock the breadcrumb data with more comprehensive patterns matching the actual structure
vi.mock('@/data/breakcrumbdatas', () => ({
  breadcrumbConfig: {
    '^/admin/references$': 'Dashboard.sidebar.dataManagement',
    '^/admin/references/domains$': 'domains',
    '^/admin/references/domains/add$': 'add_domain',
    '^/admin/references/domains/[^/]+/edit$': 'edit_domain',
    '^/admin/references/domains/(?!add$|!formal-notice|[^/]+?/edit$)([^/]+?)(?:/)?$': 'domain_details',
    '^/admin/references/categories$': 'catgories',
    '^/admin/references/categories/add$': 'add_catgorie',
    '^/admin/references/categories/[^/]+/edit$': 'edit_catgorie',
    '^/admin/references/categories/(?!add$|!formal-notice|[^/]+?/edit$)([^/]+?)(?:/)?$': 'category_details',
    '^/admin/administration/users$': 'users',
    '^/admin/administration/users/add$': 'add_user',
    '^/admin/administration/users/[^/]+/edit$': 'edit_user',
    '^/admin/administration/users/(?!add$|!formal-notice|[^/]+?/edit$)([^/]+?)(?:/)?$': 'user_details',
    '^/admin/administration/rules$': 'groupes',
    '^/admin/administration/rules/add$': 'add_rule',
    '^/admin/administration/rules/[^/]+/edit$': 'edit_rule',
    '^/admin$': 'dashboard',
    '^/admin/profil$': 'myProfil',
    '^/editors$': 'editors',
    '^/editors/collecte$': 'collecte',
    '^/editors/collecte/[^/]+$': 'form',
    '^/editors/collecte/[^/]+?/details': 'form_details_content',
    '^/editors/collecte/[^/]+?/edit': 'form_update_content',
    '^/admin/indexes$': 'index',
    '^/admin/indexes/add$': 'add_index',
    '^/admin/indexes/[^/]+/edit$': 'edit_index',
    '^/admin/indexes/[^/]+/configure$': 'formula_page',
    '^/admin/indexes/(?!add$|!formal-notice|[^/]+?/edit$)([^/]+?)(?:/)?$': 'index_details',
    '^/admin/international-index-values$': 'internationalIndexValuesList',
    '^/admin/international-index-values/(?!add$|!formal-notice|[^/]+?/edit$)([^/]+?)(?:/)?$': 'internationalIndexValuesDetails',
    '^/admin/international-index-values/add$': 'internationalIndexValuesAdd',
    '^/admin/international-index-values/[^/]+?/edit$': 'internationalIndexValuesEdit',
  },
}))

describe('generateBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty array when location is null', () => {
    const result = generateBreadcrumbs(null)
    expect(result).toEqual([])
    expect(result.length).toBe(0)
  })

  it('should return empty array when location is undefined', () => {
    const result = generateBreadcrumbs(undefined as any)
    expect(result).toEqual([])
  })

  it('should return empty array when location is empty string', () => {
    const result = generateBreadcrumbs('')
    expect(result).toEqual([])
  })

  it('should generate breadcrumb for admin dashboard', () => {
    const result = generateBreadcrumbs('/admin')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toEqual({
      title: 'dashboard',
      path: '/admin',
    })
  })

  it('should generate breadcrumbs for references page', () => {
    const result = generateBreadcrumbs('/admin/references')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'Dashboard.sidebar.dataManagement')).toBeTruthy()
  })

  it('should generate breadcrumbs for domains list', () => {
    const result = generateBreadcrumbs('/admin/references/domains')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'domains')).toBeTruthy()
  })

  it('should generate breadcrumbs for add domain page', () => {
    const result = generateBreadcrumbs('/admin/references/domains/add')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'add_domain')).toBeTruthy()
  })

  it('should generate breadcrumbs for edit domain page', () => {
    const result = generateBreadcrumbs('/admin/references/domains/123/edit')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'edit_domain')).toBeTruthy()
  })

  it('should generate breadcrumbs for domain details page', () => {
    const result = generateBreadcrumbs('/admin/references/domains/domain123')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'domain_details')).toBeTruthy()
  })

  it('should generate breadcrumbs for users list', () => {
    const result = generateBreadcrumbs('/admin/administration/users')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'users')).toBeTruthy()
  })

  it('should generate breadcrumbs for add user page', () => {
    const result = generateBreadcrumbs('/admin/administration/users/add')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'add_user')).toBeTruthy()
  })

  it('should generate breadcrumbs for edit user page', () => {
    const result = generateBreadcrumbs('/admin/administration/users/456/edit')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'edit_user')).toBeTruthy()
  })

  it('should generate breadcrumbs for user details page', () => {
    const result = generateBreadcrumbs('/admin/administration/users/user123')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'user_details')).toBeTruthy()
  })

  it('should generate breadcrumbs for rules list', () => {
    const result = generateBreadcrumbs('/admin/administration/rules')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'groupes')).toBeTruthy()
  })

  it('should generate breadcrumbs for editors page', () => {
    const result = generateBreadcrumbs('/editors')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'editors')).toBeTruthy()
  })

  it('should generate breadcrumbs for collecte page', () => {
    const result = generateBreadcrumbs('/editors/collecte')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'collecte')).toBeTruthy()
  })

  it('should generate breadcrumbs for form page', () => {
    const result = generateBreadcrumbs('/editors/collecte/form789')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'form')).toBeTruthy()
  })

  it('should generate breadcrumbs for form details page', () => {
    const result = generateBreadcrumbs('/editors/collecte/form123/details')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'form_details_content')).toBeTruthy()
  })

  it('should generate breadcrumbs for form edit page', () => {
    const result = generateBreadcrumbs('/editors/collecte/form456/edit')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'form_update_content')).toBeTruthy()
  })

  it('should generate breadcrumbs for indexes list', () => {
    const result = generateBreadcrumbs('/admin/indexes')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'index')).toBeTruthy()
  })

  it('should generate breadcrumbs for add index page', () => {
    const result = generateBreadcrumbs('/admin/indexes/add')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'add_index')).toBeTruthy()
  })

  it('should generate breadcrumbs for edit index page', () => {
    const result = generateBreadcrumbs('/admin/indexes/index123/edit')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'edit_index')).toBeTruthy()
  })

  it('should generate breadcrumbs for formula page', () => {
    const result = generateBreadcrumbs('/admin/indexes/index456/configure')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'formula_page')).toBeTruthy()
  })

  it('should generate breadcrumbs for index details page', () => {
    const result = generateBreadcrumbs('/admin/indexes/index789')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'index_details')).toBeTruthy()
  })

  it('should generate breadcrumbs for international index values list', () => {
    const result = generateBreadcrumbs('/admin/international-index-values')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'internationalIndexValuesList')).toBeTruthy()
  })

  it('should generate breadcrumbs for international index values details', () => {
    const result = generateBreadcrumbs('/admin/international-index-values/value123')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'internationalIndexValuesDetails')).toBeTruthy()
  })

  it('should generate breadcrumbs for add international index value', () => {
    const result = generateBreadcrumbs('/admin/international-index-values/add')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'internationalIndexValuesAdd')).toBeTruthy()
  })

  it('should generate breadcrumbs for edit international index value', () => {
    const result = generateBreadcrumbs('/admin/international-index-values/value456/edit')
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(b => b.title === 'internationalIndexValuesEdit')).toBeTruthy()
  })

  it('should have correct structure for breadcrumbs', () => {
    const result = generateBreadcrumbs('/admin')
    result.forEach(breadcrumb => {
      expect(breadcrumb).toHaveProperty('title')
      expect(breadcrumb).toHaveProperty('path')
      expect(typeof breadcrumb.title).toBe('string')
      expect(typeof breadcrumb.path).toBe('string')
    })
  })

  it('should preserve path order', () => {
    const result = generateBreadcrumbs('/admin/references/domains')
    const paths = result.map(b => b.path)
    expect(paths.length).toBeGreaterThan(0)
    
    // Check that paths are in order
    for (let i = 1; i < paths.length; i++) {
      expect(paths[i].startsWith(paths[i - 1])).toBeTruthy()
    }
  })

  it('should handle path with single segment', () => {
    const result = generateBreadcrumbs('/admin')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('should return array type', () => {
    const result = generateBreadcrumbs('/admin')
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('should not contain duplicate breadcrumbs', () => {
    const result = generateBreadcrumbs('/admin/references/domains')
    const paths = result.map(b => b.path)
    const uniquePaths = new Set(paths)
    expect(uniquePaths.size).toBe(paths.length)
  })

  it('should handle trailing slashes', () => {
    const result = generateBreadcrumbs('/admin/')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('should handle multiple slashes', () => {
    const result = generateBreadcrumbs('/admin//references')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('should handle complex nested path', () => {
    const result = generateBreadcrumbs('/admin/references/domains/123/edit')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('each breadcrumb should have non-empty title', () => {
    const result = generateBreadcrumbs('/admin/references')
    result.forEach(breadcrumb => {
      expect(breadcrumb.title.length).toBeGreaterThan(0)
    })
  })

  it('each breadcrumb should have non-empty path', () => {
    const result = generateBreadcrumbs('/admin/references')
    result.forEach(breadcrumb => {
      expect(breadcrumb.path.length).toBeGreaterThan(0)
    })
  })

  it('should handle path that does not match any pattern', () => {
    const result = generateBreadcrumbs('/unknown/path/that/does/not/exist')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
    expect(result.length).toBe(0)
  })

  it('should handle path with special characters', () => {
    const result = generateBreadcrumbs('/admin/references/domains/domain-with-dashes_and_underscores')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('should handle numeric segments in path', () => {
    const result = generateBreadcrumbs('/admin/administration/users/123')
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })

  it('should handle very long path segments', () => {
    const longSegment = 'a'.repeat(100)
    const result = generateBreadcrumbs(`/admin/references/domains/${longSegment}`)
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBeTruthy()
  })
})

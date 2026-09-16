import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetItemActivityLogQuery: vi.fn(),
}))

vi.mock('@/components/AuditTimeline', () => ({
  AuditTimeline: ({ auditLog }: { auditLog: unknown[] }) => (
    <div data-testid="audit-timeline">entries:{auditLog.length}</div>
  ),
}))

import { useGetItemActivityLogQuery } from '@/store/apis/auth/authentication.api'
import { ItemActivityHistory } from './ItemActivityHistory'

describe('ItemActivityHistory', () => {
  it('affiche un spinner pendant le chargement', () => {
    vi.mocked(useGetItemActivityLogQuery).mockReturnValue({ data: undefined, isFetching: true } as ReturnType<typeof useGetItemActivityLogQuery>)
    const { container } = render(<ItemActivityHistory modelName="project" objectId="1" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('affiche l\'AuditTimeline avec les données', () => {
    vi.mocked(useGetItemActivityLogQuery).mockReturnValue({
      data: { results: [{ timestamp: '2024-01-01', action: 'create', changes: {}, user: null, object_repr: null }] },
      isFetching: false,
    } as ReturnType<typeof useGetItemActivityLogQuery>)
    render(<ItemActivityHistory modelName="project" objectId="1" />)
    expect(screen.getByTestId('audit-timeline')).toBeInTheDocument()
    expect(screen.getByText('entries:1')).toBeInTheDocument()
  })

  it('affiche une timeline vide si pas de résultats', () => {
    vi.mocked(useGetItemActivityLogQuery).mockReturnValue({
      data: { results: [] },
      isFetching: false,
    } as ReturnType<typeof useGetItemActivityLogQuery>)
    render(<ItemActivityHistory modelName="project" objectId="42" />)
    expect(screen.getByText('entries:0')).toBeInTheDocument()
  })
})

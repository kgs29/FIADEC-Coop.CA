import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuditAction } from '@/types/base'
import { AuditTimeline } from './AuditTimeline'

// mock translations and dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@/locale/i18n', () => ({
  default: {
    language: 'en',
  },
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => (
    <div data-testid="badge" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('../ui/label', () => ({
  Label: ({ children, className }: any) => (
    <label data-testid="label" className={className}>
      {children}
    </label>
  ),
}))

vi.mock('../ui/separator', () => ({
  Separator: () => <div data-testid="separator" />,
}))

vi.mock('lucide-react', () => ({
  User: ({ className }: any) => (
    <svg data-testid="user-icon" className={className} />
  ),
}))

// sample audit actions used across tests
const sampleActions: AuditAction[] = [
  {
    action_type: 'create',
    action_date: new Date('2023-01-01T10:00:00Z').toString(),
    user_id: 'user123',
    reason: 'Initial creation',
    changes: [],
  },
  {
    action_type: 'create',
    action_date: new Date('2023-02-02T12:30:00Z').toString(),
    user_id: '',
    reason: '',
    changes: [
      { field: 'name', old_value: 'old', new_value: 'new' },
      { field: 'status', old_value: '', new_value: '' },
    ],
  },
]

describe('AuditTimeline Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders container even with empty log', () => {
    const { container } = render(<AuditTimeline auditLog={[]} />)
    expect(container.querySelector('[data-testid="audit-timeline"]')).toBeTruthy()
    // no entries should be rendered
    expect(container.querySelectorAll('[data-testid="audit-timeline"] > div > div').length).toBe(0)
  })

  it('displays create action with user, reason and formatted date', () => {
    render(<AuditTimeline auditLog={[sampleActions[0]]} />)

    // label title
    // translation of action type is just the key
    expect(screen.getByText('create')).toBeTruthy()
    expect(screen.getByText('Initial creation')).toBeTruthy()
    // user icon and id should appear
    expect(screen.getByTestId('user-icon')).toBeTruthy()
    expect(screen.getByText('user123')).toBeTruthy()
    // date formatting contains year
    expect(screen.getByText(/2023/)).toBeTruthy()
    // plus icon for create
    expect(screen.getByText('➕')).toBeTruthy()
  })

  it('falls back for unknown action types and shows change details with dashes for empty values', () => {
    render(<AuditTimeline auditLog={[sampleActions[1]]} />)

   
    // since user_id is falsy, user icon should not be present
    expect(screen.queryByTestId('user-icon')).toBeNull()
    // changes are rendered
    expect(screen.getByText('name :')).toBeTruthy()
    expect(screen.getByText('old')).toBeTruthy()
    expect(screen.getByText('new')).toBeTruthy()
    // second change uses dashes for empty strings
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
  })
})

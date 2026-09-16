import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetActivityLogsQuery: () => ({ data: undefined, isLoading: false }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import LogsContentPage from './logs-content-page'

describe('LogsContentPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<LogsContentPage onCountUpdate={vi.fn()} />)
    expect(container.firstChild).toBeTruthy()
  })
})

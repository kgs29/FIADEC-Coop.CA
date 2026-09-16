import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetDevicesQuery: () => ({ data: undefined, isLoading: false, isFetching: false, refetch: vi.fn() }),
  useRevokeDeviceMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import DevicesContentPage from './devices-content-page'

describe('DevicesContentPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<DevicesContentPage onCountUpdate={vi.fn()} />)
    expect(container.firstChild).toBeTruthy()
  })
})

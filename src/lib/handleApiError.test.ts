import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleApiError } from './handleApiError'

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn() },
}))

import { toast } from 'react-hot-toast'

const mockRouter = { push: vi.fn() } as any
const t = (key: string) => key

describe('handleApiError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirige vers /login et affiche toast pour status 401', () => {
    handleApiError({ status: 401, data: {} }, mockRouter, t)
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
    expect(toast.error).toHaveBeenCalled()
  })

  it('affiche les erreurs de champ pour status 400 avec data sans .error', () => {
    const err = {
      status: 400,
      data: { username: ['Ce champ est requis.'] },
    }
    handleApiError(err, mockRouter, t)
    expect(toast.error).toHaveBeenCalledWith('username: Ce champ est requis.')
  })

  it('affiche l\'erreur string pour champ string dans 400', () => {
    const err = { status: 400, data: { email: 'Email invalide' } }
    handleApiError(err, mockRouter, t)
    expect(toast.error).toHaveBeenCalledWith('email: Email invalide')
  })

  it('affiche data.error.message si présent', () => {
    const err = { status: 422, data: { error: { message: 'Erreur métier' } } }
    handleApiError(err, mockRouter, t)
    expect(toast.error).toHaveBeenCalledWith('Erreur métier')
  })

  it('affiche error_occurred par défaut si aucun cas ne correspond', () => {
    handleApiError({ status: 500, data: {} }, mockRouter, t)
    expect(toast.error).toHaveBeenCalledWith('error_occurred')
  })

  it('ne redirige pas pour status différent de 401', () => {
    handleApiError({ status: 500, data: {} }, mockRouter, t)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('gère une erreur sans status ni data', () => {
    handleApiError({}, mockRouter, t)
    expect(toast.error).toHaveBeenCalled()
  })
})

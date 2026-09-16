import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp'

describe('InputOTP', () => {
  it('rend sans erreur', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    )
    expect(container.firstChild).toBeTruthy()
  })
})

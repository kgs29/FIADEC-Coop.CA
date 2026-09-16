import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import useOnClickOutside from './useOnclickOutside'
import { fireEvent } from '@testing-library/react'

describe('useOnClickOutside', () => {
  it('appelle handler quand on clique en dehors de la ref', () => {
    const handler = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>
      ref.current = container
      useOnClickOutside({ ref, handler })
    })

    const outside = document.createElement('span')
    document.body.appendChild(outside)
    fireEvent.mouseDown(outside)
    expect(handler).toHaveBeenCalledTimes(1)
    document.body.removeChild(outside)
    document.body.removeChild(container)
  })

  it("n'appelle pas handler quand on clique à l'intérieur de la ref", () => {
    const handler = vi.fn()
    const container = document.createElement('div')
    const inside = document.createElement('button')
    container.appendChild(inside)
    document.body.appendChild(container)

    renderHook(() => {
      const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>
      ref.current = container
      useOnClickOutside({ ref, handler })
    })

    fireEvent.mouseDown(inside)
    expect(handler).not.toHaveBeenCalled()
    document.body.removeChild(container)
  })

  it('appelle handler sur touchstart en dehors', () => {
    const handler = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>
      ref.current = container
      useOnClickOutside({ ref, handler })
    })

    const outside = document.createElement('span')
    document.body.appendChild(outside)
    fireEvent.touchStart(outside)
    expect(handler).toHaveBeenCalledTimes(1)
    document.body.removeChild(outside)
    document.body.removeChild(container)
  })

  it('retire les listeners au démontage', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const handler = vi.fn()

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      useOnClickOutside({ ref, handler })
    })

    unmount()
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
    removeSpy.mockRestore()
  })
})

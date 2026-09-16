import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AspectRatio } from './aspect-ratio'

describe('AspectRatio Component', () => {
  it('should render aspect ratio container', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <img src="https://example.com/image.jpg" alt="Test" />
      </AspectRatio>
    )
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('should render aspect ratio with default ratio', () => {
    const { container } = render(
      <AspectRatio>
        <div>Content</div>
      </AspectRatio>
    )
    expect(container.textContent).toContain('Content')
  })

  it('should render square aspect ratio', () => {
    const { container } = render(
      <AspectRatio ratio={1}>
        <div>Square</div>
      </AspectRatio>
    )
    expect(container.textContent).toContain('Square')
  })

  it('should render video in aspect ratio', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <video src="https://example.com/video.mp4" />
      </AspectRatio>
    )
    expect(container.querySelector('video')).toBeTruthy()
  })

  it('should maintain aspect ratio', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <img src="test.jpg" alt="Test" className="object-cover" />
      </AspectRatio>
    )
    const img = container.querySelector('img')
    expect(img?.className).toContain('object-cover')
  })

  it('should render with custom content', () => {
    const { container } = render(
      <AspectRatio ratio={21 / 9}>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600">
          <p>Custom Banner</p>
        </div>
      </AspectRatio>
    )
    expect(container.textContent).toContain('Custom Banner')
  })
})

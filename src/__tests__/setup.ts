// Setup file for vitest
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { afterEach, expect, vi } from "vitest";

expect.extend(matchers);
// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: vi.fn(() => []),
})) as any;

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Initialize i18next for tests
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    resources: {
      en: {
        translation: {
          cancel: "Cancel",
          loading: "Loading",
          delete: "Delete",
          edit: "Edit",
          ictdeveloppement_index: "ICT Development Index",
          "globalThis CyberSecurity Index": "globalThis CyberSecurity Index",
          some_indices: "Some Indices",
        },
      },
      fr: {
        translation: {
          cancel: "Annuler",
          loading: "Chargement",
          delete: "Supprimer",
          edit: "Modifier",
          ictdeveloppement_index: "Indice de Développement TIC",
          "globalThis CyberSecurity Index": "Indice Mondial de Cybersécurité",
          some_indices: "Certains Indices",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (used by useIsMobile, Sonner, Sidebar, etc.)
if (typeof globalThis.window !== "undefined" && !globalThis.window.matchMedia) {
  Object.defineProperty(globalThis.window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Fix Radix UI + JSDOM issues
if (typeof globalThis.window !== "undefined") {
  globalThis.window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  globalThis.window.HTMLElement.prototype.setPointerCapture = vi.fn();
  globalThis.window.HTMLElement.prototype.releasePointerCapture = vi.fn();

  // Polyfill requestSubmit if missing (JSDOM does not implement it yet)
  if (!HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function (this: HTMLFormElement) {
      if (this.checkValidity()) {
        const event = new Event("submit", { bubbles: true, cancelable: true });
        this.dispatchEvent(event);
      }
    };
  }

  // Polyfill scrollIntoView (JSDOM does not implement it)
  if (!HTMLElement.prototype.scrollIntoView) {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  }

  // Mock Canvas getContext (fix TextCaptcha.test.tsx - jsdom defines it but throws)
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    writable: true,
    value: vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray() })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => [] as any),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createPattern: vi.fn(() => null),
      font: "",
      textAlign: "left" as CanvasTextAlign,
      textBaseline: "alphabetic" as CanvasTextBaseline,
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      globalAlpha: 1,
    })),
  });

  // Mock window.location to avoid "Not implemented: navigation" errors
  const originalLocation = globalThis.window.location;
  // @ts-expect-error -- ignore type error for test setup
  delete globalThis.window.location;
  globalThis.window.location = {
    ...originalLocation,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    href: "http://localhost/",
  } as any;
}

// globalThis mock for Response.clone if needed (RTK Query tests)
if (typeof Response !== "undefined" && !Response.prototype.clone) {
  Response.prototype.clone = function (this: Response) {
    return this;
  };
}

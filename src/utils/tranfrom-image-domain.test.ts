// transformImageUrl.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { transformImageUrl } from "./tranfrom-image-domain";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const MOCK_IMAGE_DOMAIN = "https://cdn.example.com";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_IMAGE_DOMAIN", MOCK_IMAGE_DOMAIN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("transformImageUrl", () => {
  it("transforme une URL simple avec un chemin", () => {
    const result = transformImageUrl("https://original.com/images/photo.jpg");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/images/photo.jpg`);
  });

  it("supprime le slash initial du pathname", () => {
    const result = transformImageUrl("https://original.com/assets/logo.png");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/assets/logo.png`);
  });

  it("gère un chemin imbriqué en plusieurs niveaux", () => {
    const result = transformImageUrl("https://original.com/a/b/c/image.webp");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/a/b/c/image.webp`);
  });

  it("ignore les query params et ne garde que le pathname", () => {
    const result = transformImageUrl("https://original.com/img/pic.jpg?v=123&size=large");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/img/pic.jpg`);
  });

  it("ignore le hash et ne garde que le pathname", () => {
    const result = transformImageUrl("https://original.com/img/pic.jpg#section");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/img/pic.jpg`);
  });

  it("gère un chemin à un seul segment", () => {
    const result = transformImageUrl("https://original.com/image.jpg");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/image.jpg`);
  });

  it("gère une URL avec un port", () => {
    const result = transformImageUrl("https://original.com:8080/media/file.png");
    expect(result).toBe(`${MOCK_IMAGE_DOMAIN}/media/file.png`);
  });

  it("utilise bien la variable d'environnement NEXT_PUBLIC_IMAGE_DOMAIN", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_DOMAIN", "https://autre-cdn.io");
    const result = transformImageUrl("https://original.com/img/test.jpg");
    expect(result).toBe("https://autre-cdn.io/img/test.jpg");
  });

  it("lève une erreur si l'URL est invalide", () => {
    expect(() => transformImageUrl("pas-une-url")).toThrow();
  });

  it("lève une erreur si l'URL est vide", () => {
    expect(() => transformImageUrl("")).toThrow();
  });
});
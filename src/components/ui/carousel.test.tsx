// carousel.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    "data-slot": dataSlot,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    "data-slot"?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-slot={dataSlot}
      data-testid={dataSlot}
    >
      {children}
    </button>
  ),
}));

// Mock Embla Carousel
const mockScrollPrev = vi.fn();
const mockScrollNext = vi.fn();
const mockCanScrollPrev = vi.fn(() => false);
const mockCanScrollNext = vi.fn(() => true);
const mockOn = vi.fn();
const mockOff = vi.fn();

const mockApi = {
  scrollPrev: mockScrollPrev,
  scrollNext: mockScrollNext,
  canScrollPrev: mockCanScrollPrev,
  canScrollNext: mockCanScrollNext,
  on: mockOn,
  off: mockOff,
};

const mockCarouselRef = vi.fn();

vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => [mockCarouselRef, mockApi]),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderCarousel = (props = {}) =>
  render(
    <Carousel {...props}>
      <CarouselContent>
        <CarouselItem data-testid="slide-1">Slide 1</CarouselItem>
        <CarouselItem data-testid="slide-2">Slide 2</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Carousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanScrollPrev.mockReturnValue(false);
    mockCanScrollNext.mockReturnValue(true);
    mockOn.mockImplementation((event, cb) => {
      if (event === "reInit" || event === "select") cb(mockApi);
    });
  });

  // ── Carousel (Root) ──────────────────────────────────────────────────────────
  describe("Carousel (Root)", () => {
    it("rend un élément avec role='region'", () => {
      renderCarousel();
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("porte aria-roledescription='carousel'", () => {
      renderCarousel();
      expect(screen.getByRole("region")).toHaveAttribute(
        "aria-roledescription",
        "carousel"
      );
    });

    it("porte data-slot='carousel'", () => {
      renderCarousel();
      expect(screen.getByRole("region")).toHaveAttribute(
        "data-slot",
        "carousel"
      );
    });

    it("applique la classe 'relative'", () => {
      renderCarousel();
      expect(screen.getByRole("region")).toHaveClass("relative");
    });

    it("accepte une className personnalisée", () => {
      renderCarousel({ className: "my-carousel" });
      expect(screen.getByRole("region")).toHaveClass("my-carousel");
    });

    it("appelle setApi si fourni", () => {
      const setApi = vi.fn();
      renderCarousel({ setApi });
      expect(setApi).toHaveBeenCalledWith(mockApi);
    });

    it("enregistre les listeners 'reInit' et 'select' sur l'api", () => {
      renderCarousel();
      expect(mockOn).toHaveBeenCalledWith("reInit", expect.any(Function));
      expect(mockOn).toHaveBeenCalledWith("select", expect.any(Function));
    });
  });

  // ── Navigation clavier ───────────────────────────────────────────────────────
  describe("Navigation clavier", () => {
    it("appelle scrollPrev sur ArrowLeft", () => {
      renderCarousel();
      fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" });
      expect(mockScrollPrev).toHaveBeenCalledTimes(1);
    });

    it("appelle scrollNext sur ArrowRight", () => {
      renderCarousel();
      fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" });
      expect(mockScrollNext).toHaveBeenCalledTimes(1);
    });

    it("ignore les autres touches", () => {
      renderCarousel();
      fireEvent.keyDown(screen.getByRole("region"), { key: "Enter" });
      expect(mockScrollPrev).not.toHaveBeenCalled();
      expect(mockScrollNext).not.toHaveBeenCalled();
    });
  });

  // ── Orientation ─────────────────────────────────────────────────────────────
  describe("Orientation", () => {
    it("utilise l'axe 'x' par défaut (horizontal)", async () => {
      const useEmblaCarousel = (await import("embla-carousel-react")).default;
      renderCarousel();
      expect(useEmblaCarousel).toHaveBeenCalledWith(
        expect.objectContaining({ axis: "x" }),
        undefined
      );
    });

    it("utilise l'axe 'y' si orientation='vertical'", async () => {
      const useEmblaCarousel = (await import("embla-carousel-react")).default;
      renderCarousel({ orientation: "vertical" });
      expect(useEmblaCarousel).toHaveBeenCalledWith(
        expect.objectContaining({ axis: "y" }),
        undefined
      );
    });
  });

  // ── CarouselContent ──────────────────────────────────────────────────────────
  describe("CarouselContent", () => {
    it("porte data-slot='carousel-content'", () => {
      renderCarousel();
      expect(
        document.querySelector("[data-slot='carousel-content']")
      ).toBeInTheDocument();
    });

    it("applique la classe overflow-hidden sur le wrapper", () => {
      renderCarousel();
      const wrapper = document.querySelector("[data-slot='carousel-content']");
      expect(wrapper).toHaveClass("overflow-hidden");
    });

    it("applique -ml-4 en mode horizontal", () => {
      render(
        <Carousel>
          <CarouselContent data-testid="content">
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      expect(screen.getByTestId("content")).toHaveClass("-ml-4");
    });

    it("applique -mt-4 et flex-col en mode vertical", () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent data-testid="content">
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      expect(screen.getByTestId("content")).toHaveClass("-mt-4", "flex-col");
    });

    it("applique la classe flex", () => {
      render(
        <Carousel>
          <CarouselContent data-testid="content">
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      expect(screen.getByTestId("content")).toHaveClass("flex");
    });

    it("accepte une className personnalisée", () => {
      render(
        <Carousel>
          <CarouselContent className="custom" data-testid="content">
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      expect(screen.getByTestId("content")).toHaveClass("custom");
    });
  });

  // ── CarouselItem ─────────────────────────────────────────────────────────────
  describe("CarouselItem", () => {
    it("porte role='group'", () => {
      renderCarousel();
      const slides = screen.getAllByRole("group");
      expect(slides.length).toBeGreaterThan(0);
    });

    it("porte aria-roledescription='slide'", () => {
      renderCarousel();
      const slides = screen.getAllByRole("group");
      slides.forEach((slide) => {
        expect(slide).toHaveAttribute("aria-roledescription", "slide");
      });
    });

    it("porte data-slot='carousel-item'", () => {
      renderCarousel();
      const items = document.querySelectorAll("[data-slot='carousel-item']");
      expect(items.length).toBe(2);
    });

    it("applique pl-4 en mode horizontal", () => {
      renderCarousel();
      const slides = screen.getAllByRole("group");
      expect(slides[0]).toHaveClass("pl-4");
    });

    it("applique pt-4 en mode vertical", () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem data-testid="slide">Slide</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      expect(screen.getByTestId("slide")).toHaveClass("pt-4");
    });

    it("applique les classes de base min-w-0 shrink-0 grow-0 basis-full", () => {
      renderCarousel();
      const slides = screen.getAllByRole("group");
      expect(slides[0]).toHaveClass("min-w-0", "shrink-0", "grow-0", "basis-full");
    });

    it("accepte une className personnalisée", () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem className="custom" data-testid="slide">
              Slide
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      expect(screen.getByTestId("slide")).toHaveClass("custom");
    });

    it("affiche son contenu", () => {
      renderCarousel();
      expect(screen.getByText("Slide 1")).toBeInTheDocument();
      expect(screen.getByText("Slide 2")).toBeInTheDocument();
    });
  });

  // ── CarouselPrevious ─────────────────────────────────────────────────────────
  describe("CarouselPrevious", () => {
    it("porte data-slot='carousel-previous'", () => {
      renderCarousel();
      expect(screen.getByTestId("carousel-previous")).toBeInTheDocument();
    });

    it("est désactivé si canScrollPrev=false", () => {
      mockCanScrollPrev.mockReturnValue(false);
      renderCarousel();
      expect(screen.getByTestId("carousel-previous")).toBeDisabled();
    });

    it("est activé si canScrollPrev=true", () => {
      mockCanScrollPrev.mockReturnValue(true);
      mockOn.mockImplementation((event, cb) => cb(mockApi));
      renderCarousel();
      expect(screen.getByTestId("carousel-previous")).not.toBeDisabled();
    });

    it("appelle scrollPrev au clic", () => {
      mockCanScrollPrev.mockReturnValue(true);
      mockOn.mockImplementation((event, cb) => cb(mockApi));
      renderCarousel();
      fireEvent.click(screen.getByTestId("carousel-previous"));
      expect(mockScrollPrev).toHaveBeenCalledTimes(1);
    });

    it("affiche le texte sr-only 'Previous slide'", () => {
      renderCarousel();
      expect(
        screen.getByText("previous_slide")
      ).toHaveClass("sr-only");
    });

    it("applique les classes de positionnement horizontal par défaut", () => {
      renderCarousel();
      expect(screen.getByTestId("carousel-previous")).toHaveClass(
        "-left-12",
        "top-1/2"
      );
    });

    it("applique les classes de positionnement vertical", () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        </Carousel>
      );
      expect(screen.getByTestId("carousel-previous")).toHaveClass(
        "-top-12",
        "rotate-90"
      );
    });

    it("accepte une className personnalisée", () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="custom-prev" />
        </Carousel>
      );
      expect(screen.getByTestId("carousel-previous")).toHaveClass("custom-prev");
    });
  });

  // ── CarouselNext ─────────────────────────────────────────────────────────────
  describe("CarouselNext", () => {
    it("porte data-slot='carousel-next'", () => {
      renderCarousel();
      expect(screen.getByTestId("carousel-next")).toBeInTheDocument();
    });

    it("est activé si canScrollNext=true", () => {
      mockCanScrollNext.mockReturnValue(true);
      mockOn.mockImplementation((event, cb) => cb(mockApi));
      renderCarousel();
      expect(screen.getByTestId("carousel-next")).not.toBeDisabled();
    });

    it("est désactivé si canScrollNext=false", () => {
      mockCanScrollNext.mockReturnValue(false);
      mockOn.mockImplementation((event, cb) => cb(mockApi));
      renderCarousel();
      expect(screen.getByTestId("carousel-next")).toBeDisabled();
    });

    it("appelle scrollNext au clic", () => {
      mockCanScrollNext.mockReturnValue(true);
      mockOn.mockImplementation((event, cb) => cb(mockApi));
      renderCarousel();
      fireEvent.click(screen.getByTestId("carousel-next"));
      expect(mockScrollNext).toHaveBeenCalledTimes(1);
    });

    it("affiche le texte sr-only 'Next slide'", () => {
      renderCarousel();
      expect(
        screen.getByText("next_slide")
      ).toHaveClass("sr-only");
    });

    it("applique les classes de positionnement horizontal par défaut", () => {
      renderCarousel();
      expect(screen.getByTestId("carousel-next")).toHaveClass(
        "-right-12",
        "top-1/2"
      );
    });

    it("applique les classes de positionnement vertical", () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      );
      expect(screen.getByTestId("carousel-next")).toHaveClass(
        "-bottom-12",
        "rotate-90"
      );
    });

    it("accepte une className personnalisée", () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
          <CarouselNext className="custom-next" />
        </Carousel>
      );
      expect(screen.getByTestId("carousel-next")).toHaveClass("custom-next");
    });
  });

  // ── useCarousel hors contexte ────────────────────────────────────────────────
  describe("useCarousel hors contexte", () => {
    it("lève une erreur si utilisé hors de <Carousel>", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() =>
        render(<CarouselContent><CarouselItem>Slide</CarouselItem></CarouselContent>)
      ).toThrow("useCarousel must be used within a <Carousel />");

      consoleError.mockRestore();
    });
  });
});
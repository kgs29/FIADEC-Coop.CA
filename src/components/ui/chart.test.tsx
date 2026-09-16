// chart.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartStyle,
} from "./chart";
import type { ChartConfig } from "./chart";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const basicConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "#4f46e5" },
  profit: { label: "Profit", color: "#10b981" },
};

const themeConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    theme: { light: "#4f46e5", dark: "#818cf8" },
  },
};

const iconConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#4f46e5",
    icon: () => <svg data-testid="custom-icon" />,
  },
};

const makePayload = (overrides = {}) => ({
  dataKey: "revenue",
  name: "revenue",
  value: 1200,
  color: "#4f46e5",
  payload: { fill: "#4f46e5" },
  ...overrides,
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ChartContainer", () => {
  it("porte data-slot='chart'", () => {
    render(
      <ChartContainer config={basicConfig} data-testid="chart">
        <div />
      </ChartContainer>,
    );
    expect(screen.getByTestId("chart")).toHaveAttribute("data-slot", "chart");
  });

  it("porte data-chart avec le bon id", () => {
    render(
      <ChartContainer config={basicConfig} id="my-chart" data-testid="chart">
        <div />
      </ChartContainer>,
    );
    expect(screen.getByTestId("chart")).toHaveAttribute(
      "data-chart",
      "chart-my-chart",
    );
  });

  it("génère un id unique si aucun id n'est fourni", () => {
    render(
      <ChartContainer config={basicConfig} data-testid="chart">
        <div />
      </ChartContainer>,
    );
    const attr = screen.getByTestId("chart").getAttribute("data-chart");
    expect(attr).toMatch(/^chart-/);
  });

  it("accepte une className personnalisée", () => {
    render(
      <ChartContainer
        config={basicConfig}
        className="custom"
        data-testid="chart"
      >
        <div />
      </ChartContainer>,
    );
    expect(screen.getByTestId("chart")).toHaveClass("custom");
  });

  it("rend le ResponsiveContainer", () => {
    render(
      <ChartContainer config={basicConfig}>
        <div data-testid="chart-child" />
      </ChartContainer>,
    );
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("rend les enfants dans le ResponsiveContainer", () => {
    render(
      <ChartContainer config={basicConfig}>
        <div data-testid="chart-child" />
      </ChartContainer>,
    );
    expect(screen.getByTestId("chart-child")).toBeInTheDocument();
  });

  it("rend ChartStyle si config contient des couleurs", () => {
    const { container } = render(
      <ChartContainer config={basicConfig} id="test">
        <div />
      </ChartContainer>,
    );
    expect(container.querySelector("style")).toBeInTheDocument();
  });

  it("ne rend pas ChartStyle si config est vide", () => {
    const { container } = render(
      <ChartContainer config={{}}>
        <div />
      </ChartContainer>,
    );
    expect(container.querySelector("style")).toBeNull();
  });
});

// ── ChartStyle ────────────────────────────────────────────────────────────────

describe("ChartStyle", () => {
  it("retourne null si aucune couleur dans la config", () => {
    const { container } = render(
      <ChartStyle id="chart-1" config={{ revenue: { label: "Revenue" } }} />,
    );
    expect(container.querySelector("style")).toBeNull();
  });

  it("génère les variables CSS pour une couleur directe", () => {
    const { container } = render(
      <ChartStyle id="chart-1" config={basicConfig} />,
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-revenue: #4f46e5");
    expect(style?.innerHTML).toContain("--color-profit: #10b981");
  });

  it("génère les variables CSS pour un thème light et dark", () => {
    const { container } = render(
      <ChartStyle id="chart-1" config={themeConfig} />,
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-revenue: #4f46e5");
    expect(style?.innerHTML).toContain("--color-revenue: #818cf8");
  });

  it("inclut le sélecteur .dark pour le thème dark", () => {
    const { container } = render(
      <ChartStyle id="chart-1" config={themeConfig} />,
    );
    expect(container.querySelector("style")?.innerHTML).toContain(".dark");
  });

  it("inclut le data-chart dans le sélecteur CSS", () => {
    const { container } = render(
      <ChartStyle id="chart-abc" config={basicConfig} />,
    );
    expect(container.querySelector("style")?.innerHTML).toContain(
      "[data-chart=chart-abc]",
    );
  });
});

// ── ChartTooltipContent ───────────────────────────────────────────────────────

describe("ChartTooltipContent", () => {
  const renderTooltip = (props = {}) =>
    render(
      <ChartContainer config={basicConfig}>
        <ChartTooltipContent
          active={true}
          payload={[makePayload()]}
          {...props}
        />
      </ChartContainer>,
    );


  it("retourne null si payload est vide", () => {
    const { container } = render(
      <ChartContainer config={basicConfig}>
        <ChartTooltipContent active={true} payload={[]} />
      </ChartContainer>,
    );
    expect(container.querySelector(".border-border\\/50")).toBeNull();
  });



  it("masque le label si hideLabel=true", () => {
    renderTooltip({ hideLabel: true, label: "revenue" });
    // Le label "Revenue" de la config ne doit pas apparaître dans la zone label
    const labels = screen.queryAllByText("Revenue");
    // Le label du nom d'item peut encore apparaître, mais pas le tooltipLabel
    expect(labels.length).toBeLessThanOrEqual(1);
  });

  it("affiche le label via labelFormatter", () => {
    renderTooltip({
      label: "revenue",
      labelFormatter: (val: unknown) => (
        <span data-testid="custom-label">{String(val)}</span>
      ),
    });
    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });

  it("masque l'indicateur si hideIndicator=true", () => {
    const { container } = renderTooltip({ hideIndicator: true });
    expect(container.querySelector(".h-2\\.5.w-2\\.5")).toBeNull();
  });

  it("utilise le formatter personnalisé", () => {
    renderTooltip({
      formatter: () => <span data-testid="custom-formatter">custom</span>,
    });
    expect(screen.getByTestId("custom-formatter")).toBeInTheDocument();
  });

  it("affiche l'icône de config si présente", () => {
    render(
      <ChartContainer config={iconConfig}>
        <ChartTooltipContent
          active={true}
          payload={[makePayload({ dataKey: "revenue", name: "revenue" })]}
        />
      </ChartContainer>,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("affiche plusieurs items du payload", () => {
    render(
      <ChartContainer config={basicConfig}>
        <ChartTooltipContent
          active={true}
          payload={[
            makePayload({ dataKey: "revenue", name: "revenue", value: 100 }),
            makePayload({ dataKey: "profit", name: "profit", value: 200 }),
          ]}
        />
      </ChartContainer>,
    );
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });
});

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

describe("Tooltip Component", () => {
  it("devrait afficher une info-bulle", () => {
    cy.mount(
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <button>Hover me</button>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content>Tooltip content</TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
    cy.contains("button", "Hover me").should("be.visible");
  });
  it("devrait pouvoir être positionné", () => {
    cy.mount(
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <button>?</button>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content side="top">
              Top tooltip
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
    cy.contains("button", "?").should("be.visible");
  });
});

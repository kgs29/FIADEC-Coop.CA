import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

describe("Hover Card Component", () => {
  it("devrait afficher la hover card", () => {
    cy.mount(
      <HoverCardPrimitive.Root>
        <HoverCardPrimitive.Trigger asChild>
          <button>Hover over me</button>
        </HoverCardPrimitive.Trigger>
        <HoverCardPrimitive.Portal>
          <HoverCardPrimitive.Content>
            <p>Hover card content</p>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      </HoverCardPrimitive.Root>
    );
    cy.contains("button", "Hover over me").should("be.visible");
  });
});

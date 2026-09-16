import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

describe("Scroll Area Component", () => {
  it("devrait permettre le scroll", () => {
    cy.mount(
      <ScrollAreaPrimitive.Root className="w-full h-32">
        <ScrollAreaPrimitive.Viewport>
          <div>Line 1</div>
          <div>Line 2</div>
          <div>Line 3</div>
          <div>Line 4</div>
          <div>Line 5</div>
        </ScrollAreaPrimitive.Viewport>
      </ScrollAreaPrimitive.Root>
    );
    cy.contains("Line 1").should("be.visible");
  });
});

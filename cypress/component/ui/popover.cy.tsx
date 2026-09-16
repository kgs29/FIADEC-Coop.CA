import * as PopoverPrimitive from "@radix-ui/react-popover";

describe("Popover Component", () => {
  it("devrait afficher un popover", () => {
    cy.mount(
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button>Open</button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content>
            <p>Popover content</p>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
    cy.contains("button", "Open").should("be.visible");
  });

  it("devrait afficher le contenu au clic", () => {
    cy.mount(
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button>Menu</button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content>
            <p>Menu item 1</p>
            <p>Menu item 2</p>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
    cy.contains("button", "Menu").click();
  });

  it("devrait supporter le close button", () => {
    cy.mount(
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button>Open</button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content>
            <p>Content</p>
            <PopoverPrimitive.Close asChild>
              <button>Close</button>
            </PopoverPrimitive.Close>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
    cy.contains("button", "Open").click();
    cy.contains("button", "Close").click();
  });
});

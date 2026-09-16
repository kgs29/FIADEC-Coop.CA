import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

describe("Dropdown Menu Component", () => {
  it("devrait afficher le menu", () => {
    cy.mount(
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button>Menu</button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content>
            <DropdownMenuPrimitive.Item>
              Option 1
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item>
              Option 2
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
    cy.contains("button", "Menu").should("be.visible");
  });

  it("devrait afficher les options au clic", () => {
    cy.mount(
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button>Menu</button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content>
            <DropdownMenuPrimitive.Item>
              Option 1
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item>
              Option 2
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
    cy.contains("button", "Menu").click();
  });

  it("devrait supporter les séparateurs", () => {
    cy.mount(
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button>Menu</button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content>
            <DropdownMenuPrimitive.Item>Edit</DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Separator />
            <DropdownMenuPrimitive.Item>Delete</DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
    cy.contains("button", "Menu").click();
  });
});

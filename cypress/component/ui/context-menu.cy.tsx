import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

describe("Context Menu Component", () => {
  it("devrait afficher le menu contextuel au clic droit", () => {
    cy.mount(
      <ContextMenuPrimitive.Root>
        <ContextMenuPrimitive.Trigger>
          <div>Right click me</div>
        </ContextMenuPrimitive.Trigger>
        <ContextMenuPrimitive.Portal>
          <ContextMenuPrimitive.Content>
            <ContextMenuPrimitive.Item>Edit</ContextMenuPrimitive.Item>
            <ContextMenuPrimitive.Item>Delete</ContextMenuPrimitive.Item>
          </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
      </ContextMenuPrimitive.Root>
    );
    cy.contains("Right click me").should("be.visible");
  });

  it("devrait afficher les options", () => {
    cy.mount(
      <ContextMenuPrimitive.Root>
        <ContextMenuPrimitive.Trigger>
          <div>Content</div>
        </ContextMenuPrimitive.Trigger>
        <ContextMenuPrimitive.Portal>
          <ContextMenuPrimitive.Content>
            <ContextMenuPrimitive.Item>Copy</ContextMenuPrimitive.Item>
            <ContextMenuPrimitive.Item>Paste</ContextMenuPrimitive.Item>
            <ContextMenuPrimitive.Item>Delete</ContextMenuPrimitive.Item>
          </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
      </ContextMenuPrimitive.Root>
    );
  });
});

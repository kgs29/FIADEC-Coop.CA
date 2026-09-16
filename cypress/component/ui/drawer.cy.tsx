import * as DrawerPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

describe("Drawer Component", () => {
  it("devrait afficher le drawer", () => {
    cy.mount(
      <DrawerPrimitive.Root open={true}>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay />
          <DrawerPrimitive.Content>
            <DrawerPrimitive.Title>Drawer Title</DrawerPrimitive.Title>
            <DrawerPrimitive.Close>
              <X className="h-4 w-4" />
            </DrawerPrimitive.Close>
            <p>Drawer content</p>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
    cy.contains("Drawer Title").should("be.visible");
  });

  it("devrait afficher le contenu", () => {
    cy.mount(
      <DrawerPrimitive.Root open={true}>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay />
          <DrawerPrimitive.Content>
            <h2>Settings</h2>
            <p>Configure your preferences</p>
            <button>Save</button>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
    cy.contains("Settings").should("be.visible");
    cy.contains("button", "Save").should("be.visible");
  });

  it("devrait pouvoir être fermé", () => {
    cy.mount(
      <DrawerPrimitive.Root open={true}>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay />
          <DrawerPrimitive.Content>
            <DrawerPrimitive.Close asChild>
              <button>Close</button>
            </DrawerPrimitive.Close>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
    cy.contains("button", "Close").should("be.visible");
  });
});

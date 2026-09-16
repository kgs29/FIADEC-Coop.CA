import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

describe("Dialog Component", () => {
  it("devrait afficher la boîte de dialogue", () => {
    cy.mount(
      <DialogPrimitive.Root open={true}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay />
          <DialogPrimitive.Content>
            <DialogPrimitive.Title>Dialog Title</DialogPrimitive.Title>
            <DialogPrimitive.Description>
              Dialog description
            </DialogPrimitive.Description>
            <DialogPrimitive.Close>
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
    cy.contains("Dialog Title").should("be.visible");
  });

  it("devrait afficher le contenu", () => {
    cy.mount(
      <DialogPrimitive.Root open={true}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay />
          <DialogPrimitive.Content>
            <DialogPrimitive.Title>Confirmation</DialogPrimitive.Title>
            <p>Êtes-vous sûr ?</p>
            <button>Confirmer</button>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
    cy.contains("Êtes-vous sûr ?").should("be.visible");
    cy.contains("button", "Confirmer").should("be.visible");
  });

  it("devrait pouvoir être fermée", () => {
    cy.mount(
      <DialogPrimitive.Root open={true}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay />
          <DialogPrimitive.Content>
            <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
            <DialogPrimitive.Close>Close</DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
    cy.contains("Close").click();
  });

  it("devrait afficher le titre et la description", () => {
    cy.mount(
      <DialogPrimitive.Root open={true}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay />
          <DialogPrimitive.Content>
            <DialogPrimitive.Title>Important Dialog</DialogPrimitive.Title>
            <DialogPrimitive.Description>
              This is an important message
            </DialogPrimitive.Description>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
    cy.contains("Important Dialog").should("be.visible");
    cy.contains("This is an important message").should("be.visible");
  });
});

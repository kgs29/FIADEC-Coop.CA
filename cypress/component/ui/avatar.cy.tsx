import * as AvatarPrimitive from "@radix-ui/react-avatar";

describe("Avatar Component", () => {
  it("devrait afficher un avatar avec une image", () => {
    cy.mount(
      <AvatarPrimitive.Root>
        <AvatarPrimitive.Image
          src="https://github.com/shadcn.png"
          alt="User"
        />
        <AvatarPrimitive.Fallback>CN</AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
    cy.get("img").should("be.visible");
  });

  it("devrait afficher le fallback si l'image ne charge pas", () => {
    cy.mount(
      <AvatarPrimitive.Root>
        <AvatarPrimitive.Image
          src="https://broken-image-url.com/image.png"
          alt="User"
        />
        <AvatarPrimitive.Fallback>JD</AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
    // Attendez un moment et vérifiez le fallback
    cy.contains("JD").should("be.visible");
  });

  it("devrait accepter un alt text", () => {
    cy.mount(
      <AvatarPrimitive.Root>
        <AvatarPrimitive.Image
          src="https://github.com/shadcn.png"
          alt="User Profile"
        />
        <AvatarPrimitive.Fallback>UP</AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
    cy.get("img").should("have.attr", "alt", "User Profile");
  });
});

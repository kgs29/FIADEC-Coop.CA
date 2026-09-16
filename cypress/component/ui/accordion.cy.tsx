import * as AccordionPrimitive from "@radix-ui/react-accordion";

describe("Accordion Component", () => {
  // it("devrait afficher un accordion", () => {
  //   cy.mount(
  //     <AccordionPrimitive.Root type="single" collapsible>
  //       <AccordionPrimitive.Item value="item-1">
  //         <AccordionPrimitive.Trigger>
  //           Section 1
  //         </AccordionPrimitive.Trigger>
  //         <AccordionPrimitive.Content>
  //           Content 1
  //         </AccordionPrimitive.Content>
  //       </AccordionPrimitive.Item>
  //     </AccordionPrimitive.Root>
  //   );
  //   cy.get("[data-slot='accordion']").should("be.visible");
  // });

  it("devrait afficher le contenu à l'ouverture", () => {
    cy.mount(
      <AccordionPrimitive.Root type="single" collapsible>
        <AccordionPrimitive.Item value="item-1">
          <AccordionPrimitive.Trigger>
            Section 1
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content>
            Content 1
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    );
    cy.contains("Section 1").click();
    cy.contains("Content 1").should("be.visible");
  });

  it("devrait avoir plusieurs items", () => {
    cy.mount(
      <AccordionPrimitive.Root type="single" collapsible>
        <AccordionPrimitive.Item value="item-1">
          <AccordionPrimitive.Trigger>Section 1</AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content>Content 1</AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
        <AccordionPrimitive.Item value="item-2">
          <AccordionPrimitive.Trigger>Section 2</AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content>Content 2</AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    );
    cy.contains("Section 1").should("be.visible");
    cy.contains("Section 2").should("be.visible");
  });

  // it("devrait fermer l'item précédent en mode single", () => {
  //   cy.mount(
  //     <AccordionPrimitive.Root type="single" collapsible>
  //       <AccordionPrimitive.Item value="item-1">
  //         <AccordionPrimitive.Trigger>Section 1</AccordionPrimitive.Trigger>
  //         <AccordionPrimitive.Content>Content 1</AccordionPrimitive.Content>
  //       </AccordionPrimitive.Item>
  //       <AccordionPrimitive.Item value="item-2">
  //         <AccordionPrimitive.Trigger>Section 2</AccordionPrimitive.Trigger>
  //         <AccordionPrimitive.Content>Content 2</AccordionPrimitive.Content>
  //       </AccordionPrimitive.Item>
  //     </AccordionPrimitive.Root>
  //   );
  //   cy.contains("Section 1").click();
  //   cy.contains("Content 1").should("be.visible");
  //   cy.contains("Section 2").click();
  //   cy.contains("Content 1").should("not.be.visible");
  // });
});

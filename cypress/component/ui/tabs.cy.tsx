import * as TabsPrimitive from "@radix-ui/react-tabs";

describe("Tabs Component", () => {
  it("devrait afficher les tabs", () => {
    cy.mount(
      <TabsPrimitive.Root defaultValue="tab1">
        <TabsPrimitive.List>
          <TabsPrimitive.Trigger value="tab1">Tab 1</TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger value="tab2">Tab 2</TabsPrimitive.Trigger>
        </TabsPrimitive.List>
        <TabsPrimitive.Content value="tab1">Content 1</TabsPrimitive.Content>
        <TabsPrimitive.Content value="tab2">Content 2</TabsPrimitive.Content>
      </TabsPrimitive.Root>
    );
    cy.contains("Tab 1").should("be.visible");
    cy.contains("Tab 2").should("be.visible");
  });

  it("devrait afficher le contenu actif", () => {
    cy.mount(
      <TabsPrimitive.Root defaultValue="tab1">
        <TabsPrimitive.List>
          <TabsPrimitive.Trigger value="tab1">Tab 1</TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger value="tab2">Tab 2</TabsPrimitive.Trigger>
        </TabsPrimitive.List>
        <TabsPrimitive.Content value="tab1">Content 1</TabsPrimitive.Content>
        <TabsPrimitive.Content value="tab2">Content 2</TabsPrimitive.Content>
      </TabsPrimitive.Root>
    );
    cy.contains("Content 1").should("be.visible");
  });

  it("devrait changer de contenu au clic", () => {
    cy.mount(
      <TabsPrimitive.Root defaultValue="tab1">
        <TabsPrimitive.List>
          <TabsPrimitive.Trigger value="tab1">Tab 1</TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger value="tab2">Tab 2</TabsPrimitive.Trigger>
        </TabsPrimitive.List>
        <TabsPrimitive.Content value="tab1">Content 1</TabsPrimitive.Content>
        <TabsPrimitive.Content value="tab2">Content 2</TabsPrimitive.Content>
      </TabsPrimitive.Root>
    );
    cy.contains("Tab 2").click();
    cy.contains("Content 2").should("be.visible");
    cy.contains("Content 1").should("not.exist");
  });

  it("devrait supporter plusieurs tabs", () => {
    cy.mount(
      <TabsPrimitive.Root defaultValue="tab1">
        <TabsPrimitive.List>
          <TabsPrimitive.Trigger value="tab1">Tab 1</TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger value="tab2">Tab 2</TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger value="tab3">Tab 3</TabsPrimitive.Trigger>
        </TabsPrimitive.List>
        <TabsPrimitive.Content value="tab1">Content 1</TabsPrimitive.Content>
        <TabsPrimitive.Content value="tab2">Content 2</TabsPrimitive.Content>
        <TabsPrimitive.Content value="tab3">Content 3</TabsPrimitive.Content>
      </TabsPrimitive.Root>
    );
    cy.get("[role='tab']").should("have.length", 3);
  });
});

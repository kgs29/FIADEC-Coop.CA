describe("Input Component", () => {
  it("devrait afficher un champ input", () => {
    cy.mount(<input type="text" placeholder="Enter text" />);
    cy.get("input").should("be.visible");
  });

  it("devrait accepter la saisie de texte", () => {
    cy.mount(<input type="text" />);
    cy.get("input").type("Hello World");
    cy.get("input").should("have.value", "Hello World");
  });

  it("devrait accepter différents types d'input", () => {
    cy.mount(<input type="email" />);
    cy.get("input").should("have.attr", "type", "email");
  });

  it("devrait accepter un placeholder", () => {
    cy.mount(<input type="text" placeholder="Test placeholder" />);
    cy.get("input").should("have.attr", "placeholder", "Test placeholder");
  });

  it("devrait être désactivé", () => {
    cy.mount(<input type="text" disabled />);
    cy.get("input").should("be.disabled");
  });

  it("devrait avoir la valeur initiale", () => {
    cy.mount(<input type="text" defaultValue="Initial value" />);
    cy.get("input").should("have.value", "Initial value");
  });
});

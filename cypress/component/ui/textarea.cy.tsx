describe("Textarea Component", () => {
  it("devrait afficher une textarea", () => {
    cy.mount(<textarea placeholder="Enter text..." />);
    cy.get("textarea").should("be.visible");
  });

  it("devrait avoir une hauteur par défaut", () => {
    cy.mount(<textarea rows={4} />);
    cy.get("textarea").should("have.attr", "rows", "4");
  });

  it("devrait avoir une largeur par défaut", () => {
    cy.mount(<textarea cols={30} />);
    cy.get("textarea").should("have.attr", "cols", "30");
  });

  it("devrait accepter un placeholder", () => {
    cy.mount(<textarea placeholder="Write your message..." />);
    cy.get("textarea").should(
      "have.attr",
      "placeholder",
      "Write your message..."
    );
  });

  it("devrait être désactivée", () => {
    cy.mount(<textarea disabled />);
    cy.get("textarea").should("be.disabled");
  });

  it("devrait avoir une valeur initiale", () => {
    cy.mount(<textarea defaultValue="Initial text" />);
    cy.get("textarea").should("contain", "Initial text");
  });

  it("devrait être en lecture seule", () => {
    cy.mount(<textarea readOnly defaultValue="Read only" />);
    cy.get("textarea").should("have.attr", "readonly");
  });
});

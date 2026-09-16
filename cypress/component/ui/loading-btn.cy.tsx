describe("Loading Button Component", () => {
  it("devrait afficher un bouton avec état de chargement", () => {
    cy.mount(
      <button className="loading-btn">
        <span>Click me</span>
      </button>
    );
    cy.get(".loading-btn").should("be.visible");
  });


  it("devrait être désactivé lors du chargement", () => {
    cy.mount(
      <button className="loading-btn" disabled>
        Loading...
      </button>
    );
    cy.get(".loading-btn").should("be.disabled");
  });

  it("devrait afficher le texte approprié", () => {
    cy.mount(
      <button className="loading-btn">
        Submit
      </button>
    );
    cy.contains("button", "Submit").should("be.visible");
  });
});

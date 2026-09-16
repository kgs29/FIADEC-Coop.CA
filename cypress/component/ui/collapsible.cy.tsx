describe("Collapsible Component", () => {
  it("devrait afficher un collapsible", () => {
    cy.mount(
      <div className="collapsible">
        <button className="collapsible-trigger">Expand</button>
        <div className="collapsible-content">Content</div>
      </div>
    );
    cy.get(".collapsible").should("be.visible");
  });

  it("devrait afficher le contenu au clic", () => {
    cy.mount(
      <div className="collapsible">
        <button className="collapsible-trigger">Show Details</button>
        <div className="collapsible-content">Hidden content here</div>
      </div>
    );
    cy.contains("button", "Show Details").click();
    cy.contains("Hidden content here").should("be.visible");
  });

  it("devrait avoir un chevron", () => {
    cy.mount(
      <div className="collapsible">
        <button className="collapsible-trigger">
          <span className="chevron">▼</span> Expand
        </button>
        <div className="collapsible-content">Content</div>
      </div>
    );
    cy.get(".chevron").should("be.visible");
  });

  it("devrait supporter l'état ouvert par défaut", () => {
    cy.mount(
      <div className="collapsible open">
        <button className="collapsible-trigger">Collapse</button>
        <div className="collapsible-content">This is visible</div>
      </div>
    );
    cy.get(".collapsible").should("have.class", "open");
  });
});

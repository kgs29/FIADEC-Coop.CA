describe("Resizable Component", () => {
  it("devrait afficher un conteneur redimensionnable", () => {
    cy.mount(
      <div className="resizable">
        <div className="resizable-handle">↔</div>
        <div className="resizable-content">Resizable content</div>
      </div>
    );
    cy.get(".resizable").should("be.visible");
  });

  it("devrait afficher le contenu", () => {
    cy.mount(
      <div className="resizable">
        <div className="resizable-content">Panel content</div>
      </div>
    );
    cy.contains("Panel content").should("be.visible");
  });
});

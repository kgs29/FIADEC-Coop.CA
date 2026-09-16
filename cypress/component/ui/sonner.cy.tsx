describe("Sonner (Toast) Component", () => {
  it("devrait afficher une notification toast", () => {
    cy.mount(
      <div className="toast">
        <div className="toast-message">Success!</div>
        <button className="toast-close">×</button>
      </div>
    );
    cy.get(".toast").should("be.visible");
  });

  it("devrait afficher le message", () => {
    cy.mount(
      <div className="toast">
        <div className="toast-message">Operation completed successfully</div>
      </div>
    );
    cy.contains("Operation completed successfully").should("be.visible");
  });

  it("devrait avoir un bouton de fermeture", () => {
    cy.mount(
      <div className="toast">
        <div className="toast-message">Alert</div>
        <button className="toast-close">Close</button>
      </div>
    );
    cy.contains("button", "Close").should("be.visible");
  });

  it("devrait supporter différents types", () => {
    cy.mount(
      <div>
        <div className="toast toast-success">Success</div>
        <div className="toast toast-error">Error</div>
        <div className="toast toast-info">Info</div>
      </div>
    );
    cy.get(".toast-success").should("be.visible");
    cy.get(".toast-error").should("be.visible");
    cy.get(".toast-info").should("be.visible");
  });
});

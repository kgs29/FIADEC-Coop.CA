describe("Sheet Component", () => {
  it("devrait afficher le sheet", () => {
    cy.mount(
      <div className="sheet">
        <h2>Sheet Title</h2>
        <p>Sheet content</p>
        <button>Close</button>
      </div>
    );
    cy.get(".sheet").should("be.visible");
  });

  it("devrait afficher le titre et contenu", () => {
    cy.mount(
      <div className="sheet">
        <h2>Settings</h2>
        <p>Configure your settings here</p>
      </div>
    );
    cy.contains("h2", "Settings").should("be.visible");
    cy.contains("p", "Configure your settings here").should("be.visible");
  });

  it("devrait supporter les boutons d'action", () => {
    cy.mount(
      <div className="sheet">
        <h2>Confirmation</h2>
        <p>Are you sure?</p>
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    );
    cy.contains("button", "Cancel").should("be.visible");
    cy.contains("button", "Confirm").should("be.visible");
  });
});

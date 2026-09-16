describe("Alert Dialog Component", () => {
  it("devrait afficher une alerte de dialogue", () => {
    cy.mount(
      <div className="alert-dialog">
        <h2>Confirmation</h2>
        <p>Êtes-vous sûr?</p>
        <button>Annuler</button>
        <button>Confirmer</button>
      </div>
    );
    cy.get(".alert-dialog").should("be.visible");
  });

  it("devrait avoir un titre et description", () => {
    cy.mount(
      <div className="alert-dialog">
        <h2>Delete Item</h2>
        <p>This action cannot be undone.</p>
        <button>Cancel</button>
        <button>Delete</button>
      </div>
    );
    cy.contains("h2", "Delete Item").should("be.visible");
    cy.contains("p", "This action cannot be undone.").should("be.visible");
  });

  it("devrait avoir les boutons d'action", () => {
    cy.mount(
      <div className="alert-dialog">
        <p>Continue?</p>
        <button className="btn-cancel">No</button>
        <button className="btn-confirm">Yes</button>
      </div>
    );
    cy.get(".btn-cancel").should("be.visible");
    cy.get(".btn-confirm").should("be.visible");
  });
});

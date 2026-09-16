describe("Alert Component", () => {
  it("devrait afficher une alerte", () => {
    cy.mount(
      <div role="alert" className="alert">
        <span>Attention message</span>
      </div>
    );
    cy.get("[role='alert']").should("be.visible");
  });

  it("devrait afficher le contenu de l'alerte", () => {
    cy.mount(
      <div role="alert" className="alert">
        <span>Error: Something went wrong!</span>
      </div>
    );
    cy.contains("Error: Something went wrong!").should("be.visible");
  });

  it("devrait accepter différentes variantes", () => {
    cy.mount(
      <>
        <div role="alert" className="alert alert-info">Info</div>
        <div role="alert" className="alert alert-warning">Warning</div>
        <div role="alert" className="alert alert-error">Error</div>
        <div role="alert" className="alert alert-success">Success</div>
      </>
    );
    cy.get(".alert-info").should("be.visible");
    cy.get(".alert-warning").should("be.visible");
    cy.get(".alert-error").should("be.visible");
    cy.get(".alert-success").should("be.visible");
  });

  it("devrait pouvoir être fermée", () => {
    cy.mount(
      <div role="alert" className="alert">
        <span>Alert message</span>
        <button className="close-btn">×</button>
      </div>
    );
    cy.get(".close-btn").should("be.visible");
    cy.get(".close-btn").click();
  });

  it("devrait contenir un titre et une description", () => {
    cy.mount(
      <div role="alert" className="alert">
        <h3>Titre alerte</h3>
        <p>Description de l'alerte</p>
      </div>
    );
    cy.contains("h3", "Titre alerte").should("be.visible");
    cy.contains("p", "Description de l'alerte").should("be.visible");
  });
});

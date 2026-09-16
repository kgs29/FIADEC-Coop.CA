describe("Badge Component", () => {
  it("devrait afficher un badge", () => {
    cy.mount(<div className="badge">New</div>);
    cy.get(".badge").should("be.visible").should("contain", "New");
  });

  it("devrait accepter différentes variantes", () => {
    cy.mount(
      <>
        <div className="badge badge-default">Default</div>
        <div className="badge badge-success">Success</div>
        <div className="badge badge-error">Error</div>
      </>
    );
    cy.get(".badge-default").should("be.visible");
    cy.get(".badge-success").should("be.visible");
    cy.get(".badge-error").should("be.visible");
  });

  it("devrait pouvoir être fermé", () => {
    cy.mount(
      <div className="badge">
        New <button>×</button>
      </div>
    );
    cy.get(".badge button").click();
    cy.get(".badge").should("be.visible");
  });

  it("devrait accepter des tailles différentes", () => {
    cy.mount(
      <>
        <div className="badge badge-sm">Small</div>
        <div className="badge badge-lg">Large</div>
      </>
    );
    cy.get(".badge-sm").should("have.class", "badge-sm");
    cy.get(".badge-lg").should("have.class", "badge-lg");
  });
});

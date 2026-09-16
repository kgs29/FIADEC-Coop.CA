describe("Card Component", () => {
  it("devrait afficher une carte", () => {
    cy.mount(
      <div className="card">
        <div className="card-header">Header</div>
        <div className="card-body">Body</div>
      </div>
    );
    cy.get(".card").should("be.visible");
  });

  it("devrait avoir un header, body et footer", () => {
    cy.mount(
      <div className="card">
        <div className="card-header">Title</div>
        <div className="card-body">Content</div>
        <div className="card-footer">Footer</div>
      </div>
    );
    cy.get(".card-header").should("contain", "Title");
    cy.get(".card-body").should("contain", "Content");
    cy.get(".card-footer").should("contain", "Footer");
  });

  it("devrait accepter des classes personnalisées", () => {
    cy.mount(
      <div className="card shadow-lg border">
        Content
      </div>
    );
    cy.get(".card").should("have.class", "shadow-lg");
  });

});

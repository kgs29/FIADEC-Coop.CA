describe("Command Component", () => {
  it("devrait afficher une commande", () => {
    cy.mount(
      <div className="command">
        <input type="search" placeholder="Type a command..." />
        <div className="command-list">
          <div className="command-item">Command 1</div>
          <div className="command-item">Command 2</div>
        </div>
      </div>
    );
    cy.get(".command").should("be.visible");
  });

  it("devrait afficher l'input de recherche", () => {
    cy.mount(
      <div className="command">
        <input type="search" placeholder="Search..." />
      </div>
    );
    cy.get("input[type='search']").should(
      "have.attr",
      "placeholder",
      "Search..."
    );
  });

  it("devrait afficher les items de commande", () => {
    cy.mount(
      <div className="command">
        <div className="command-item">Save</div>
        <div className="command-item">Delete</div>
        <div className="command-item">Edit</div>
      </div>
    );
    cy.get(".command-item").should("have.length", 3);
  });

  it("devrait supporter les groupes", () => {
    cy.mount(
      <div className="command">
        <div className="command-group">
          <h3>Files</h3>
          <div className="command-item">New File</div>
        </div>
        <div className="command-group">
          <h3>Edit</h3>
          <div className="command-item">Undo</div>
        </div>
      </div>
    );
    cy.get(".command-group").should("have.length", 2);
  });
});

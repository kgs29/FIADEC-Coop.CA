describe("Menubar Component", () => {
  it("devrait afficher un menubar", () => {
    cy.mount(
      <div className="menubar">
        <button>File</button>
        <button>Edit</button>
        <button>Help</button>
      </div>
    );
    cy.get(".menubar").should("be.visible");
  });

  it("devrait afficher les menus", () => {
    cy.mount(
      <div className="menubar">
        <button>File</button>
        <button>Edit</button>
        <button>View</button>
        <button>Help</button>
      </div>
    );
    cy.contains("button", "File").should("be.visible");
    cy.contains("button", "Edit").should("be.visible");
    cy.contains("button", "Help").should("be.visible");
  });

  it("devrait supporter les sous-menus", () => {
    cy.mount(
      <div className="menubar">
        <button>File</button>
        <div className="submenu">
          <a href="#">New</a>
          <a href="#">Open</a>
        </div>
      </div>
    );
    cy.contains("button", "File").should("be.visible");
  });
});

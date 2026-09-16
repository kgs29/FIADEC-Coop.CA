describe("Sidebar Component", () => {
  it("devrait afficher le sidebar", () => {
    cy.mount(
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </aside>
    );
    cy.get("aside.sidebar").should("be.visible");
  });

  it("devrait afficher les liens de navigation", () => {
    cy.mount(
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </aside>
    );
    cy.contains("a", "Dashboard").should("be.visible");
    cy.contains("a", "Users").should("be.visible");
  });

  it("devrait pouvoir être replié", () => {
    cy.mount(
      <div>
        <button className="sidebar-toggle">Toggle</button>
        <aside className="sidebar">
          <nav>
            <a href="#">Item</a>
          </nav>
        </aside>
      </div>
    );
    cy.contains("button", "Toggle").click();
  });

  it("devrait supporter les groupes", () => {
    cy.mount(
      <aside className="sidebar">
        <div className="sidebar-group">
          <h3>Main</h3>
          <a href="#">Home</a>
        </div>
        <div className="sidebar-group">
          <h3>Admin</h3>
          <a href="#">Users</a>
        </div>
      </aside>
    );
    cy.get(".sidebar-group").should("have.length", 2);
  });
});

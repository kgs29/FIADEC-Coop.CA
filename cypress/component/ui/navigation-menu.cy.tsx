describe("Navigation Menu Component", () => {
  it("devrait afficher un menu de navigation", () => {
    cy.mount(
      <nav className="navigation-menu">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    );
    cy.get(".navigation-menu").should("be.visible");
  });

  it("devrait afficher tous les liens", () => {
    cy.mount(
      <nav className="navigation-menu">
        <ul>
          <li><a href="#">Products</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Pricing</a></li>
        </ul>
      </nav>
    );
    cy.contains("a", "Products").should("be.visible");
    cy.contains("a", "Services").should("be.visible");
  });

  it("devrait supporter les menus avec des items actifs", () => {
    cy.mount(
      <nav className="navigation-menu">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about" className="active">About</a></li>
        </ul>
      </nav>
    );
    cy.get(".navigation-menu a.active").should("contain", "About");
  });
});

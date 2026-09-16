describe("Breadcrumb Component", () => {
  it("devrait afficher les breadcrumbs", () => {
    cy.mount(
      <nav aria-label="breadcrumb">
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li>/</li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li>/</li>
          <li>Electronics</li>
        </ol>
      </nav>
    );
    cy.contains("Home").should("be.visible");
    cy.contains("Products").should("be.visible");
  });

  it("devrait avoir des liens cliquables", () => {
    cy.mount(
      <nav>
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
        </ol>
      </nav>
    );
    cy.contains("a", "Home").should("have.attr", "href", "/");
    cy.contains("a", "Dashboard").should("have.attr", "href", "/dashboard");
  });

  it("devrait afficher le texte du dernier item", () => {
    cy.mount(
      <nav>
        <ol>
          <li>
            <a href="/">Home</a>
          </li>
          <li>Current Page</li>
        </ol>
      </nav>
    );
    cy.contains("Current Page").should("be.visible");
  });

  it("devrait afficher les séparateurs", () => {
    cy.mount(
      <nav>
        <ol>
          <li>Home</li>
          <li className="separator">/</li>
          <li>Section</li>
        </ol>
      </nav>
    );
    cy.get(".separator").should("contain", "/");
  });
});

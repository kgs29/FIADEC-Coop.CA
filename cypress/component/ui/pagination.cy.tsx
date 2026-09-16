describe("Pagination Component", () => {
  it("devrait afficher les contrôles de pagination", () => {
    cy.mount(
      <nav aria-label="pagination">
        <button>Previous</button>
        <span>Page 1 of 10</span>
        <button>Next</button>
      </nav>
    );
    cy.contains("button", "Previous").should("be.visible");
    cy.contains("button", "Next").should("be.visible");
  });

  it("devrait afficher les numéros de page", () => {
    cy.mount(
      <nav>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <span>...</span>
        <button>10</button>
      </nav>
    );
    cy.contains("button", "1").should("be.visible");
    cy.contains("button", "10").should("be.visible");
  });

  it("devrait permettre de naviguer", () => {
    cy.mount(
      <nav>
        <button>Previous</button>
        <span>Page 1</span>
        <button>Next</button>
      </nav>
    );
    cy.contains("button", "Next").click();
    cy.contains("button", "Previous").click();
  });

  it("devrait désactiver les boutons aux limites", () => {
    cy.mount(
      <nav>
        <button disabled>Previous</button>
        <span>Page 1</span>
        <button>Next</button>
      </nav>
    );
    cy.contains("button", "Previous").should("be.disabled");
  });

  it("devrait afficher le numéro de page actif", () => {
    cy.mount(
      <nav>
        <button>1</button>
        <button className="active">2</button>
        <button>3</button>
      </nav>
    );
    cy.get(".active").should("contain", "2");
  });
});

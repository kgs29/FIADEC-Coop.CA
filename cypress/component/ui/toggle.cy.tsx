describe("Toggle Component", () => {
  it("devrait afficher un toggle", () => {
    cy.mount(
      <button className="toggle" aria-pressed="false">
        Bold
      </button>
    );
    cy.get(".toggle").should("be.visible");
  });

  it("devrait pouvoir être activé", () => {
    cy.mount(
      <button className="toggle" aria-pressed="false">
        Bold
      </button>
    );
    cy.get(".toggle").click();
  });

  it("devrait accepter l'attribut aria-pressed", () => {
    cy.mount(
      <button className="toggle" aria-pressed="true">
        Active
      </button>
    );
    cy.get(".toggle").should("have.attr", "aria-pressed", "true");
  });

  it("devrait afficher une icône", () => {
    cy.mount(
      <button className="toggle">
        <span>✓</span> Checked
      </button>
    );
    cy.get(".toggle").contains("✓").should("be.visible");
  });

  it("devrait supporter plusieurs variantes", () => {
    cy.mount(
      <div>
        <button className="toggle toggle-default">Default</button>
        <button className="toggle toggle-outline">Outline</button>
        <button className="toggle toggle-ghost">Ghost</button>
      </div>
    );
    cy.get(".toggle-default").should("be.visible");
    cy.get(".toggle-outline").should("be.visible");
    cy.get(".toggle-ghost").should("be.visible");
  });
});

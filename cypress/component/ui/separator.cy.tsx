describe("Separator Component", () => {
  it("devrait afficher un séparateur", () => {
    cy.mount(
      <div>
        <p>Content 1</p>
        <hr className="separator" />
        <p>Content 2</p>
      </div>
    );
    cy.get(".separator").should("be.visible");
  });

  it("devrait pouvoir être horizontal", () => {
    cy.mount(
      <div>
        <p>Top</p>
        <hr className="separator-horizontal" />
        <p>Bottom</p>
      </div>
    );
    cy.get(".separator-horizontal").should("be.visible");
  });

  it("devrait avoir un margin approprié", () => {
    cy.mount(
      <div>
        <p>Section 1</p>
        <hr className="separator my-4" />
        <p>Section 2</p>
      </div>
    );
    cy.get(".separator").should("have.class", "my-4");
  });
});

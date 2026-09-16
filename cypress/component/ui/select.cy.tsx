describe("Select Component", () => {
  it("devrait afficher un select", () => {
    cy.mount(
      <select>
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    );
    cy.get("select").should("be.visible");
  });

  it("devrait afficher les options", () => {
    cy.mount(
      <select>
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    );
    cy.get("select option").should("have.length", 3);
  });

  it("devrait permettre de sélectionner une option", () => {
    cy.mount(
      <select>
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    );
    cy.get("select").select("1");
    cy.get("select").should("have.value", "1");
  });

  it("devrait avoir une valeur par défaut", () => {
    cy.mount(
      <select defaultValue="1">
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
    );
    cy.get("select").should("have.value", "1");
  });

  it("devrait être désactivé", () => {
    cy.mount(
      <select disabled>
        <option value="1">Option 1</option>
      </select>
    );
    cy.get("select").should("be.disabled");
  });

  it("devrait appeler onChange", () => {
    const handleChange = cy.spy();
    cy.mount(
      <select onChange={handleChange}>
        <option value="">Select...</option>
        <option value="1">Option 1</option>
      </select>
    );
    cy.get("select")
      .select("1")
      .then(() => {
        expect(handleChange).to.have.been.called;
      });
  });
});

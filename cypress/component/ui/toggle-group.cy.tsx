describe("Toggle Group Component", () => {
  it("devrait afficher un groupe de toggles", () => {
    cy.mount(
      <div className="toggle-group">
        <button className="toggle-item">Option 1</button>
        <button className="toggle-item">Option 2</button>
        <button className="toggle-item">Option 3</button>
      </div>
    );
    cy.get(".toggle-group").should("be.visible");
    cy.get(".toggle-item").should("have.length", 3);
  });

  it("devrait pouvoir sélectionner une option", () => {
    cy.mount(
      <div className="toggle-group">
        <button className="toggle-item">Left</button>
        <button className="toggle-item">Center</button>
        <button className="toggle-item">Right</button>
      </div>
    );
    cy.contains("button", "Center").click();
  });

  it("devrait afficher l'option sélectionnée", () => {
    cy.mount(
      <div className="toggle-group">
        <button className="toggle-item selected">Bold</button>
        <button className="toggle-item">Italic</button>
        <button className="toggle-item">Underline</button>
      </div>
    );
    cy.get(".toggle-item.selected").should("contain", "Bold");
  });

  it("devrait supporter la sélection multiple", () => {
    cy.mount(
      <div className="toggle-group multiple">
        <button className="toggle-item">Bold</button>
        <button className="toggle-item">Italic</button>
        <button className="toggle-item">Underline</button>
      </div>
    );
    cy.contains("button", "Bold").click();
    cy.contains("button", "Italic").click();
  });
});

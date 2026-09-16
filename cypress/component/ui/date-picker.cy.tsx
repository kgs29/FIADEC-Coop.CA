describe("Date Picker Component", () => {
  it("devrait afficher un sélecteur de date", () => {
    cy.mount(
      <input type="date" className="date-picker" />
    );
    cy.get(".date-picker").should("be.visible");
  });

  it("devrait accepter une date", () => {
    cy.mount(
      <input type="date" className="date-picker" />
    );
    cy.get(".date-picker").type("2024-01-15");
    cy.get(".date-picker").should("have.value", "2024-01-15");
  });

  it("devrait avoir une valeur par défaut", () => {
    cy.mount(
      <input 
        type="date" 
        defaultValue="2024-01-10"
        className="date-picker"
      />
    );
    cy.get(".date-picker").should("have.value", "2024-01-10");
  });

  it("devrait avoir min et max", () => {
    cy.mount(
      <input 
        type="date" 
        min="2024-01-01"
        max="2024-12-31"
        className="date-picker"
      />
    );
    cy.get(".date-picker").should("have.attr", "min", "2024-01-01");
    cy.get(".date-picker").should("have.attr", "max", "2024-12-31");
  });
});

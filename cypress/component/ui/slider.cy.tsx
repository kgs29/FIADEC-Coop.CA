describe("Slider Component", () => {
  it("devrait afficher un slider", () => {
    cy.mount(
      <input type="range" min="0" max="100" defaultValue="50" />
    );
    cy.get("input[type='range']").should("be.visible");
  });

  it("devrait avoir une valeur par défaut", () => {
    cy.mount(
      <input type="range" min="0" max="100" defaultValue="50" />
    );
    cy.get("input[type='range']").should("have.value", "50");
  });

  it("devrait pouvoir être modifié", () => {
    cy.mount(
      <input type="range" min="0" max="100" />
    );
    cy.get("input[type='range']").invoke("val", 75).trigger("change");
    cy.get("input[type='range']").should("have.value", "75");
  });

  it("devrait accepter min et max", () => {
    cy.mount(
      <input type="range" min="10" max="90" defaultValue="50" />
    );
    cy.get("input[type='range']").should("have.attr", "min", "10");
    cy.get("input[type='range']").should("have.attr", "max", "90");
  });

  it("devrait accepter un step", () => {
    cy.mount(
      <input type="range" min="0" max="100" step="10" />
    );
    cy.get("input[type='range']").should("have.attr", "step", "10");
  });
});

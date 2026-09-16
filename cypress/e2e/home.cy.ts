/// <reference types="cypress" />

describe("Home page", () => {
  it("displays main hero text", () => {
    cy.visit("/");
    cy.get("body")
      .find(
        ':contains("Observatoire"), :contains("observatoire"), :contains("OBSERVATOIRE")'
      )
      .should("be.visible");
  });
});

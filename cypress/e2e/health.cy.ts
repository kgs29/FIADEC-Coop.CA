/// <reference types="cypress" />

describe("Health Check Tests", () => {
  it("should load the application homepage", () => {
    cy.visit("/", { failOnStatusCode: false })
    cy.get("body").should("exist")
  })

  it("should have a valid page title", () => {
    cy.visit("/", { failOnStatusCode: false })
    cy.title().should("not.be.empty")
  })
})

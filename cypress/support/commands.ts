/// <reference types="cypress" />

// Custom commands for Cypress
// For now, minimal set - extend as needed

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      loginAsEditor(username?: string): Chainable<Element>;
    }
  }
}

// Example helper (not used yet) to set localStorage token
Cypress.Commands.add("loginAsEditor", (username = "testuser") => {
  globalThis.localStorage.setItem("access", JSON.stringify("fakeAccessToken"));
  return cy.wrap(null);
});

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login");
  cy.get('input[name="username"]').type(username || "admin");
  cy.get('input[name="password"]').type(password || "admin");
  cy.get('button[type="submit"]').click();

  // On s'assure que la connexion est finie avant de continuer
  cy.url().should("not.include", "/login");
});

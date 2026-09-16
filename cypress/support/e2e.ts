// Cypress support file for e2e tests
import "@cypress/code-coverage/support";
import "./commands";

// You can put global configuration and behavior that modifies Cypress here.
// For example, set up global before/after hooks, custom timeouts, etc.

Cypress.on("uncaught:exception", (err) => {
  // Next.js utilise NEXT_REDIRECT en interne, on ne veut pas que Cypress échoue ici
  if (err.message.includes("NEXT_REDIRECT")) {
    return false;
  }
  // Pour les autres erreurs, on laisse Cypress échouer normalement
  return true;
});

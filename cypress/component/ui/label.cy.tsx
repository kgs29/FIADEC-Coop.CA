describe("Label Component", () => {
  it("devrait afficher un label", () => {
    cy.mount(<label>Username</label>);
    cy.get("label").should("be.visible").should("contain", "Username");
  });

  it("devrait être associé à un input", () => {
    cy.mount(
      <>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
      </>
    );
    cy.get("label").should("have.attr", "for", "username");
  });

  it("devrait accepter des classes CSS", () => {
    cy.mount(<label className="text-lg font-bold">Test Label</label>);
    cy.get("label").should("have.class", "text-lg");
  });

  it("devrait contenir le texte approprié", () => {
    cy.mount(<label>Email Address</label>);
    cy.get("label").should("contain", "Email Address");
  });
});

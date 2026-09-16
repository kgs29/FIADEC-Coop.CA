describe("Switch Component", () => {
  it("devrait afficher un switch", () => {
    cy.mount(
      <div className="flex items-center gap-2">
        <input type="checkbox" role="switch" className="toggle" />
        <label>Enable notifications</label>
      </div>
    );
    cy.get("[role='switch']").should("be.visible");
  });

  it("devrait être activable", () => {
    cy.mount(
      <input type="checkbox" role="switch" className="toggle" />
    );
    cy.get("[role='switch']").check();
    cy.get("[role='switch']").should("be.checked");
  });

  it("devrait être désactivable", () => {
    cy.mount(
      <input type="checkbox" role="switch" defaultChecked className="toggle" />
    );
    cy.get("[role='switch']").uncheck();
    cy.get("[role='switch']").should("not.be.checked");
  });

  it("devrait être désactivé", () => {
    cy.mount(
      <input type="checkbox" role="switch" disabled className="toggle" />
    );
    cy.get("[role='switch']").should("be.disabled");
  });

  it("devrait appeler onChange", () => {
    const handleChange = cy.spy();
    cy.mount(
      <input 
        type="checkbox" 
        role="switch" 
        onChange={handleChange}
        className="toggle"
      />
    );
    cy.get("[role='switch']")
      .check()
      .then(() => {
        expect(handleChange).to.have.been.called;
      });
  });

  it("devrait avoir un label", () => {
    cy.mount(
      <div className="flex items-center gap-2">
        <input type="checkbox" id="notify-switch" role="switch" />
        <label htmlFor="notify-switch">Notifications</label>
      </div>
    );
    cy.contains("Notifications").should("be.visible");
  });
});

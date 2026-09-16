describe("Checkbox Component", () => {
  it("devrait afficher une checkbox", () => {
    cy.mount(<input type="checkbox" />);
    cy.get("input[type='checkbox']").should("be.visible");
  });

  it("devrait être cochable", () => {
    cy.mount(<input type="checkbox" />);
    cy.get("input[type='checkbox']").check();
    cy.get("input[type='checkbox']").should("be.checked");
  });

  it("devrait être décochable", () => {
    cy.mount(<input type="checkbox" defaultChecked />);
    cy.get("input[type='checkbox']").uncheck();
    cy.get("input[type='checkbox']").should("not.be.checked");
  });

  it("devrait être désactivée", () => {
    cy.mount(<input type="checkbox" disabled />);
    cy.get("input[type='checkbox']").should("be.disabled");
  });

  it("devrait avoir une valeur", () => {
    cy.mount(<input type="checkbox" value="option1" />);
    cy.get("input[type='checkbox']").should("have.value", "option1");
  });

  it("devrait appeler onChange lors de la vérification", () => {
    const handleChange = cy.spy();
    cy.mount(
      <input type="checkbox" onChange={handleChange} />
    );
    cy.get("input[type='checkbox']")
      .check()
      .then(() => {
        expect(handleChange).to.have.been.called;
      });
  });

  it("devrait avoir un label associé", () => {
    cy.mount(
      <>
        <input type="checkbox" id="terms" />
        <label htmlFor="terms">J'accepte les conditions</label>
      </>
    );
    cy.get("label").should("contain", "J'accepte les conditions");
  });
});

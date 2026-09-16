describe("Radio Group Component", () => {
  it("devrait afficher des boutons radio", () => {
    cy.mount(
      <>
        <input type="radio" name="option" value="1" />
        <input type="radio" name="option" value="2" />
      </>
    );
    cy.get("input[type='radio']").should("have.length", 2);
  });

  it("devrait permettre de sélectionner une option", () => {
    cy.mount(
      <>
        <input type="radio" name="option" value="1" />
        <input type="radio" name="option" value="2" />
      </>
    );
    cy.get("input[type='radio']").first().check();
    cy.get("input[type='radio']").first().should("be.checked");
  });

  it("devrait désélectionner l'option précédente", () => {
    cy.mount(
      <>
        <input type="radio" name="option" value="1" defaultChecked />
        <input type="radio" name="option" value="2" />
      </>
    );
    cy.get("input[type='radio']").last().check();
    cy.get("input[type='radio']").first().should("not.be.checked");
    cy.get("input[type='radio']").last().should("be.checked");
  });

  it("devrait avoir des labels", () => {
    cy.mount(
      <>
        <input type="radio" name="option" id="opt1" value="1" />
        <label htmlFor="opt1">Option 1</label>
        <input type="radio" name="option" id="opt2" value="2" />
        <label htmlFor="opt2">Option 2</label>
      </>
    );
    cy.contains("Option 1").should("be.visible");
    cy.contains("Option 2").should("be.visible");
  });

  it("devrait être désactivé", () => {
    cy.mount(
      <input type="radio" name="option" value="1" disabled />
    );
    cy.get("input[type='radio']").should("be.disabled");
  });
});

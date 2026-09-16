describe("Input OTP Component", () => {
  it("devrait afficher des champs OTP", () => {
    cy.mount(
      <div className="input-otp">
        <input maxLength="1" placeholder="0" />
        <input maxLength="1" placeholder="0" />
        <input maxLength="1" placeholder="0" />
        <input maxLength="1" placeholder="0" />
      </div>
    );
    cy.get(".input-otp").should("be.visible");
    cy.get(".input-otp input").should("have.length", 4);
  });

  it("devrait accepter des chiffres", () => {
    cy.mount(
      <div className="input-otp">
        <input maxLength="1" type="text" />
        <input maxLength="1" type="text" />
        <input maxLength="1" type="text" />
        <input maxLength="1" type="text" />
      </div>
    );
    cy.get(".input-otp input").first().type("1");
    cy.get(".input-otp input").first().should("have.value", "1");
  });

  it("devrait avoir une limite de 1 caractère", () => {
    cy.mount(
      <div className="input-otp">
        <input maxLength="1" />
      </div>
    );
    cy.get(".input-otp input").should("have.attr", "maxLength", "1");
  });
});

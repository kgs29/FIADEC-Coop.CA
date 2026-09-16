describe("Form Component", () => {
  it("devrait afficher un formulaire", () => {
    cy.mount(
      <form className="form">
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
    );
    cy.get(".form").should("be.visible");
  });

  it("devrait afficher les champs du formulaire", () => {
    cy.mount(
      <form className="form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" />
        </div>
      </form>
    );
    cy.contains("label", "Name").should("be.visible");
    cy.contains("label", "Email").should("be.visible");
  });

  it("devrait avoir un bouton de soumission", () => {
    cy.mount(
      <form className="form">
        <input type="text" />
        <button type="submit">Send</button>
      </form>
    );
    cy.contains("button", "Send").should("be.visible");
  });

  it("devrait supporter la validation", () => {
    cy.mount(
      <form className="form">
        <input type="email" required />
        <button type="submit">Submit</button>
      </form>
    );
    cy.get("input[type='email']").should("have.attr", "required");
  });
});

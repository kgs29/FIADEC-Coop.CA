describe("Progress Component", () => {
  it("devrait afficher le pourcentage", () => {
    cy.mount(
      <div className="progress">
        <div className="progress-bar" style={{ width: "75%" }} />
        <span>75%</span>
      </div>,
    );
    cy.contains("75%").should("be.visible");
  });

  it("devrait accepter différentes valeurs", () => {
    cy.mount(
      <div>
        <div className="progress">
          <div className="progress-bar" style={{ width: "25%" }} />
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: "50%" }} />
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: "100%" }} />
        </div>
      </div>,
    );
    cy.get(".progress").should("have.length", 3);
  });

  it("devrait avoir une couleur de succès", () => {
    cy.mount(
      <div className="progress">
        <div className="progress-bar bg-green-500" style={{ width: "100%" }} />
      </div>,
    );
    cy.get(".progress-bar").should("have.class", "bg-green-500");
  });

  it("devrait avoir une couleur d'erreur", () => {
    cy.mount(
      <div className="progress">
        <div className="progress-bar bg-red-500" style={{ width: "30%" }} />
      </div>,
    );
    cy.get(".progress-bar").should("have.class", "bg-red-500");
  });
});

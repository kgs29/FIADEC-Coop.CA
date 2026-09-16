describe("Button Component", () => {
  it("devrait afficher un bouton par défaut", () => {
    cy.mount(<button>Click me</button>);
    cy.get("button").should("be.visible").should("contain", "Click me");
  });

  it("devrait être cliquable", () => {
    const handleClick = cy.spy();
    cy.mount(<button onClick={handleClick}>Click me</button>);
    cy.get("button").click();
    cy.wrap(handleClick).should("have.been.called");
  });

  it("devrait être désactivé", () => {
    cy.mount(<button disabled>Click me</button>);
    cy.get("button").should("be.disabled");
  });

  it("devrait accepter des variantes de style", () => {
    cy.mount(
      <button className="bg-primary text-white">Primary</button>
    );
    cy.get("button").should("have.class", "bg-primary");
  });
});

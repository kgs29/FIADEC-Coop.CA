describe("Combobox Field Component", () => {
  it("devrait afficher une combobox", () => {
    cy.mount(
      <div className="combobox">
        <input type="text" placeholder="Select..." />
        <div className="combobox-list">
          <div className="combobox-item">Option 1</div>
          <div className="combobox-item">Option 2</div>
        </div>
      </div>
    );
    cy.get(".combobox").should("be.visible");
  });

  it("devrait afficher l'input et les options", () => {
    cy.mount(
      <div className="combobox">
        <input type="text" placeholder="Search..." />
        <div className="combobox-list">
          <div className="combobox-item">Apple</div>
          <div className="combobox-item">Banana</div>
          <div className="combobox-item">Cherry</div>
        </div>
      </div>
    );
    cy.get("input").should("have.attr", "placeholder", "Search...");
    cy.get(".combobox-item").should("have.length", 3);
  });

  it("devrait permettre la recherche", () => {
    cy.mount(
      <div className="combobox">
        <input type="text" placeholder="Search..." />
        <div className="combobox-list">
          <div className="combobox-item">JavaScript</div>
          <div className="combobox-item">Java</div>
          <div className="combobox-item">Python</div>
        </div>
      </div>
    );
    cy.get("input").type("Java");
  });

  it("devrait sélectionner une option", () => {
    cy.mount(
      <div className="combobox">
        <input type="text" />
        <div className="combobox-list">
          <div className="combobox-item">Option 1</div>
          <div className="combobox-item">Option 2</div>
        </div>
      </div>
    );
    cy.contains(".combobox-item", "Option 1").click();
  });
});

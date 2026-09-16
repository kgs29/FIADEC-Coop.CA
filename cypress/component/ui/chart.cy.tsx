describe("Chart Component", () => {
  it("devrait afficher un graphique", () => {
    cy.mount(
      <div className="chart">
        <div className="chart-container">
          <svg>
            <rect x="0" y="0" width="100" height="100" />
          </svg>
        </div>
      </div>
    );
    cy.get(".chart").should("be.visible");
  });

  it("devrait afficher l'SVG du graphique", () => {
    cy.mount(
      <div className="chart">
        <svg width="300" height="200">
          <circle cx="150" cy="100" r="50" fill="blue" />
        </svg>
      </div>
    );
    cy.get("svg").should("be.visible");
  });

  it("devrait supporter les légendes", () => {
    cy.mount(
      <div className="chart">
        <svg width="300" height="200">
          <rect x="10" y="10" width="50" height="50" fill="red" />
        </svg>
        <div className="chart-legend">
          <span className="legend-item">Series 1</span>
        </div>
      </div>
    );
    cy.contains("Series 1").should("be.visible");
  });

  it("devrait avoir un titre", () => {
    cy.mount(
      <div className="chart">
        <h3>Chart Title</h3>
        <svg width="300" height="200"></svg>
      </div>
    );
    cy.contains("h3", "Chart Title").should("be.visible");
  });
});

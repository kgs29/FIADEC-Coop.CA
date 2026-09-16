describe("Calendar Component", () => {
  it("devrait afficher un calendrier", () => {
    cy.mount(
      <div className="calendar">
        <div className="calendar-header">
          <h2>January 2024</h2>
        </div>
        <div className="calendar-grid">
          <div>S</div>
          <div>M</div>
          <div>T</div>
        </div>
      </div>
    );
    cy.get(".calendar").should("be.visible");
  });

  it("devrait afficher le mois et l'année", () => {
    cy.mount(
      <div className="calendar">
        <div className="calendar-header">
          <h2>February 2024</h2>
        </div>
      </div>
    );
    cy.contains("h2", "February 2024").should("be.visible");
  });

  it("devrait afficher les jours de la semaine", () => {
    cy.mount(
      <div className="calendar">
        <div className="calendar-grid">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
      </div>
    );
    cy.contains("Sun").should("be.visible");
    cy.contains("Sat").should("be.visible");
  });

  it("devrait afficher les dates", () => {
    cy.mount(
      <div className="calendar">
        <div className="calendar-grid">
          <button className="date">1</button>
          <button className="date">15</button>
          <button className="date">28</button>
        </div>
      </div>
    );
    cy.contains("button", "1").should("be.visible");
    cy.contains("button", "28").should("be.visible");
  });
});

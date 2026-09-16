describe("Carousel Component", () => {
  it("devrait afficher un carousel", () => {
    cy.mount(
      <div className="carousel">
        <div className="carousel-item">Slide 1</div>
        <div className="carousel-item">Slide 2</div>
        <div className="carousel-item">Slide 3</div>
      </div>
    );
    cy.get(".carousel").should("be.visible");
  });

  it("devrait afficher les slides", () => {
    cy.mount(
      <div className="carousel">
        <div className="carousel-item">Image 1</div>
        <div className="carousel-item">Image 2</div>
        <div className="carousel-item">Image 3</div>
      </div>
    );
    cy.get(".carousel-item").should("have.length", 3);
  });

  it("devrait avoir les boutons next/previous", () => {
    cy.mount(
      <div className="carousel">
        <button className="prev">Prev</button>
        <div className="carousel-item">Slide</div>
        <button className="next">Next</button>
      </div>
    );
    cy.contains("button", "Prev").should("be.visible");
    cy.contains("button", "Next").should("be.visible");
  });

  it("devrait supporter les indicateurs", () => {
    cy.mount(
      <div>
        <div className="carousel">
          <div className="carousel-item">Slide 1</div>
          <div className="carousel-item">Slide 2</div>
        </div>
        <div className="carousel-indicators">
          <button className="indicator active"></button>
          <button className="indicator"></button>
        </div>
      </div>
    );
    cy.get(".indicator").should("have.length", 2);
  });
});

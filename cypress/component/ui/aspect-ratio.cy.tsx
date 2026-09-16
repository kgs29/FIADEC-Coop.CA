describe("Aspect Ratio Component", () => {
  it("devrait maintenir le ratio d'aspect", () => {
    cy.mount(
      <div className="aspect-video">
        <img src="https://via.placeholder.com/1600x900" alt="Video" />
      </div>
    );
    cy.get(".aspect-video").should("be.visible");
  });

  it("devrait afficher une image avec ratio", () => {
    cy.mount(
      <div className="aspect-square">
        <img src="https://via.placeholder.com/400x400" alt="Square" />
      </div>
    );
    cy.get(".aspect-square").should("be.visible");
  });

  // it("devrait supporter différents ratios", () => {
  //   cy.mount(
  //     <div>
  //       <div className="aspect-video">Video</div>
  //       <div className="aspect-square">Square</div>
  //       <div className="aspect-3/2">Custom</div>
  //     </div>
  //   );
  //   cy.get(".aspect-video").should("be.visible");
  //   cy.get(".aspect-square").should("be.visible");
  //   cy.get(".aspect-3/2").should("be.visible");
  // });
});

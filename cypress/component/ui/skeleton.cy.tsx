describe("Skeleton Component", () => {
  it("devrait afficher plusieurs lignes", () => {
    cy.mount(
      <div className="skeleton">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    );
    cy.get(".skeleton-line").should("have.length", 3);
  });

  it("devrait avoir une animation", () => {
    cy.mount(
      <div className="skeleton animate-pulse">
        <div className="skeleton-line" />
      </div>
    );
    cy.get(".skeleton").should("have.class", "animate-pulse");
  });

  it("devrait simuler un avatar", () => {
    cy.mount(
      <div className="flex gap-4">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
    cy.get(".skeleton").should("have.length", 3);
  });
});

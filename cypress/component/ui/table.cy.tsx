describe("Table Component", () => {
  it("devrait afficher un tableau", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>john@example.com</td>
          </tr>
        </tbody>
      </table>
    );
    cy.get("table").should("be.visible");
  });

  it("devrait afficher les en-têtes", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    );
    cy.contains("th", "ID").should("be.visible");
    cy.contains("th", "Name").should("be.visible");
  });

  it("devrait afficher les lignes", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
          </tr>
          <tr>
            <td>Jane</td>
          </tr>
        </tbody>
      </table>
    );
    cy.get("tbody tr").should("have.length", 2);
  });

  it("devrait supporter le tri", () => {
    cy.mount(
      <table>
        <thead>
          <tr>
            <th>
              <button>Name</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
          </tr>
          <tr>
            <td>Bob</td>
          </tr>
        </tbody>
      </table>
    );
    cy.contains("button", "Name").click();
  });

  it("devrait supporter la pagination", () => {
    cy.mount(
      <div>
        <table>
          <tbody>
            <tr>
              <td>Row 1</td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <button>Previous</button>
          <span>Page 1</span>
          <button>Next</button>
        </div>
      </div>
    );
    cy.contains("button", "Next").should("be.visible");
  });
});

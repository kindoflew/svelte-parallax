describe("Parallax", () => {
  const HEIGHT = Cypress.config('viewportHeight');
  beforeEach(() => {
    cy.visit('/test-demo');
  });

  it("should translate a layer as expected", () => {
    cy.get('.parallax-layer')
      .should('have.attr', 'style')
      .should('contain', `transform: translate3d(0, ${HEIGHT * 2}px, 0)`);

    cy.scrollTo(0, 660);

    cy.get('.parallax-layer', {timeout: 3000})
      .should('have.attr', 'style')
      .should('contain', `transform: translate3d(0, ${HEIGHT}px, 0)`);

    cy.scrollTo('bottom');

    cy.get('.parallax-layer', {timeout: 3000})
      .should('have.attr', 'style')
      .should('contain', `transform: translate3d(0, 0px, 0)`);
  });

  it("should scroll to the correct page with scrollTo", () => {
    cy.get('button').click();
    cy.wait(3000);
    cy.window().its('scrollY').should('equal', HEIGHT);
  });
});
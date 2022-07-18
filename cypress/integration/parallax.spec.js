describe("Parallax", () => {
  const HEIGHT = Cypress.config('viewportHeight');
  beforeEach(() => {
    cy.visit('/test-demo');
  });

  it("should translate a layer as expected", () => {
    cy.get('.parallax-layer')
      .should('have.attr', 'style')
      .should('contain', `transform: translate3d(0px, ${HEIGHT * 2}px, 0px)`);
    
    cy.get('.sticky-layer')
      .should('have.attr', 'style')
      .should('contain', 'position: absolute')
      .should('contain', `transform: translate3d(0px, ${HEIGHT / 2}px, 0px)`);

    cy.scrollTo(0, HEIGHT);

    cy.get('.parallax-layer', {timeout: 3000})
      .should('have.attr', 'style')
      .should('contain', `transform: translate3d(0px, ${HEIGHT}px, 0px)`);
    
    cy.get('.sticky-layer')
      .should('have.attr', 'style')
      .should('contain', 'position: fixed')
      .should('contain', `transform: translate3d(0px, 0px, 0px)`);

    cy.scrollTo('bottom');

    cy.get('.parallax-layer', {timeout: 3000})
      .should('have.attr', 'style')
      .should('contain', `transform: translate3d(0px, 0px, 0px)`);

    cy.get('.sticky-layer')
      .should('have.attr', 'style')
      .should('contain', 'position: absolute')
      .should('contain', `transform: translate3d(0px, ${HEIGHT * 1.5}px, 0px)`);
  });

  it("should scroll to the correct page with scrollTo", () => {
    cy.get('button').click();
    cy.wait(3000);
    cy.window().its('scrollY').should('equal', HEIGHT);
  });

  it("onProgress and let:progress should have expected values", () => {
    cy.get('.parallax-progress-details').should('contain', '0 1 0');
    cy.get('.layer-progress-details').should('contain', '0');
    cy.get('.layer-let-progress').should('contain', '0');
    cy.get('.sticky-progress-details').should('contain', '0');
    cy.get('.sticky-let-progress').should('contain', '0');

    cy.scrollTo(0, HEIGHT / 2);

    cy.get('.parallax-progress-details').should('contain', '0.25 1 0.5');
    cy.get('.layer-progress-details').should('contain', '0');
    cy.get('.layer-let-progress').should('contain', '0');
    cy.get('.sticky-progress-details').should('contain', '0');
    cy.get('.sticky-let-progress').should('contain', '0');

    cy.scrollTo(0, HEIGHT);

    cy.get('.parallax-progress-details').should('contain', '0.5 2 0');
    cy.get('.layer-progress-details').should('contain', '0.5');
    cy.get('.layer-let-progress').should('contain', '0.5');
    cy.get('.sticky-progress-details').should('contain', '0.5');
    cy.get('.sticky-let-progress').should('contain', '0.5');

    cy.scrollTo('bottom');

    cy.get('.parallax-progress-details').should('contain', '1 3 0');
    cy.get('.layer-progress-details').should('contain', '1');
    cy.get('.layer-let-progress').should('contain', '1');
    cy.get('.sticky-progress-details').should('contain', '1');
    cy.get('.sticky-let-progress').should('contain', '1');
  });
});

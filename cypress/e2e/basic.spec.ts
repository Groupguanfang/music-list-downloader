context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('basic nav', () => {
    cy.get('nav')
      .should('exist')
      .get('button')
      .should('exist')
      .should('have.length', 6)
  })

  // beforeEach(() => {
  //   cy.visit('/')
  // })

  // it('basic nav', () => {
  //   cy.url()
  //     .should('eq', 'http://localhost:3333/')

  //   cy.contains('[Home Layout]')
  //     .should('exist')

  //   cy.get('#input')
  //     .type('Vitesse{Enter}')
  //     .url()
  //     .should('eq', 'http://localhost:3333/hi/Vitesse')

  //   cy.contains('[Default Layout]')
  //     .should('exist')

  //   cy.get('[btn]')
  //     .click()
  //     .url()
  //     .should('eq', 'http://localhost:3333/')
  // })

  // it('markdown', () => {
  //   cy.get('[data-test-id="about"]')
  //     .click()
  //     .url()
  //     .should('eq', 'http://localhost:3333/about')

  //   cy.get('.shiki')
  //     .should('exist')
  // })
})

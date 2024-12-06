import { match } from 'ts-pattern'

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
      .each(($el, index) => match(index).with(0, () => {
        cy.wrap($el).click().wait(2000)
        cy.url().should('eq', 'http://localhost:5173/')
      }).with(1, () => {
        cy.wrap($el).click().wait(2000)
        cy.url().should('eq', 'http://localhost:5173/my')
      }).otherwise(() => void 0))
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

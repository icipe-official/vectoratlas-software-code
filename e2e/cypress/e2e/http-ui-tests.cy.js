import { accountDetails, pageHeadings, URL } from '../support/constants.js';

describe('Web environment test', () => {
    it('Opens VA homepage from web URL and checks that links to pages exists', () => {
      cy.visit(URL.webURL)
      cy.contains('alpha version of the Vector Atlas')
      cy.contains('Map').exists
      cy.contains('About').exists
      cy.contains('Login').exists
    })
  })

  describe('Vector Atlas help site - web', () => {
    it('Checks the help site can be accessed', () => {
      cy.visit(URL.webURL + URL.helpURL)
      cy.get("H1").should("exist").contains(pageHeadings.helpTitle)
    })
  })
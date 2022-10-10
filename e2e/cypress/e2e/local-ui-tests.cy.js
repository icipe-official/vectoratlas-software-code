import { accountDetails, pageHeadings, URL } from '../support/constants.js';

describe('Local environment test', () => {
    it('Opens VA homepage from local URL and checks that links to pages exists', () => {
      cy.visit(URL.localURL)
      cy.contains('alpha version of the Vector Atlas')
      cy.contains('Map').exists
      cy.contains('About').exists
      cy.contains('Login').exists
    })
  })

  describe('Vector Atlas help site - local', () => {
    it('Checks the help site can be accessed', () => {
      cy.visit(URL.localURL + URL.helpURL)
      cy.get("H1").should("exist").contains(pageHeadings.helpTitle)
    })
  })
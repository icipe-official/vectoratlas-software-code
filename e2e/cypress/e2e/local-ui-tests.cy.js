import { accountDetails, pageHeadings, URL } from '../support/constants.js';

describe('Local environment test', () => {
    it('Opens VA homepage in the local environment', () => {
      cy.visit(URL.localURL)
    }),
    it('Checks that a banner stating "Alpha Version" can be seen', () => {
      cy.contains('alpha version of the Vector Atlas')
    }),
    it('Checks for a "Map" link', () => {
      cy.contains('Map').exists
    }),
    it('Checks for an "About" link', () => {
      cy.contains('About').exists
    }),
    it('Checks for a "Login" link', () => {
      cy.contains('Login').exists
    })
  })

  describe('Vector Atlas help site - local', () => {
    it('Checks the help site can be accessed - local', () => {
      cy.visit(URL.localURL + URL.helpURL)
    }),
    it('Checks the heading of the help site', () => {
      cy.get("H1").should("exist").contains(pageHeadings.helpTitle)
    })
  })
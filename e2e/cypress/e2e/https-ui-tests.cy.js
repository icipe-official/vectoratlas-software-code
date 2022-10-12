import { accountDetails, pageHeadings, URL } from '../support/constants.js';

describe('Web environment test', () => {
  it('Checks that the Vector Atlas logo is visible', () => {
    cy.visit(URL.webURL)
    cy.get('img[alt="Vector Atlas logo"]').should('be.visible')
  })
  it('Opens VA homepage from web URL and checks that links to pages exists', () => {
    cy.visit(URL.webURL)
    cy.contains('Map').exists
    cy.contains('About').exists
    cy.contains('Login').exists
  })
  it('Checks that an "alpha version" banner is visible', () => {
    cy.visit(URL.webURL)
    cy.contains('alpha version of the Vector Atlas, it is our latest code and subject to change')
  })
  it('Checks that a UI and API version appear on the website', () => {
    cy.visit(URL.webURL)
    cy.get('footer').contains('UI Version:').and('contain', 'API Version:')
    cy.get('footer').contains('error').should('not.exist')
  })
})

describe('Pages and content test', () => {
  it('Checks links to "About", "Map" and "Login" exists, can be clicked and that content exists on those pages', () => {
    cy.visit(URL.webURL)
    cy.contains('Our data will be fully up to date and form the basis of a series of spatial models specifically tailored to inform the control of mosquito vectors of disease.')
    cy.contains('About').click()
    cy.url().should('include', '/about')
    cy.get(".MuiTypography-sectionTitle").should("exist").contains("About")
    cy.contains('Maps are a powerful tool. They can illustrate the distribution of mosquito vector species known to transmit some of the world')
    cy.contains('Map').click()
    cy.url().should('include', '/map')
    cy.contains('Home').click()
    cy.url().should('include', '/')
    cy.contains('Login')
  })
})

describe('Log in page and form tests', () => {
  it('Checks the Log in page fields can be completed with a username and password', () => {
    cy.visit(URL.webURL + URL.loginURL)
    cy.get('input[name="username"]').type(accountDetails.email)
    cy.get('input[name="password"]').type(accountDetails.password)
    cy.get('button[name="action"]')
  })
})

describe('Vector Atlas help site - local', () => {
  it('Checks the help site can be accessed', () => {
    cy.visit(URL.webURL + URL.helpURL)
    cy.get("H1").should("exist").contains(pageHeadings.helpTitle)
  })
  it('Checks that screenshots can be displayed', () => {
    cy.contains('How to upload Vector Atlas data').click()
    cy.get('img[alt="homepage"]').should('be.visible')
  })
})
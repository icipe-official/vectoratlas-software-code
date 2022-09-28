import { accountDetails, pageHeadings, URL } from '../support/constants.js';




describe('Page test', () => {
  it('Opens the VA homepage and checks for links to About, Map and Login', () => {

    cy.viewport(1920, 1080)
    cy.visit(URL.localURL)
    cy.contains('About').click()

    cy.url().should('include', '/about')
    cy.get(".MuiTypography-sectionTitle").should("exist").contains("About")
    cy.contains('Maps are a powerful tool. They can illustrate the distribution of mosquito vector species known to transmit some of the world')

    
    cy.contains('Map').click()
    cy.url().should('include', '/map')
    

    cy.get('#opacity-input').then(elem => {
      elem.val(0.5);
  });

    cy.wait(500)

    cy.get('#opacity-input').then(elem => {
      elem.val(0.25);
  });

    cy.wait(500)

    cy.contains('Home').click()

    // Should be on a new URL which
    // includes '/map'
    cy.url().should('include', '/')

    cy.contains('Our data will be fully up to date and form the basis of a series of spatial models specifically tailored to inform the control of mosquito vectors of disease.')
  })
})

describe('Check a "Login" link exists on the homepage', () => {
  it('Opens VA homepage, navigates to the login page and checks for a "Login" link', () => {

    cy.viewport(1920, 1080)

    cy.visit(URL.localURL).contains('Login').exists

  })
})

//describe('Check that a user can log into Vector Atlas with Auth0', () => {
//  it('Logs into Vector Atlas via auth0', () => {
//
//    cy.viewport(1920, 1080)
//    cy.visit("http://localhost:3000/api/auth/login")
//    cy.get('input[name="username"]').type(accountDetails.email)
//    cy.get('input[name="password"]').type(accountDetails.password)
//    cy.get('button[name="action"]').click()
//  })
//})
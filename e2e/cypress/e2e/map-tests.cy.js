import { accountDetails, pageHeadings, URL, API } from '../support/constants.js';

describe('Map page tests', () => {

    it('Opens the Map page', () => { 
        cy.viewport(1920, 1080)
        cy.visit(URL.webURL + 'map')
    })
    it('Checks Attributions text contains "Made with Natural Earth"', () => { 
        cy.get('button[title="Attributions"]').click()
        cy.wait(500)
        cy.get('.ol-attribution').contains('Made with Natural Earth')  
    })
    it('Checks for and expands "Overlays" section', () => {
        cy.get('.MuiButtonBase-root[data-testid="overlaysButton"]').click()
    })
    it('Checks for and expands "Base Map" section', () => {
        cy.get('.MuiButtonBase-root[data-testid="baseMapButton"]').click()
    })




})
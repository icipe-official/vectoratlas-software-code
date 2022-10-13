import { accountDetails, pageHeadings, URL, API } from '../support/constants.js';

describe('Map page tests', () => {

    it('Opens the Map page', () => { 
        
        cy.viewport(1920, 1080)

        cy.visit(URL.webURL + 'map')

        cy.wait(1000)
    })

    it('Set the Map opacity slider to 0.5', () => { 
        cy.get('#opacity-input').then(elem => {
            elem.val(0.5)

            cy.wait(1000)
        })        
    }) 

    it('Set the Map opacity slider to 0.25', () => { 
        cy.get('#opacity-input').then(elem => {
            elem.val(0.25) 
        }) 
    })

    it('Checks Attributions text contains "Made with Natural Earth"', () => { 
        cy.get('button[title="Attributions"]').click()

        cy.get('.ol-attribution').contains('Made with Natural Earth')
            
        
    })





})
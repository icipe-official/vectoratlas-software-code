import { accountDetails, pageHeadings, URL, API } from '../support/constants.js';

describe('API Feature Flag tests', () => {
    it('Send a GET request that returns the status of feature flags', () => {
      cy.request(API.apiURL + API.featureFlags)
    }),
    it('Checks the response code is 200', () => {
        cy.request(API.apiURL + API.featureFlags).then((response) => { 
            expect(response.status).to.eq(200)
        })
    })  
  })

describe('API Version tests', () => {
    it('Send a GET request that returns the website version', () => {
      cy.request(API.apiURL + API.version)
    }),
    it('Checks the response code is 200', () => {
        cy.request(API.apiURL + API.version).then((response) => { 
            expect(response.status).to.eq(200)
        })
    })  
  })

describe('API Map Styles tests', () => {
    it('Send a GET request that returns the map style settings', () => {
      cy.request(API.apiURL + API.mapStyles)
    }),
    it('Checks the response code is 200', () => {
        cy.request(API.apiURL + API.mapStyles).then((response) => { 
            expect(response.status).to.eq(200)
        })
    })  
  })

describe('API Tile Server Overlay tests', () => {
    it('Send a GET request that returns tile server overlay settings', () => {
      cy.request(API.apiURL + API.tileServerOverlay)
    }),
    it('Checks the response code is 200', () => {
        cy.request(API.apiURL + API.tileServerOverlay).then((response) => { 
            expect(response.status).to.eq(200)
        })
    })  
  })

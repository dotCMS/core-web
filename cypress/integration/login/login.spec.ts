describe('Login Page', () => {
    // it('should visit login page', () => {
    //     cy.visit('/dotAdmin');
    //     cy.get('[data-testid=userNameInput]').type(Cypress.config('adminUsername'));
    //     cy.get('[data-testid=password]').type(Cypress.config('adminPassword'));
    //     cy.get('[data-testid=submitButton]').click();
    //     cy.url().should('include', '/dotAdmin/#/starter')
    // });

    it('should visit login page', () => {
        cy.request({
            method: 'POST',
            url: '/api/v1/authentication/api-token',
            body: {
                user: Cypress.config('adminUsername'),
                password: Cypress.config('adminPassword')
            }
        }).then((response) => {
            console.log('***token', response.body.entity.token);
            localStorage.setItem('token', response.body.entity.token);
            cy.visit('/dotAdmin/#/starter');
            cy.get('.dot-starter-description em').should('contain', 'Admin');
        });

        // cy.visit('/dotAdmin');
        // cy.get('[data-testid=userNameInput]').type(Cypress.config('adminUsername'));
        // cy.get('[data-testid=password]').type(Cypress.config('adminPassword'));
        // cy.get('[data-testid=submitButton]').click();
    });
});

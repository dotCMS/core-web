import Form from '@e2e/shared/Form';


describe('Test', () => {
    it('lgin page', () => {
        cy.visit('/dotAdmin');
        cy.wait(10000)
        Form.fill('#inputtext', 'cypress Admin');
        cy.wait(5000)
        Form.fill('input[type="password"]', 'cypressPassw');
    });
});

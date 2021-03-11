/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable<Subject> {
        form_request(
            method: string,
            url: string,
            formData: FormData,
            callback: Function
        ): Chainable<any>;
        // iframe(): Chainable<any>;
    }
}

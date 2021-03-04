/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable<Subject> {
        getByDataTest(tag: string): Chainable<any>;
        styles(checkData: string | string[], pseudo?: 'after' | 'before'): Chainable<any>;
    }
}

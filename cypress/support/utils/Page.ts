class Page {
    static click(selector: string | Cypress.Chainable) {
        if (typeof selector === 'string') {
            cy.get(selector).click();
        } else {
            selector.click({ force: true });
        }
    }

    static assertElementContains(selector: string, text: string) {
        return cy.get(selector).contains(text);
    }

    static assertElementSize(selector: string | Cypress.Chainable, size: number) {
        if (typeof selector === 'string') {
            return cy.get(selector).should(($div) => {
                expect($div).to.have.length(size);
            });
        } else {
            return selector.should(($div) => {
                expect($div).to.have.length(size);
            });
        }
    }
}

export default Page;

class Page {
    static click(selector: string | Cypress.Chainable) {
        if (typeof selector === 'string') {
            cy.get(selector).click();
        } else {
            selector.click();
        }
    }

    static clickElement(selector: string, text: string) {
        let e = cy.get(selector);

        if (text !== null) {
            e = e.contains(text);
        }

        e.click();
    }

    static assertElementContains(selector: string, text: string) {
        return cy.get(selector).contains(text);
    }

    static assertElementSize(selector: string, size: number) {
        return cy.get(selector).should(($div) => {
            expect($div).to.have.length(size);
        });
    }
}

export default Page;

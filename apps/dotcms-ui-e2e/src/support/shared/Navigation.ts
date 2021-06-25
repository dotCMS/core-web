class Navigation {
    static visit(url: string, options?: Cypress.VisitOptions) {
        cy.visit(url, options);
    }

    static assertPageUrlIs(url: string) {
        cy.location().should((location) => {
            expect(location.href.indexOf(url)).to.be.greaterThan(-1);
        });
    }

    static async getIdFromUrl(): Promise<string> {
        const text = await new Cypress.Promise<string>((resolve) => {
            cy.location()
                .its('href')
                .then((url: string) => {
                    resolve(url.toString());
                });
        });
        return text;
    }
}

export default Navigation;

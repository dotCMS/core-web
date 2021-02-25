class Navigation {
    static visit(url: string, options?: Cypress.VisitOptions) {
        cy.visit(url, options);
    }

    static assertPageUrlIs(url: string) {
        cy.location()
            .its('href')
            .should('eq', `${Cypress.config('baseUrl')}${url}`);
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

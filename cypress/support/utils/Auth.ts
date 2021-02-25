class Auth {
    static login = (username?: string, password?: string) => {
        cy.request({
            method: 'POST',
            url: '/api/v1/authentication/api-token',
            body: {
                user: username || Cypress.config('adminUsername'),
                password: password || Cypress.config('adminPassword')
            }
        }).then((response: Cypress.Response) => {
            localStorage.setItem('token', response.body.entity.token);
        });
    };
}
export default Auth;

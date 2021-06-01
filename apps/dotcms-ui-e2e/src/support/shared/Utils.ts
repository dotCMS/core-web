class Utils {
    static login(username?: string, password?: string): Promise<string> {
        return new Cypress.Promise((resolve) => {
            if (localStorage.getItem('token')) {
                resolve(localStorage.getItem('token'));
            } else {
                cy.request({
                    method: 'POST',
                    url: '/api/v1/authentication/api-token',
                    body: {
                        user: username || Cypress.env('adminUsername'),
                        password: password || Cypress.env('adminPassword')
                    }
                }).then((response: Cypress.Response) => {
                    localStorage.setItem('token', response.body.entity.token);
                    resolve(response.body.entity.token);
                });
            }
        });
    }
}
export default Utils;

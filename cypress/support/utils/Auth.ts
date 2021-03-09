class Utils {
    static login(username?: string, password?: string) {
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
    }

    static DBSeed() {
        // Declarations
        const fileName = 'Cypress-DB-Seed.tar.gz';
        const method = 'POST';
        const url = '/api/bundle?sync=true';
        const fileType = 'application/gzip';
        // const inputContent2 = 'input_content2';
        // const expectedAnswer = '{"msg":"X elements from the excel where successfully imported"}';

        // Get file from fixtures as binary
        cy.fixture(fileName, 'binary').then((excelBin) => {
            // File in binary format gets converted to blob so it can be sent as Form data
            const blob = Cypress.Blob.binaryStringToBlob(excelBin, fileType);
            // .then((blob) => {

            // Build up the form
            const formData = new FormData();
            formData.set('file', blob, fileName); // adding a file to the form
            // formData.set('input2', inputContent2); //adding a plain input to the form
            // .
            // .
            // .
            // Perform the request
            cy.form_request(method, url, formData, function (response) {
                expect(response.status).to.eq(200);
                // expect(expectedAnswer).to.eq(response.response);
            });

            // })
        });
    }
}
export default Utils;

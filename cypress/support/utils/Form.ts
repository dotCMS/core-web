class Form {
    static fill(selector: string, text: string) {
        cy.get(selector).type(text);
    }

    static submit(selector: string) {
        cy.get(selector).get('input[type="submit"]').click();
    }
}

export default Form;

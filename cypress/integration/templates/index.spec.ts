import DotSiteBrowser from '../../pages/DotSiteBrowser/DotSiteBrowser';
import Templates from '../../pages/DotTemplates/DotTemplates';
import Auth from '../../support/utils/Auth';

describe('Templates', () => {
    beforeEach(() => {
        Auth.login();
    });

    it('Create Template and create Page with that template', () => {
        // // Load Page
        Templates.openPage();
        // Templates.checkTemplatesPageLoaded();

        // // Create Template
        // Templates.openCreateTemplateDialog();
        // Templates.fillCreateTemplateForm({ title: 'CypressTemplate', theme: 'travel' });
        // Templates.submitCreateTemplateForm();

        // // Edit Template
        // Templates.checkEditTemplatesPageLoaded();
        // Templates.addContainer({ type: 'Default - demo.dotcms.com' });
        // Templates.saveEditTemplate();

        cy.wait(100); // TODO: Find fix

        // Site Browser
        DotSiteBrowser.openPage();
        cy.wait(100); // TODO: Find fix
        DotSiteBrowser.checkSiteBrowserPageLoaded();
        DotSiteBrowser.openCreatePageDialog({ type: 'Page' });

        DotSiteBrowser.fillCreatePageForm({
            title: 'Cypress Page',
            template: 'CypressTemplatedemo.dotcms.com'
        });
    });
});

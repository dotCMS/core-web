import DotEditPage from '../../pages/DotSiteBrowser/DotEditPage';
import DotSiteBrowser from '../../pages/DotSiteBrowser/DotSiteBrowser';
import Templates from '../../pages/DotTemplates/DotTemplates';
import Auth from '../../support/utils/Auth';

const PAGE_NAME = 'Cypress Pageas';

describe('Templates', () => {
    beforeEach(() => {
        Auth.login();
    });

    it('Create Template and create Page with that template - Part 1', () => {
        // // Load Page
        Templates.openPage();
        Templates.checkTemplatesPageLoaded();

        // Create Template
        Templates.openCreateTemplateDialog();
        Templates.fillCreateTemplateForm({ title: 'CypressTemplate', theme: 'travel' });
        Templates.submitCreateTemplateForm();

        // Edit Template
        Templates.checkEditTemplatesPageLoaded();
        Templates.addContainer({ type: 'Default - demo.dotcms.com' });
        Templates.saveEditTemplate();

        // Site Browser
        cy.log('Opening DotSiteBrowser');
        DotSiteBrowser.openPage();
        DotSiteBrowser.checkSiteBrowserPageLoaded();
        DotSiteBrowser.openCreatePageDialog({ type: 'Page' });

        DotSiteBrowser.fillCreatePageForm({
            title: PAGE_NAME,
            template: 'CypressTemplatedemo.dotcms.com'
        });

        DotSiteBrowser.submitCreatePageForm({ action: 'Save' });
    });

    it('Create Template and create Page with that template - Part 2', () => {
        // Edit Page
        DotEditPage.openPage(PAGE_NAME);

        DotEditPage.goToMode({ type: 'Edit' });
        DotEditPage.openAddToContainerDialog({ type: 'Content' });
        DotEditPage.addElementToContainer({ elementNumber: 0 });
        DotEditPage.checkToastMessage({ message: 'All changes Saved' });

        DotEditPage.goToMode({ type: 'Preview' });
        DotEditPage.checkContainerMustHaveElements({ container: '#section-1', size: 1 });
    });
});

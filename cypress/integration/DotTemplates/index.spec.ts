import DotEditPage from '../../pages/DotSiteBrowser/DotEditPage';
import DotSiteBrowser from '../../pages/DotSiteBrowser/DotSiteBrowser';
import Templates from '../../pages/DotTemplates/DotTemplates';
import Utils from '../../support/utils/Auth';

const PAGE_NAME = 'Cypress Page1';

describe('Templates', () => {
    before(() => {
        Utils.login();
        Utils.DBSeed();
    });
    beforeEach(() => {
        Utils.login();
    });

    it('Create Template and create Page with content using previous template - Part 1/2', () => {
        // // Load Page
        Templates.openPage();
        Templates.checkTemplatesPageLoaded();

        // Create Template
        Templates.openCreateTemplateDialog();
        Templates.fillCreateTemplateForm({ title: 'CypressTemplate', theme: 'default' });
        Templates.submitCreateTemplateForm();

        // Edit Template
        Templates.checkEditTemplatesPageLoaded();
        Templates.addContainer({ type: 'Default - default' });
        Templates.saveEditTemplate();

        // Site Browser
        cy.log('Opening DotSiteBrowser');
        DotSiteBrowser.openPage();
        cy.wait(1000);
        DotSiteBrowser.checkSiteBrowserPageLoaded();
        DotSiteBrowser.openCreatePageDialog({ type: 'Page' });

        DotSiteBrowser.fillCreatePageForm({
            title: PAGE_NAME,
            template: 'CypressTemplatedefault'
        });

        DotSiteBrowser.submitCreatePageForm({ action: 'Save' });
    });

    it('Create Template and create Page with content using previous template - Part 2/2', () => {
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

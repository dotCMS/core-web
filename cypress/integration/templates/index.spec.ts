import Templates from '../../pages/DotTemplates/DotTemplates';
import Auth from '../../support/utils/Auth';

describe('Templates', () => {
    beforeEach(() => {
        Auth.login();
    });

    it('Create Template', () => {
        // Load Page
        Templates.openPage();
        Templates.checkTemplatesPageLoaded();

        // Create Template
        Templates.openCreateTemplateDialog();
        Templates.fillCreateTemplateForm({ title: 'CypressTemplate', theme: 'travel' });
        Templates.submitCreateTemplateForm();

        // Edit Template
        Templates.checkEditTemplatesPageLoaded();
        Templates.addContainer({ type: 'Default - demo.dotcms.com' });
    });
});

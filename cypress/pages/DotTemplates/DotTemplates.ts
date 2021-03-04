import Form from '../../support/utils/Form';
import Navigation from '../../support/utils/Navigation';
import Page from '../../support/utils/Page';

const URL = '/dotAdmin/#/templates';
const CREATE_TEMPLATE_BUTTON = 'dot-action-button dot-icon i';

class DotTemplates {
    static openPage() {
        Navigation.visit(URL);
        Navigation.assertPageUrlIs(URL);
    }

    static checkTemplatesPageLoaded() {
        cy.intercept('GET', 'v1/templates').as('templates');
        cy.wait('@templates');
        Page.assertElementContains('.p-breadcrumb > ul > :nth-child(3)', `Templates`); // Header
        Page.assertElementSize('p-table', 1); // Table
        Page.assertElementSize('.action-header__global-search input[type="text"]', 1); // Global Search Input
        Page.assertElementContains('.template-listing__header-options p-checkbox', `Show Archived`); // Show Archived button
        Page.assertElementContains('.template-listing__header-options .p-button-label', `Actions`); // BulkAction button
        Page.assertElementContains(CREATE_TEMPLATE_BUTTON, `add`); // Action button
    }

    static openCreateTemplateDialog() {
        Page.click(CREATE_TEMPLATE_BUTTON);
        Page.assertElementContains('.p-dialog-title', 'Create a template');
        Page.assertElementContains('label[data-testid="designer"] span', 'Designer');
        Page.assertElementContains('label[data-testid="advanced"] span', 'Advanced');
        Page.assertElementContains(
            'p[data-testid="description"]',
            'Template Designer create reusable templates using a drag and drop interface and tools.'
        );
        Page.assertElementContains('dot-dot-template-selector button', 'Next').click();
    }

    static fillCreateTemplateForm({ title, theme }: { title: string; theme: string }) {
        // TODO: Complete to fill extra fields (not required)
        Form.fill('input[data-testid="templatePropsTitleField"]', title);
        Page.click('dot-theme-selector-dropdown[data-testid="templatePropsThemeField"]');
        Page.click(
            cy.get('.theme-selector__data-list-item .dot-theme-item__label').contains(theme)
        );
    }

    static submitCreateTemplateForm() {
        Page.click('button[data-testid="dotFormDialogSave"');
    }

    static checkEditTemplatesPageLoaded() {
        // TODO: Check other components loaded on Edit Template page
        Page.assertElementContains('#p-tabpanel-0-label .p-tabview-title', `design`); // Secondary Menu bar
        Page.assertElementContains('#p-tabpanel-1-label .p-tabview-title', `Permissions`); // Secondary Menu bar
        Page.assertElementContains('#p-tabpanel-2-label .p-tabview-title', `History`); // Secondary Menu bar
        Page.assertElementContains('.dot-edit-layout__toolbar-save', `Save`); // Save button
        Page.assertElementContains('dot-searchable-dropdown button', `Add a Container`); // Add container select
    }

    static addContainer({ type }: { type: string }) {
        Page.click('dot-container-selector-layout dot-searchable-dropdown button');
        Page.click(
            cy
                .get('.searchable-dropdown__data-list .searchable-dropdown__data-list-item')
                .contains(type)
        );
    }

    static saveEditTemplate() {
        Page.click('.dot-edit-layout__toolbar-save');
    }
}

export default DotTemplates;

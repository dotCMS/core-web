import Form from '../../support/utils/Form';
import Navigation from '../../support/utils/Navigation';
import Page from '../../support/utils/Page';
import 'cypress-iframe';

const URL = '/dotAdmin/#/c/site-browser';
const CREATE_PAGE_BUTTON = '#addNewDropDownButtonDiv span.dijitButtonNode';
const IFRAME = 'iframe#detailFrame';

class DotSiteBrowser {
    static openPage() {
        Navigation.visit(URL);
        Navigation.assertPageUrlIs(URL);
    }

    static checkSiteBrowserPageLoaded() {
        Page.assertElementContains('.p-breadcrumb > ul > :nth-child(3)', `Browser`); // Header
        cy.frameLoaded(IFRAME);
        Page.assertElementSize(cy.iframe().find('#borderContainer'), 1); // File tree container
        Page.assertElementSize(cy.iframe().find(CREATE_PAGE_BUTTON), 1); // Add action button
    }

    static openCreatePageDialog({ type }: { type: string }) {
        cy.get(IFRAME).iframeObj().as('iframeContent');
        cy.get('@iframeContent').then(() => {
            Page.click(cy.get('@iframeContent').find(CREATE_PAGE_BUTTON));
            Page.click(
                cy.get('@iframeContent').find('.dijitMenuPopup .dijitMenuItemLabel').contains(type)
            );

            Page.click(cy.get('@iframeContent').find('#addPageAssetDialog .dijitArrowButton'));
            Page.click(
                cy
                    .get('@iframeContent')
                    .find('#widget_defaultPageType_dropdown .dijitMenuItem')
                    .contains(/^Page$/)
            );
            Page.click(cy.get('@iframeContent').find('#selectedPageAssetButton'));
        });
    }

    static fillCreatePageForm({ title, template }: { title: string; template: string }) {
        // TODO: Complete to fill extra fields (not required)
        cy.wait(1000);

        cy.get(IFRAME).iframeObj().as('iframeContent');
        cy.get('@iframeContent').then(() => {
            Form.fill(cy.get('@iframeContent').find('input#titleBox'), title);
            // .type(title);
            Page.click(cy.get('@iframeContent').find('#widget_templateSel .dijitArrowButton'));
            Page.click(
                cy
                    .get('@iframeContent')
                    .find('#templateSel_popup .dijitMenuItem')
                    .contains(template)
            );
        });

        // Page.click('dot-theme-selector-dropdown[data-testid="templatePropsThemeField"]');
        // Page.click(
        //     cy.get('.theme-selector__data-list-item .dot-theme-item__label').contains(template)
        // );
    }
    /*
    static submitCreateTemplateForm = () => {
        Page.click('button[data-testid="dotFormDialogSave"');
    };

    static checkEditTemplatesPageLoaded = () => {
        // TODO: Check other components loaded on Edit Template page
        Page.assertElementContains('#p-tabpanel-0-label .p-tabview-title', `design`); // Secondary Menu bar
        Page.assertElementContains('#p-tabpanel-1-label .p-tabview-title', `Permissions`); // Secondary Menu bar
        Page.assertElementContains('#p-tabpanel-2-label .p-tabview-title', `History`); // Secondary Menu bar
        Page.assertElementContains('.dot-edit-layout__toolbar-save', `Save`); // Save button
        Page.assertElementContains('dot-searchable-dropdown button', `Add a Container`); // Add container select
    };

    static addContainer = (data) => {
        Page.click('dot-searchable-dropdown button');
        Page.click(
            cy
                .get('.searchable-dropdown__data-list .searchable-dropdown__data-list-item')
                .contains(data.type)
        );
    };

    static saveEditTemplate = () => {
        Page.click('.dot-edit-layout__toolbar-save');
    };
    */
}

export default DotSiteBrowser;

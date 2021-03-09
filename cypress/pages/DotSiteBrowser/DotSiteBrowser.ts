import Form from '../../support/utils/Form';
import Navigation from '../../support/utils/Navigation';
import Page from '../../support/utils/Page';

const URL = '/dotAdmin/#/c/site-browser';
const CREATE_PAGE_BUTTON = '#addNewDropDownButtonDiv span.dijitButtonNode';
const IFRAME = 'iframe#detailFrame';

class DotSiteBrowser {
    static openPage() {
        Navigation.visit(URL);
        Navigation.assertPageUrlIs(URL);
    }

    static checkSiteBrowserPageLoaded() {
        cy.intercept('GET', 'user/getloggedinuser').as('getLoggedinUser');
        cy.wait('@getLoggedinUser');
        Page.assertElementContains('.p-breadcrumb > ul > :nth-child(3)', `Browser`); // Header
        cy.get(IFRAME).iframe(() => {
            Page.assertElementSize(cy.get('#borderContainer'), 1); // File tree container
            Page.assertElementSize(cy.get(CREATE_PAGE_BUTTON), 1); // Add action button
        });
    }

    static openCreatePageDialog({ type }: { type: string }) {
        cy.get(IFRAME).iframe().as('iframeContent');
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
                    .contains(type)
            );
            Page.click(cy.get('@iframeContent').find('#selectedPageAssetButton'));
        });
    }

    static fillCreatePageForm({ title, template }: { title: string; template: string }) {
        // TODO: Complete to fill extra fields (not required)
        cy.get(IFRAME).iframe().as('iframeContent');
        cy.get('@iframeContent').then(() => {
            cy.intercept('POST', 'TemplateAjax.fetchTemplateImage.dwr').as('setTemplateOnForm');
            Form.fill(cy.get('@iframeContent').find('input#titleBox'), title);
            Page.click(cy.get('@iframeContent').find('#widget_templateSel .dijitArrowButton'));
            Page.click(
                cy
                    .get('@iframeContent')
                    .find('#templateSel_popup .dijitMenuItem')
                    .contains(template)
            );
            cy.wait('@setTemplateOnForm');
        });
    }

    static submitCreatePageForm({ action }: { action: string }) {
        Page.click(cy.get('@iframeContent').find('#contentletActionsHanger a').contains(action));
    }
}

export default DotSiteBrowser;

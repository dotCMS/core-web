import { Injectable } from '@angular/core';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';
import { DotLicenseService } from '../../../../../api/services/dot-license/dot-license.service';
import { take, switchMap } from 'rxjs/operators';
import * as iframeStyles from '../../shared/iframe-edit-mode.css';

interface DotEditPopupMenuItem {
    label: string;
    disabled?: boolean;
    tooltip?: string;
    dataset: {
        [propName: string]: string;
    };
}

interface DotEditPopupButton {
    label: string;
    class?: string;
}

interface DotEditPopupMenu {
    button: DotEditPopupButton;
    items?: DotEditPopupMenuItem[];
}

/**
 * Service to generate the markup related with the Toolbars and sub-menu for containers.
 */
@Injectable()
export class DotEditContentToolbarHtmlService {
    constructor(
        private dotMessageService: DotMessageService,
        private dotDOMHtmlUtilService: DotDOMHtmlUtilService,
        private dotLicenseService: DotLicenseService
    ) {}

    /**
     * Add custom HTML buttons to the containers div
     *
     * @param {Document} doc
     * @memberof DotEditContentToolbarHtmlService
     */
    addContainerToolbar(doc: Document): void {
        this.dotMessageService
            .getMessages([
                'editpage.content.container.action.add',
                'editpage.content.container.menu.content',
                'editpage.content.container.menu.widget',
                'editpage.content.container.menu.form',
                'dot.common.license.enterprise.only.error'
            ])
            .pipe(
                switchMap(this.dotLicenseService.isEnterprise.bind(this.dotLicenseService)),
                take(1)
            )
            .subscribe((isEnterpriseLicense: boolean) => {
                const containers = Array.from(doc.querySelectorAll('div[data-dot-object="container"]'));
                containers.forEach((container: HTMLElement) => {
                    const containerToolbar = document.createElement('div');
                    containerToolbar.setAttribute('style', iframeStyles.DOTEDIT_CONTAINER__TOOLBAR);
                    containerToolbar.classList.add('dotedit-container__toolbar');

                    if (!container.dataset.dotCanAdd.length) {
                        container.classList.add('disabled');
                    }

                    containerToolbar.innerHTML = this.getContainerToolbarHtml(container, isEnterpriseLicense);
                    container.parentNode.insertBefore(containerToolbar, container);
                });
            });
    }

    /**
     * Edit contentlet html to add button and content
     *
     * @param {Document} doc
     * @memberof DotEditContentToolbarHtmlService
     */
    addContentletMarkup(doc: Document): void {
        this.dotMessageService
            .getMessages([
                'editpage.content.container.action.edit.vtl',
                'editpage.content.contentlet.menu.drag',
                'editpage.content.contentlet.menu.edit',
                'editpage.content.contentlet.menu.remove'
            ])
            .subscribe(() => {
                const contentlets = Array.from(doc.querySelectorAll('div[data-dot-object="contentlet"]'));

                contentlets.forEach((contentlet: HTMLElement) => {
                    const contentletToolbar = document.createElement('div');
                    contentletToolbar.classList.add('dotedit-contentlet__toolbar');

                    const vtls = Array.from(contentlet.querySelectorAll('div[data-dot-object="vtl-file"]'));

                    if (vtls.length) {
                        contentletToolbar.innerHTML += this.getEditVtlButtons(vtls);
                    }

                    contentletToolbar.innerHTML += this.getContentButton(contentlet.dataset);

                    const contentletContent = document.createElement('div');
                    contentletContent.classList.add('dotedit-contentlet__content');
                    contentletContent.innerHTML = contentlet.innerHTML;
                    contentlet.innerHTML = '';

                    contentlet.insertAdjacentElement('afterbegin', contentletContent);
                    contentlet.insertAdjacentElement('afterbegin', contentletToolbar);
                });
            });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    getContentButton(contentletDataset: { [key: string]: any }): string {
        const identifier: string = contentletDataset.dotIdentifier;
        const inode: string = contentletDataset.dotInode;
        const canEdit: boolean = contentletDataset.dotCanEdit === 'true';
        const isForm: boolean = contentletDataset.dotBasetype === 'FORM';

        const dataset = {
            'dot-identifier': identifier,
            'dot-inode': inode
        };

        let editButtonClass = 'dotedit-contentlet__edit';
        editButtonClass += !canEdit || isForm ? ' dotedit-contentlet__disabled' : '';

        return `
            ${this.dotDOMHtmlUtilService.getButtomHTML(
                this.dotMessageService.get('editpage.content.contentlet.menu.drag'),
                'dotedit-contentlet__drag',
                `${iframeStyles.getContainerButton('DRAG')}`,
                `${iframeStyles.getContentletButtonFunctions()}`,
                {
                    ...dataset,
                    'dot-object': 'drag-content'
                }
            )}
            ${this.dotDOMHtmlUtilService.getButtomHTML(
                this.dotMessageService.get('editpage.content.contentlet.menu.edit'),
                editButtonClass,
                `${iframeStyles.getContainerButton('EDIT', !canEdit || isForm)}`,
                `${iframeStyles.getContentletButtonFunctions()}`,
                {
                    ...dataset,
                    'dot-object': 'edit-content'
                }
            )}
            ${this.dotDOMHtmlUtilService.getButtomHTML(
                this.dotMessageService.get('editpage.content.contentlet.menu.remove'),
                'dotedit-contentlet__remove',
                `${iframeStyles.getContainerButton('REMOVE', !canEdit || isForm)}`,
                `${iframeStyles.getContentletButtonFunctions()}`,
                {
                    ...dataset,
                    'dot-object': 'remove-content'
                }
            )}
        `;
    }

    getEditVtlButtons(vtls: any[]): string {
        return this.getDotEditPopupMenuHtml({
            button: {
                label: this.dotMessageService.get('editpage.content.container.action.edit.vtl'),
                class: 'dotedit-contentlet__code'
            },
            items: vtls.map((vtl: HTMLElement) => {
                return {
                    disabled: vtl.dataset.dotCanEdit === 'false',
                    label: vtl.dataset.dotUrl.split('/').slice(-1)[0],
                    dataset: {
                        action: 'code',
                        inode: vtl.dataset.dotInode
                    }
                };
            })
        }, 'CODE');
    }

    private getContainerToolbarHtml(container: HTMLElement, isEnterpriseLicense: boolean): string {
        return this.getDotEditPopupMenuHtml({
            button: {
                label: `${this.dotMessageService.get('editpage.content.container.action.add')}`,
                class: 'dotedit-container__add'
            },
            items: container.dataset.dotCanAdd
                .split(',')
                .filter((item: string) => item.length)
                .map((item: string) => {
                    item = item.toLowerCase();
                    const isDisabledFormAdd = item === 'form' && !isEnterpriseLicense;

                    return {
                        label: this.dotMessageService.get(`editpage.content.container.menu.${item}`),
                        dataset: {
                            action: 'add',
                            add: item,
                            identifier: container.dataset.dotIdentifier,
                            uuid: container.dataset.dotUuid
                        },
                        disabled: isDisabledFormAdd,
                        tooltip: isDisabledFormAdd ? this.dotMessageService.get('dot.common.license.enterprise.only.error') : ''
                    };
                })
        }, 'ADD');
    }

    private getDotEditPopupMenuHtml(menu: DotEditPopupMenu, action: string): string {
        const isMenuItems = menu.items.length > 0;

        let result = `<div class="dotedit-menu" style="${iframeStyles.DOTEDIT_MENU}">`;

        result += this.getDotEditPopupMenuButton(menu.button, !isMenuItems, action);

        if (isMenuItems) {
            result += this.getDotEditPopupMenuList(menu.items);
        }

        result += '</div>';

        return result;
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private getDotEditPopupMenuButton(button: DotEditPopupButton, disabled = false, action: string): string {
        return `
            <button
                data-dot-object="popup-button"
                type="button"
                class="dotedit-menu__button ${button.class ? button.class : ''}"
                aria-label="${button.label}"
                style="${iframeStyles.getContainerButton(action, disabled)}"
                ${disabled ? 'disabled' : `${iframeStyles.getContainerButtonFunctions()}`}>
            </button>
        `;
    }

    private getDotEditPopupMenuList(items: DotEditPopupMenuItem[]): string {
        return `
            <ul class="dotedit-menu__list" style="${iframeStyles.DOTEDIT_MENU__LIST}">
                ${items
                    .map((item: DotEditPopupMenuItem) => {
                        return `
                            <li class="dotedit-menu__item ${item.disabled ? 'dotedit-menu__item--disabled' : ''}"
                                ${item.tooltip ? 'title="' + item.tooltip + '"' : ''}">
                                    <a
                                        href="#"
                                        data-dot-object="popup-menu-item"
                                        style="${iframeStyles.DOTEDIT_MENU__ITEM__BUTTON}"
                                        ${iframeStyles.getMenuItemButtonFunctions()}
                                        ${this.getDotEditPopupMenuItemDataSet(item.dataset)} role="button">
                                        ${item.label}
                                    </a>
                            </li>
                        `;
                    })
                    .join('')}
            </ul>
        `;
    }

    private getDotEditPopupMenuItemDataSet(datasets: { [propName: string]: string }): string {
        return Object.keys(datasets)
            .map((key) => `data-dot-${key}="${datasets[key]}"`)
            .join(' ');
    }
}

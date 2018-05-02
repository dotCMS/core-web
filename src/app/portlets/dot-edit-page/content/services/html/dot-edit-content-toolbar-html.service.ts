import { Injectable } from '@angular/core';
import { DotMessageService } from '../../../../../api/services/dot-messages-service';
import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';

interface DotAddMenuItem {
    add: string;
    message: string;
}

/**
 * Service to generate the markup related with the Toolbars and sub-menu for containers.
 */
@Injectable()
export class DotEditContentToolbarHtmlService {
    private dragLabel: string;
    private removeLabel: string;
    private editLabel: string;

    constructor(private dotMessageService: DotMessageService, private dotDOMHtmlUtilService: DotDOMHtmlUtilService) {}

    addContainerToolbar(doc: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dotMessageService
                .getMessages([
                    'editpage.content.container.action.add',
                    'editpage.content.container.menu.content',
                    'editpage.content.container.menu.widget',
                    'editpage.content.container.menu.form'
                ])
                .subscribe(
                    (messages: string[]) => {
                        if (messages.length === 0) {
                            reject();
                        }

                        try {
                            const containers = Array.from(doc.querySelectorAll('div[data-dot-object="container"]'));
                            containers.forEach((container: HTMLElement) => {
                                const items: DotAddMenuItem[] = container.dataset.dotCanAdd
                                    .split(',')
                                    .filter((item: string) => item.length)
                                    .map((item: string) => {
                                        item = item.toLowerCase();

                                        return {
                                            add: item,
                                            message: messages[`editpage.content.container.menu.${item}`]
                                        };
                                    });

                                if (!items.length) {
                                    container.classList.add('disabled');
                                }

                                const containerToolbar = document.createElement('div');
                                containerToolbar.classList.add('dotedit-container__toolbar');
                                containerToolbar.innerHTML = this.getContainerToolbarHtml(items, container);

                                container.parentNode.insertBefore(containerToolbar, container);
                            });
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }

    addContentletMarkup(doc: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dotMessageService
                .getMessages([
                    'editpage.content.contentlet.menu.drag',
                    'editpage.content.contentlet.menu.edit',
                    'editpage.content.contentlet.menu.remove'
                ])
                .subscribe(
                    (messages: any) => {
                        if (!Object.keys(messages).length) {
                            reject();
                        }

                        try {
                            const contentlets = Array.from(doc.querySelectorAll('div[data-dot-object="contentlet"]'));
                            contentlets.forEach((contentlet: HTMLElement) => {
                                const contentletToolbar = document.createElement('div');
                                contentletToolbar.classList.add('dotedit-contentlet__toolbar');

                                (this.dragLabel = messages['editpage.content.contentlet.menu.drag']),
                                    (this.editLabel = messages['editpage.content.contentlet.menu.edit']),
                                    (this.removeLabel = messages['editpage.content.contentlet.menu.remove']);

                                const vtls = contentlet.querySelectorAll('div[data-dot-object="vtl-file"]');
                                contentletToolbar.innerHTML += this.getEditVtlButtons(vtls);

                                contentletToolbar.innerHTML += this.getContentButton(
                                    contentlet.dataset.dotIdentifier,
                                    contentlet.dataset.dotInode,
                                    contentlet.dataset.dotCanEdit === 'true'
                                );

                                const contentletContent = document.createElement('div');
                                contentletContent.classList.add('dotedit-contentlet__content');
                                contentletContent.innerHTML = contentlet.innerHTML;
                                contentlet.innerHTML = '';

                                contentlet.insertAdjacentElement('afterbegin', contentletContent);
                                contentlet.insertAdjacentElement('afterbegin', contentletToolbar);
                            });
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }

    getContentButton(identifier: string, inode: string, canEdit?: boolean): string {
        const dataset = {
            'dot-identifier': identifier,
            'dot-inode': inode
        };

        let editButtonClass = 'dotedit-contentlet__edit';
        editButtonClass += !canEdit ? 'dotedit-contentlet__disabled' : '';

        return `${this.dotDOMHtmlUtilService.getButtomHTML(this.dragLabel, 'dotedit-contentlet__drag', dataset)}
            ${this.dotDOMHtmlUtilService.getButtomHTML(this.editLabel, editButtonClass, dataset)}
            ${this.dotDOMHtmlUtilService.getButtomHTML(this.removeLabel, 'dotedit-contentlet__remove', dataset)}`;
    }

    private getEditVtlButtons(vtls: NodeListOf<any>): string {
        if (vtls.length > 0) {
            const items = Array.from(vtls);

            const result = `
                <div class="dotedit-menu">
                    <button
                        type="button"
                        class="dotedit-menu__button dotedit-contentlet__code"
                        ></button>
                    <ul class="dotedit-menu__list">
                        ${items
                            .map((item: any) => {
                                return `
                                    <li class="dotedit-menu__item">
                                        <a
                                            data-dot-action="code"
                                            data-dot-inode="${item.dataset.dotInode}"
                                            role="button">
                                            ${item.dataset.dotUrl.split('/').slice(-1)[0] }
                                        </a>
                                    </li>
                                `;
                            })
                            .join('')}
                    </ul>
                </div>
            `;


            return result;
        }
    }

    private getContainerToolbarHtml(items: DotAddMenuItem[], container: HTMLElement): string {
        const isContainerDisabled = !items.length;

        let result = `
        <div class="dotedit-menu">
            <button
                type="button"
                class="dotedit-menu__button dotedit-container__add"
                aria-label="${this.dotMessageService.get('editpage.content.container.action.add')}"
                ${isContainerDisabled ? 'disabled' : ''}>
            </button>
        `;

        if (!isContainerDisabled) {
            result += `
                <ul class="dotedit-menu__list" >
                    ${items
                        .map((item: DotAddMenuItem) => {
                            return `
                                <li class="dotedit-menu__item">
                                    <a
                                        data-dot-action="add"
                                        data-dot-add="${item.add}"
                                        data-dot-identifier="${container.dataset.dotIdentifier}"
                                        data-dot-uuid="${container.dataset.dotUuid}"
                                        role="button">
                                        ${item.message}
                                    </a>
                                </li>
                            `;
                        })
                        .join('')}
                </ul>
            `;
        }

        result += `<div>`;

        return result;
    }
}

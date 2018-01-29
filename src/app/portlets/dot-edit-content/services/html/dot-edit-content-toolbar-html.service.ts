import { Injectable } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';
import { DotDOMHtmlUtilService } from './dot-dom-html-util.service';

/**
 * Service to generate the markup related with the Toolbars and sub-menu for containers.
 */
@Injectable()
export class DotEditContentToolbarHtmlService {

    private TOOLBAR_CONTENT_BUTTON_HTML_FORMAT =  `<button type="button" role="button"
                                                            data-dot-identifier=":content_identifier"
                                                            data-dot-inode=":content_inode"
                                                            class=":button_class"
                                                            aria-label=":labe">
                                                        :label
                                                    </button>`;


    constructor(private dotMessageService: DotMessageService, private dotDOMHtmlUtilService: DotDOMHtmlUtilService) {}

    addContainerToolbar(doc: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dotMessageService.getMessages([
                'editpage.content.container.action.add',
                'editpage.content.container.menu.content',
                'editpage.content.container.menu.widget',
                'editpage.content.container.menu.form'
            ]).subscribe(res => {
                if (res.length === 0) {
                    reject();
                }

                try {
                    const containers = Array.from(doc.querySelectorAll('div[data-dot-object="container"]'));
                    containers.forEach((container: HTMLElement) => {
                        const containerToolbar = document.createElement('div');
                        containerToolbar.classList.add('dotedit-container__toolbar');
                        containerToolbar.innerHTML = `
                            <button type="button" role="button" data-dot-identifier="${container.dataset.dotIdentifier}"
                            class="dotedit-container__add" aria-label="${res['editpage.content.container.action.add']}">
                                ${res['editpage.content.container.action.add']}
                            </button>
                            <div class="dotedit-container__menu">
                                <ul>
                                    <li class="dotedit-container__menu-item">
                                        <a data-dot-add="content" data-dot-identifier="${container.dataset.dotIdentifier}"
                                                                  data-dot-uuid="${container.dataset.dotUuid}"  role="button">
                                            ${res['editpage.content.container.menu.content']}
                                        </a>
                                    </li>
                                    <li class="dotedit-container__menu-item">
                                        <a data-dot-add="widget" data-dot-identifier="${container.dataset.dotIdentifier}"
                                                                 data-dot-uuid="${container.dataset.dotUuid}"  role="button">
                                            ${res['editpage.content.container.menu.widget']}
                                        </a>
                                    </li>
                                    <li class="dotedit-container__menu-item">
                                        <a data-dot-add="form" data-dot-identifier="${container.dataset.dotIdentifier}"
                                                               data-dot-uuid="${container.dataset.dotUuid}"  role="button">
                                            ${res['editpage.content.container.menu.form']}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        `;

                        container.parentNode.insertBefore(containerToolbar, container);
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, error => {
                reject(error);
            });
        });
    }

    addContentletMarkup(doc: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dotMessageService.getMessages([
                'editpage.content.contentlet.menu.drag',
                'editpage.content.contentlet.menu.edit',
                'editpage.content.contentlet.menu.remove'
            ]).subscribe(res => {
                if (res.length === 0) {
                    reject();
                }

                try {
                    const contentlets = Array.from(doc.querySelectorAll('div[data-dot-object="contentlet"]'));
                    contentlets.forEach((contentlet: HTMLElement) => {
                        const container: HTMLElement = contentlet.parentElement;

                        const contentletToolbar = document.createElement('div');
                        contentletToolbar.classList.add('dotedit-contentlet__toolbar');

                        contentletToolbar.innerHTML = this.getContentButton(contentlet.dataset.dotIdentifier, contentlet.dataset.dotInode,
                            res['editpage.content.contentlet.menu.drag'], res['editpage.content.contentlet.menu.edit'],
                            res['editpage.content.contentlet.menu.remove']);


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
            }, error => {
                reject(error);
            });
        });
    }

    private getContentButton(identifier: string, inode: string, dragLabel: string, editLabel: string, removeLabel: string): string {
        const dataset = {
            'dot-identifier': identifier,
            'dot-inode': inode
        };

        return `${this.dotDOMHtmlUtilService.getButtomHTML(dragLabel, 'dotedit-contentlet__drag', dataset)}
            ${this.dotDOMHtmlUtilService.getButtomHTML(editLabel, 'dotedit-contentlet__edit', dataset)}
            ${this.dotDOMHtmlUtilService.getButtomHTML(removeLabel, 'dotedit-contentlet__remove', dataset)}`;
    }
}

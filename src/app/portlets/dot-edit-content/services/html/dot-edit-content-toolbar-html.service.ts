import { Injectable } from '@angular/core';
import { DotMessageService } from '../../../../api/services/dot-messages-service';

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


    constructor(private dotMessageService: DotMessageService) {}

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

                        const formatArguments = [
                            {
                                'content_identifier': contentlet.dataset.dotIdentifier,
                                'content_inode': contentlet.dataset.dotInode,
                                label: res['editpage.content.contentlet.menu.drag'],
                                'button_class': 'dotedit-contentlet__drag'
                            },
                            {
                                'content_identifier': contentlet.dataset.dotIdentifier,
                                'content_inode': contentlet.dataset.dotInode,
                                label: res['editpage.content.contentlet.menu.edit'],
                                'button_class': 'dotedit-contentlet__edit'
                            },
                            {
                                'content_identifier': contentlet.dataset.dotIdentifier,
                                'content_inode': contentlet.dataset.dotInode,
                                label: res['editpage.content.contentlet.menu.remove'],
                                'button_class': 'dotedit-contentlet__remove'
                            }
                        ];

                        contentletToolbar.innerHTML = this.dotMessageService.
                            formatAndConcat(this.TOOLBAR_CONTENT_BUTTON_HTML_FORMAT, formatArguments);


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
}

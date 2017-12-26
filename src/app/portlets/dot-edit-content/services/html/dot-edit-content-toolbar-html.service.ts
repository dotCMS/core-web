import { Injectable } from '@angular/core';

@Injectable()
export class DotEditContentToolbarHtmlService {
    constructor() {}

    addContainerToolbar(doc: any): void {
        const containers = doc.querySelectorAll('div[data-dot-object="container"]');
        Array.from(containers).forEach((container: any) => {
            const containerToolbar = document.createElement('div');
            containerToolbar.classList.add('dotedit-container__toolbar');
            containerToolbar.innerHTML = `
                <button type="button" data-dot-identifier="${container.dataset
                    .dotIdentifier}" class="dotedit-container__add">Add</button>
                <div class="dotedit-container__menu">
                    <ul>
                        <li class="dotedit-container__menu-item"><a data-dot-identifier="${container.dataset
                            .dotIdentifier}" >Content</a></li>
                        <li class="dotedit-container__menu-item"><a data-dot-identifier="${container.dataset
                            .dotIdentifier}" >Widget</a></li>
                        <li class="dotedit-container__menu-item"><a data-dot-identifier="${container.dataset
                            .dotIdentifier}" >Form</a></li>
                    </ul>
                </div>
            `;
            container.parentNode.insertBefore(containerToolbar, container);
        });
    }

    addContentletMarkup(doc: any): void {
        const contentlets = doc.querySelectorAll('div[data-dot-object="contentlet"]');
        Array.from(contentlets).forEach((contentlet: any) => {
            const contentletToolbar = document.createElement('div');
            contentletToolbar.classList.add('dotedit-contentlet__toolbar');
            contentletToolbar.innerHTML = `
                 <button type="button" data-dot-identifier="${contentlet.dataset
                     .dotIdentifier}" data-dot-inode="${contentlet.dataset
                .dotInode}" class="dotedit-contentlet__drag">Drag</button>
                <button type="button" data-dot-identifier="${contentlet.dataset
                    .dotIdentifier}" data-dot-inode="${contentlet.dataset
                .dotInode}" class="dotedit-contentlet__edit">Edit</button>
                <button type="button" data-dot-identifier="${contentlet.dataset
                    .dotIdentifier}" data-dot-inode="${contentlet.dataset
                .dotInode}" class="dotedit-contentlet__remove">Remove</button>
            `;

            const contentletContent = document.createElement('div');
            contentletContent.classList.add('dotedit-contentlet__content');
            contentletContent.innerHTML = contentlet.innerHTML;
            contentlet.innerHTML = '';

            contentlet.insertAdjacentElement('afterbegin', contentletContent);
            contentlet.insertAdjacentElement('afterbegin', contentletToolbar);
        });
    }
}

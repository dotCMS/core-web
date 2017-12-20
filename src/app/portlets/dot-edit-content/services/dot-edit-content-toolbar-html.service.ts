import { Injectable } from '@angular/core';

@Injectable()
export class DotEditContentToolbarHtmlService {

  constructor() { }

    addContainerToolbar(document: any): void {
        // const doc = this.getEditPageDocument();

        const containers = document.querySelectorAll('div[data-dot-object="container"]');

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

       // this.bindContainersEvents();
    }


}

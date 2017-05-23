import {Component, Input} from '@angular/core';
import {MessageService} from '../../../../api/services/messages-service';
import {BaseComponent} from '../_base/base-component';
import {MenuItems} from './menu-items.interface';

@Component({
    selector: 'action-header',
    styles: [require('./action-header.scss')],
    templateUrl: 'action-header.html'
})

export class ActionHeaderComponent extends BaseComponent {

    public dynamicOverflow = 'visible';

    @Input() selected = false;
    @Input() selectedItems = [];
    @Input() actionButtonItems: MenuItems[];
    @Input() primaryCommand;

    constructor(messageService: MessageService) {
        super(['selected', 'global-search'], messageService);
    }

    ngOnChanges(): any {
        this.dynamicOverflow = 'hidden';
        setTimeout(() => {
            this.dynamicOverflow = 'visible';
        }, 1000);
    }
}
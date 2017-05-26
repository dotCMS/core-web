import { Component, Input, SimpleChanges } from '@angular/core';
import {MessageService} from '../../../../api/services/messages-service';
import {BaseComponent} from '../_base/base-component';
import { ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'action-header',
    styles: [require('./action-header.scss')],
    templateUrl: 'action-header.html'
})

export class ActionHeaderComponent extends BaseComponent {

    public dynamicOverflow = 'visible';

    @Input() selected = false;
    @Input() selectedItems = [];
    @Input() actionButtonItems: ButtonAction[];
    @Input() primaryCommand;

    constructor(messageService: MessageService, private confirmationService: ConfirmationService) {
        super(['selected'], messageService);
    }

    // tslint:disable-next-line:no-unused-variable
    private ngOnChanges(changes: SimpleChanges): any {

        if (changes.selected && changes.selected.currentValue) {
            this.hideDinamycOverflow();
        }

        if (changes.actionButtonItems) {
            this.setCommandWrapper(changes.actionButtonItems.currentValue);
        }
    }

    private setCommandWrapper(actionButtonItems: ButtonAction[]): void {

        actionButtonItems.forEach(actionButton => {
            actionButton.model
                .filter(model => model.deleteOptions)
                .forEach(model => {
                    if (typeof model.command === 'function') {
                        let callback = model.command ;
                        model.command = () => {
                            this.confirmationService.confirm({
                                accept: () => {
                                    callback();
                                },
                                header: model.deleteOptions.confirmHeader,
                                message: model.deleteOptions.confirmMessage,
                            });
                        };
                    }
                });
        });
    }

    private hideDinamycOverflow(): void {
        this.dynamicOverflow = 'hidden';
        setTimeout(() => {
            this.dynamicOverflow = 'visible';
        }, 400);
    }
}

export interface ButtonAction {
    label: string;
    model: ButtonModel[];
}

export interface ButtonModel {
    deleteOptions?: any;
    icon: string;
    command: any;
    label: string;
    isDelete?: boolean;
}
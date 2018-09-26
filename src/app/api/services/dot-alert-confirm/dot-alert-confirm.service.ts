import { DotMessageService } from '../dot-messages-service';
import { Injectable } from '@angular/core';
import { DotAlertConfirm } from '@models/dot-alert-confirm/dot-alert-confirm.model';
import { ConfirmationService } from 'primeng/primeng';

/**
 * Handle global confirmation and alert dialog component
 * @export
 * @class DotAlertConfirmService
 */

@Injectable()
export class DotAlertConfirmService {
    alertModel: DotAlertConfirm = null;
    confirmModel: DotAlertConfirm = null;

    constructor(
        public confirmationService: ConfirmationService,
        private dotMessageService: DotMessageService
    ) {
        this.dotMessageService
            .getMessages(['dot.common.dialog.accept', 'dot.common.dialog.reject'])
            .subscribe();
    }

    /**
     * Confirm wrapper method of ConfirmService
     * Add both accept and reject labels into confirmation object
     *
     * @param {DotAlertConfirm} dialogModel
     * @memberof DotAlertConfirmService
     */
    confirm(dialogModel: DotAlertConfirm): void {
        dialogModel.footerLabel = {
            accept: this.dotMessageService.get('dot.common.dialog.accept'),
            reject: this.dotMessageService.get('dot.common.dialog.reject'),
            ...dialogModel.footerLabel
        };

        this.confirmModel = dialogModel;
        setTimeout(() => {
            this.confirmationService.confirm(dialogModel);
        }, 0);
    }

    /**
     * Confirm wrapper method of ConfirmService
     * Add both accept and reject labels into confirmation object
     *
     * @param {DotAlertConfirm} confirmation
     * @memberof DotAlertConfirmService
     */
    alert(dialogModel: DotAlertConfirm): void {
        dialogModel.footerLabel = {
            accept: this.dotMessageService.get('dot.common.dialog.accept'),
            ...dialogModel.footerLabel
        };

        this.alertModel = dialogModel;
    }

    /**
     * Call the alert accept action and clear the model
     *
     * @memberof DotAlertConfirmService
     */
    alertAccept($event): void {
        if (this.alertModel.accept) {
            this.alertModel.accept($event);
        }
        this.alertModel = null;
    }

    /**
     * Call the alert reject action and clear the model
     *
     * @memberof DotAlertConfirmService
     */
    alertReject($event): void {
        if (this.alertModel.reject) {
            this.alertModel.reject($event);
        }
        this.alertModel = null;
    }

    /**
     * clear confirm dialog object
     *
     * @memberof DotAlertConfirmService
     */
    clearConfirm(): void {
        this.confirmModel = null;
    }
}

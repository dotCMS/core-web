import { DotMessageService } from './../dot-messages-service';
import { Injectable } from '@angular/core';
import { FooterLabels } from './../../../shared/models/dot-confirmation/footer-labels.model';
import { DotDialog } from './../../../shared/models/dot-confirmation/dot-confirmation.model';
import { Subject } from 'rxjs/Subject';
import { ConfirmationService } from 'primeng/primeng';

/**
 * Handle global confirmation and alert dialog component
 * @export
 * @class DotDialogService
 */

@Injectable()
export class DotDialogService {
    alertModel: DotDialog = null;
    confirmModel: DotDialog = null;

    constructor(public confirmationService: ConfirmationService, private dotMessageService: DotMessageService) {
        this.dotMessageService.getMessages(['contenttypes.action.yes', 'contenttypes.action.no']).subscribe();
    }

    /**
     * Confirm wrapper method of ConfirmService
     * Add both accept and reject labels into confirmation object
     * @param {DotDialog} dialogModel
     * @memberof DotDialogService
     */
    // TODO: Import DotMessageService - Add message keys
    // (Not working right now since inyecting DotMessageService produces errors)
    confirm(dialogModel: DotDialog): void {
        if (!dialogModel.footerLabel) {
            dialogModel.footerLabel = {
                accept: this.dotMessageService.get('contenttypes.action.yes'),
                reject: this.dotMessageService.get('contenttypes.action.no'),
            };
        }

        this.confirmModel = dialogModel;
        setTimeout(() => {
            this.confirmationService.confirm(dialogModel);
        }, 0);
    }

    /**
     * Confirm wrapper method of ConfirmService
     * Add both accept and reject labels into confirmation object
     * @param {DotDialog} confirmation
     * @memberof DotDialogService
     */
    alert(dialogModel: DotDialog): void {
        if (!dialogModel.footerLabel) {
            dialogModel.footerLabel = {
                accept: this.dotMessageService.get('contenttypes.action.yes')
            };
        }

        this.alertModel = dialogModel;
    }

    /**
     * clear alert dialog object
     *
     * @memberof DotDialogService
     */
    clearAlert(): void {
        this.alertModel = null;
    }

    /**
     * clear confirm dialog object
     *
     * @memberof DotDialogService
     */
    clearConfirm(): void {
        this.confirmModel = null;
    }
}

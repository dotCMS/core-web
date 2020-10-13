import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export const ConfirmDialogTemplate = `
<p-confirmDialog
    [style]="{ width: '50vw' }"
    [baseZIndex]="10000"
  ></p-confirmDialog>
  <button
    type="text"
    (click)="confirm()"
    pButton
    icon="pi pi-check"
    label="Confirm"
  ></button>
`;

@Component({
  selector: 'app-p-confirm-dialog',
  template: ConfirmDialogTemplate,
})
export class ConfirmDialogComponent {

  constructor(private confirmationService: ConfirmationService) {}

  confirm(): void {
    this.confirmationService.confirm({
      message:
        'You will lose any unsaved changes you have made to this content.',
      header: 'Are you sure you want to close the editor?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Close',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-secondary',
    });
  }
}

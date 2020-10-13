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
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
    });
  }
}

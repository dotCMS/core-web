import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotAddPersonaDialogComponent } from '@components/dot-add-persona-dialog/dot-add-persona-dialog.component';
import { DotCreatePersonaFormModule } from '@components/dot-add-persona-dialog/dot-create-persona-form/dot-create-persona-form.module';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import {DotActionService} from '@services/dot-action/dot-action.service';

@NgModule({
    imports: [CommonModule, DotCreatePersonaFormModule, DotDialogModule],
    providers: [DotActionService],
    declarations: [DotAddPersonaDialogComponent],
    exports: [DotAddPersonaDialogComponent]
})
export class DotAddPersonaDialogModule {}

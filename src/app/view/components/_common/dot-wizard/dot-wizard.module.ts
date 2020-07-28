import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotWizardComponent } from '@components/_common/dot-wizard/dot-wizard.component';
import { DotAssigneeFormModule } from '@components/_common/forms/dot-assignee-form/dot-assignee-form.module';
import { DotCommentFormModule } from '@components/_common/forms/dot-comment-form/dot-comment-form.module';
import { DotPushPublishFormModule } from '@components/_common/forms/dot-push-publish-form/dot-push-publish-form.module';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';

@NgModule({
    imports: [
        CommonModule,
        DotPipesModule,
        DotAssigneeFormModule,
        DotCommentFormModule,
        DotPushPublishFormModule,
        DotDialogModule
    ],
    declarations: [DotWizardComponent],
    exports: [DotWizardComponent]
})
export class DotWizardModule {}

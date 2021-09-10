import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotDynamicDialogComponent } from './dot-dynamic-dialog.component';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotDynamicDialogService } from '@services/dot-dynamic-dialog/dot-dynamic-dialog.service'
import { DotContainerReferenceModule } from '@dotcms/app/view/directives/dot-container-reference/dot-container-reference.module';

@NgModule({
    declarations: [DotDynamicDialogComponent],
    exports: [DotDynamicDialogComponent],
    providers: [DotDynamicDialogService],
    imports: [
        CommonModule,
        DotDialogModule,
        DotPipesModule,
        DotContainerReferenceModule
    ]
})
export class DotDynamicDialogModule {}

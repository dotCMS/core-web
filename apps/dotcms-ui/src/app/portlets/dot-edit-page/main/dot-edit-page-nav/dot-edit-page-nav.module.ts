import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditPageNavComponent } from './dot-edit-page-nav.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DotIconModule } from '@dotcms/ui';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotEditPageContentTypeNavModule } from '@portlets/dot-edit-page/main/dot-edit-page-content-type-nav/dot-edit-page-content-type-nav.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TooltipModule,
        DotIconModule,
        DotPipesModule,
        DotEditPageContentTypeNavModule
    ],
    declarations: [DotEditPageNavComponent],
    exports: [DotEditPageNavComponent],
    providers: []
})
export class DotEditPageNavModule {}

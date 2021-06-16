import { NgModule } from '@angular/core';
import { DotEditPageContentTypeNavComponent } from '@portlets/dot-edit-page/main/dot-edit-page-content-type-nav/dot-edit-page-content-type-nav.component';
import { CommonModule } from '@angular/common';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotIconModule } from '@dotcms/ui';

@NgModule({
    imports: [CommonModule, DotPipesModule, DotIconModule],
    declarations: [DotEditPageContentTypeNavComponent],
    exports: [DotEditPageContentTypeNavComponent]
})
export class DotEditPageContentTypeNavModule {}

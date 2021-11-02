import { NgModule } from '@angular/core';
import { DotPaletteContentletsComponent } from '@dotcms/app/portlets/dot-edit-page/components/dot-palette/dot-palette-contentlets/dot-palette-contentlets.component';
import { CommonModule } from '@angular/common';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotIconModule } from '@dotcms/ui';
import { DotFilterPipeModule } from '@pipes/dot-filter/dot-filter-pipe.module';
import { FormsModule } from '@angular/forms';
import { DotPaletteInputFilterModule } from '../dot-palette-input-filter/dot-palette-input-filter.module';
import { DotPaginatorESContentService } from '@services/dot-paginator-es-content/dot-paginator-es-content.service';

@NgModule({
    imports: [
        CommonModule,
        DotPipesModule,
        DotIconModule,
        DotFilterPipeModule,
        DotPaletteInputFilterModule,
        FormsModule
    ],
    declarations: [DotPaletteContentletsComponent],
    exports: [DotPaletteContentletsComponent],
    providers: [DotPaginatorESContentService]
})
export class DotPaletteContentletsModule {}

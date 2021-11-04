import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotIconModule } from '@dotcms/ui';
import { DotPaletteInputFilterComponent } from './dot-palette-input-filter.component';

@NgModule({
    imports: [CommonModule, DotPipesModule, DotIconModule],
    declarations: [DotPaletteInputFilterComponent],
    exports: [DotPaletteInputFilterComponent]
})
export class DotPaletteInputFilterModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotBulkInformationComponent } from '@components/_common/dot-bulk-information/dot-bulk-information.component';
import { DotPipesModule } from '@pipes/dot-pipes.module';

@NgModule({
    imports: [CommonModule, DotPipesModule],
    exports: [DotBulkInformationComponent],
    declarations: [DotBulkInformationComponent]
})
export class DotBulkInformationModule {}

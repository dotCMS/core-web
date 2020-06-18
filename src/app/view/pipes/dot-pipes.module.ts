import { NgModule } from '@angular/core';
import { DotMessagePipe, DotStringFormatPipe } from '@pipes/index';

@NgModule({
    declarations: [DotMessagePipe, DotStringFormatPipe],
    exports: [DotMessagePipe, DotStringFormatPipe]
})
export class DotPipesModule {}

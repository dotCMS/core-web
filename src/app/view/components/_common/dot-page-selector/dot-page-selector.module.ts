import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotPageSelectorComponent } from './dot-page-selector.component';
import { DotPageSelectorService } from './service/dot-page-selector.service';
import { AutoCompleteModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, AutoCompleteModule],
    declarations: [DotPageSelectorComponent],
    providers: [DotPageSelectorService],
    exports: [DotPageSelectorComponent]
})
export class DotPageSelectorModule {}

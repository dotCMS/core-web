import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditPageNavComponent } from './dot-edit-page-nav.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/primeng';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [CommonModule, RouterModule, TooltipModule, DotIconModule, DotDirectivesModule],
    declarations: [DotEditPageNavComponent],
    exports: [DotEditPageNavComponent],
    providers: []
})
export class DotEditPageNavModule {}

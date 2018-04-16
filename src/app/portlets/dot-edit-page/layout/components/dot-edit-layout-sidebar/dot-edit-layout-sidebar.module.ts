import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditLayoutSidebarComponent } from './dot-edit-layout-sidebar.component';
import { NgGridModule } from 'angular2-grid';
import { DotActionButtonModule } from '../../../../../view/components/_common/dot-action-button/dot-action-button.module';
import { DotContainerSelectorModule } from '../../../../../view/components/dot-container-selector/dot-container-selector.module';
import { ButtonModule } from 'primeng/primeng';

@NgModule({
    declarations: [DotEditLayoutSidebarComponent],
    imports: [CommonModule, NgGridModule, DotActionButtonModule, DotContainerSelectorModule, ButtonModule],
    exports: [DotEditLayoutSidebarComponent],
    providers: []
})
export class DotEditLayoutSidebarModule {}

import { DotLayoutSidebarComponent } from './dot-layout-property-sidebar.component';
import { DotLayoutPropertiesItemModule } from './../dot-layout-properties-item/dot-layout-properties-item.module';
import { OverlayPanelModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [DotLayoutSidebarComponent],
    imports: [CommonModule, DotLayoutPropertiesItemModule],
    exports: [DotLayoutSidebarComponent],
    providers: []
})
export class DotLayoutSidebarModule {}


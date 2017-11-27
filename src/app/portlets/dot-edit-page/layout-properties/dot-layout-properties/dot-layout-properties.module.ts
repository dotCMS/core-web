import { OverlayPanelModule, ButtonModule } from 'primeng/primeng';
import { DotLayoutSidebarModule } from './../dot-layout-sidebar/dot-layout-sidebar.module';
import { DotLayoutPropertiesItemModule } from './../dot-layout-properties-item/dot-layout-properties-item.module';
import { CommonModule } from '@angular/common';
import { DotLayoutPropertiesComponent } from './dot-layout-properties.component';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [DotLayoutPropertiesComponent],
    imports: [CommonModule, DotLayoutPropertiesItemModule, DotLayoutSidebarModule, OverlayPanelModule, ButtonModule],
    exports: [DotLayoutPropertiesComponent],
    providers: []
})
export class DotLayoutPropertiesModule {}

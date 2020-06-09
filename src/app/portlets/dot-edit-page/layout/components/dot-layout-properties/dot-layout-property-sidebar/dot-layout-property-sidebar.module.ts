import { DotLayoutSidebarComponent } from './dot-layout-property-sidebar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DotLayoutPropertiesItemModule } from '../dot-layout-properties-item/dot-layout-properties-item.module';
import { FormsModule } from '@angular/forms';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    declarations: [DotLayoutSidebarComponent],
    imports: [CommonModule, DotLayoutPropertiesItemModule, FormsModule, DotDirectivesModule],
    exports: [DotLayoutSidebarComponent],
    providers: []
})
export class DotLayoutSidebarModule {}

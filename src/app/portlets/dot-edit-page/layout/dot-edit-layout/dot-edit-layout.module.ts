import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DotLayoutPropertiesModule } from './../../layout-properties/dot-layout-properties/dot-layout-properties.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditLayoutService } from '../../shared/services/dot-edit-layout.service';
import { DotEditLayoutComponent } from './dot-edit-layout.component';
import { DotEditLayoutGridModule } from '../dot-edit-layout-grid/dot-edit-layout-grid.module';

@NgModule({
    declarations: [DotEditLayoutComponent],
    imports: [CommonModule, DotEditLayoutGridModule, DotLayoutPropertiesModule, FormsModule, ReactiveFormsModule],
    exports: [DotEditLayoutComponent],
    providers: [DotEditLayoutService]
})
export class DotEditLayoutModule {}

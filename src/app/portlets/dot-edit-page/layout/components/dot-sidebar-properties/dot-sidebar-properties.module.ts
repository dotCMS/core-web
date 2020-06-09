import { NgModule } from '@angular/core';
import { ButtonModule, RadioButtonModule, OverlayPanelModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { DotSidebarPropertiesComponent } from './dot-sidebar-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    declarations: [DotSidebarPropertiesComponent],
    imports: [
        ButtonModule,
        CommonModule,
        FormsModule,
        RadioButtonModule,
        OverlayPanelModule,
        ReactiveFormsModule,
        DotDirectivesModule
    ],
    exports: [DotSidebarPropertiesComponent]
})
export class DotSidebarPropertiesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditLayoutComponent } from './dot-edit-layout.component';
import { DotEditLayoutGridModule } from '../components/dot-edit-layout-grid/dot-edit-layout-grid.module';
import { DotEditLayoutService } from '../../shared/services/dot-edit-layout.service';
import { CheckboxModule, ButtonModule, InputTextModule, DialogModule } from 'primeng/primeng';
import { DotActionButtonModule } from '../../../../view/components/_common/dot-action-button/dot-action-button.module';
import { DotTemplateAdditionalActionsModule } from '../components/dot-template-additional-actions/dot-template-additional-actions.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DotLayoutPropertiesModule } from '../components/dot-layout-properties/dot-layout-properties.module';
import { Routes, RouterModule } from '@angular/router';
import { DotSidebarPropertiesModule } from '../components/dot-sidebar-properties/dot-sidebar-properties.module';
import { EditLayoutResolver } from '../services/dot-edit-layout-resolver/dot-edit-layout-resolver.service';

const routes: Routes = [
    {
        component: DotEditLayoutComponent,
        path: '',
        resolve: {
            pageView: EditLayoutResolver
        }
    }
];

@NgModule({
    declarations: [DotEditLayoutComponent],
    imports: [
        RouterModule.forChild(routes),
        ButtonModule,
        CheckboxModule,
        CommonModule,
        DotActionButtonModule,
        DotEditLayoutGridModule,
        DotTemplateAdditionalActionsModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        DotLayoutPropertiesModule,
        DialogModule,
        DotSidebarPropertiesModule
    ],
    exports: [DotEditLayoutComponent],
    providers: [DotEditLayoutService]
})
export class DotEditLayoutModule {}

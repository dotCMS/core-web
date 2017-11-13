import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DotLayoutGridComponent } from './dot-layout-grid/dot-layout-grid.component';
import { DotLayoutComponent } from './dot-layout/dot-layout.component';
import { NgGridModule } from 'angular2-grid';
import { IconButtonTooltipModule} from '../../view/components/_common/icon-button-tooltip/icon-button-tooltip.module';
import { ActionButtonModule } from '../../view/components/_common/action-button/action-button.module';

const dotPageRoutes: Routes = [
    {
        component: DotLayoutComponent,
        path: ''
    },
    {
        component: DotLayoutComponent,
        path: 'layout'
    }
];

@NgModule({
    imports: [
        CommonModule,
        NgGridModule,
        IconButtonTooltipModule,
        ActionButtonModule,
        RouterModule.forChild(dotPageRoutes)
    ],
    declarations: [
        DotLayoutGridComponent,
        DotLayoutComponent
    ]
})
export class DotPageModule {}

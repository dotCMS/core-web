import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotEditPropertiesComponent } from './dot-edit-properties.component';
import { DotEditContentletModule } from '../../../view/components/dot-contentlet-editor/components/dot-edit-contentlet/dot-edit-contentlet.module';

const routes: Routes = [
    {
        component: DotEditPropertiesComponent,
        path: ''
    }
];

@NgModule({
    declarations: [DotEditPropertiesComponent],
    imports: [
        DotEditContentletModule,
        RouterModule.forChild(routes),
    ],
    exports: [],
    providers: []
})
export class DotEditPropertiesModule {}

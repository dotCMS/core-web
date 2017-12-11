import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotEditContentComponent } from './dot-edit-content.component';
import { DialogModule } from 'primeng/primeng';
import { IFrameModule } from '../../view/components/_common/iframe/index';
import { Routes, RouterModule } from '@angular/router';
import { DotContainerContentletService } from './services/dot-container-contentlet.service';
import { DotEditPageToolbarModule } from './components/dot-edit-page-toolbar/dot-edit-page-toolbar.module';

const routes: Routes = [
    {
        component: DotEditContentComponent,
        path: ''
    }
];


@NgModule({
    declarations: [DotEditContentComponent],
    imports: [CommonModule, DialogModule, RouterModule.forChild(routes), DotEditPageToolbarModule],
    exports: [DotEditContentComponent],
    providers: [DotContainerContentletService]
})
export class DotEditContentModule {}

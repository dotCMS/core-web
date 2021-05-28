import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockEditorComponent } from './block-editor.component';

const routes: Routes = [
    {
        component: BlockEditorComponent,
        path: ''
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlockEditorRoutingModule {}

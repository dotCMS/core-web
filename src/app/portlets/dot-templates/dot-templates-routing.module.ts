import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotTemplatesComponent } from './dot-templates.component';

const routes: Routes = [
    {
        path: '',
        component: DotTemplatesComponent
    },
    {
        path: 'new',
        loadChildren: () =>
            import(
                '@portlets/dot-templates/dot-template-designer/dot-template-designer.module.ts'
            ).then((m) => m.DotTemplateDesignerModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DotTemplatesRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotTemplateDesignerResolver } from './dot-template-designer/dot-template-designer.resolver';
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
    },
    {
        path: ':inode',
        loadChildren: () =>
            import(
                '@portlets/dot-templates/dot-template-designer/dot-template-designer.module.ts'
            ).then((m) => m.DotTemplateDesignerModule),
        resolve: {
            template: DotTemplateDesignerResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DotTemplateDesignerResolver]
})
export class DotTemplatesRoutingModule {}

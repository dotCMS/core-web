import { ContentTypesEditComponent } from './edit';
import { ContentTypesPortletComponent } from './main';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentTypeEditResolver } from './edit/content-types-edit-resolver.service';

const contentTypesRoutes: Routes = [
    {
        component: ContentTypesPortletComponent,
        path: '',
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'create',
        redirectTo: '',
        runGuardsAndResolvers: 'always'
    },
    {
        component: ContentTypesEditComponent,
        path: 'create/:type',
        resolve: {
            contentType: ContentTypeEditResolver
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'edit',
        redirectTo: ''
    },
    {
        component: ContentTypesEditComponent,
        path: 'edit/:id',
        resolve: {
            contentType: ContentTypeEditResolver
        },
        runGuardsAndResolvers: 'always'
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(contentTypesRoutes)]
})
export class ContentTypesRoutingModule {}

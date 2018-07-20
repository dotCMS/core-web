import { ContentTypesEditComponent } from './edit';
import { ContentTypesPortletComponent } from './main';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentTypeEditResolver } from './edit/content-types-edit-resolver.service';

const contentTypesRoutes: Routes = [
    {
        component: ContentTypesPortletComponent,
        path: '',
        pathMatch: 'full'
    },
    {
        path: 'create',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        component: ContentTypesEditComponent,
        path: 'create/:type',
        resolve: {
            contentType: ContentTypeEditResolver
        }
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
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(contentTypesRoutes)]
})
export class ContentTypesRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DotContentTypeEditResolver } from '../shared/dot-content-types-edit/dot-content-types-edit-resolver.service';

const contentTypesRoutes: Routes = [
    {
        loadChildren:
            '@portlets/shared/dot-content-types-listing/dot-content-types-listing.module#DotContentTypesListingModule',
        path: ''
    },
    {
        path: 'create',
        redirectTo: ''
    },
    {
        loadChildren:
            '@portlets/shared/dot-content-types-edit/dot-content-types-edit.module#ContentTypesEditModule',
        path: 'create/:type',
        resolve: {
            contentType: DotContentTypeEditResolver
        }
    },
    {
        path: 'edit',
        redirectTo: ''
    },
    {
        loadChildren:
            '@portlets/shared/dot-content-types-edit/dot-content-types-edit.module#ContentTypesEditModule',
        path: 'edit/:id',
        resolve: {
            contentType: DotContentTypeEditResolver
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(contentTypesRoutes)]
})
export class ContentTypesRoutingModule {}

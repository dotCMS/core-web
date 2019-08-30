import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentTypesPortletComponent } from '.';

const contentTypesRoutes: Routes = [
    {
        component: ContentTypesPortletComponent,
        path: ''
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(contentTypesRoutes)]
})
export class DotContentTypesListingRoutingModule {}

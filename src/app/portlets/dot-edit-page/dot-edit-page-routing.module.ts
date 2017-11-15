import { PageViewResolver } from './dot-edit-page-resolver.service';
// import { DotEditPageLayoutComponent } from './layout/dot-edit-page-layout.component';
import { EditPagePortletComponent } from './main/dot-edit-page.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const dotEditPageRoutes: Routes = [
    {
        component: EditPagePortletComponent,
        path: ''
    },
    // {
    //     component: DotEditPageLayoutComponent,
    //     path: ':url',
    //     resolve: {
    //         PageView: PageViewResolver
    //     }
    // }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forChild(dotEditPageRoutes)
    ]
})
export class ContentTypesRoutingModule { }

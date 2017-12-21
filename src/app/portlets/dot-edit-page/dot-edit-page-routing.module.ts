import { PageViewResolver } from './dot-edit-page-resolver.service';
import { NgModule } from '@angular/core';
import { DotEditLayoutComponent } from './layout/dot-edit-layout/dot-edit-layout.component';
import { RouterModule, Routes } from '@angular/router';
import {
    DotLegacyTemplateAdditionalActionsComponent
// tslint:disable-next-line:max-line-length
} from './layout/dot-template-additional-actions/dot-legacy-template-additional-actions-iframe/dot-legacy-template-additional-actions-iframe.component';
import { DotEditContentComponent } from '../dot-edit-content/dot-edit-content.component';
import { EditContentResolver } from '../dot-edit-content/services/dot-edit-content-resolver.service';
import { DotEditPageComponent } from './dot-edit-page.component';

const dotEditPage: Routes = [
    {
        component: DotEditPageComponent,
        path: '',
        children: [
            {
                component: DotEditContentComponent,
                path: 'content',
                resolve: {
                    editPageHTML: EditContentResolver
                }
            },
            {
                component: DotEditLayoutComponent,
                path: 'layout',
                resolve: {
                    pageView: PageViewResolver
                }
            }
        ]
    },
    {
        component: DotLegacyTemplateAdditionalActionsComponent,
        path: 'layout/template/:id/:tabName'
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(dotEditPage)]
})
export class DotEditPageRoutingModule {}

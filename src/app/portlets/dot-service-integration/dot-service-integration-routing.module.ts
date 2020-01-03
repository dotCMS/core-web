import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotServiceIntegrationListComponent } from './dot-service-integration-list/dot-service-integration-list.component';
import { DotServiceIntegrationPageResolver } from './dot-service-integration-list/dot-service-integration-list-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: DotServiceIntegrationListComponent,
        resolve: {
            integrationServices: DotServiceIntegrationPageResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DotServiceIntegrationRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotServiceIntegrationListComponent } from './dot-service-integration-list/dot-service-integration-list.component';
import { DotServiceIntegrationListResolver } from './dot-service-integration-list/dot-service-integration-list-resolver.service';
import { DotServiceIntegrationConfigurationComponent } from './dot-service-integration-configuration/dot-service-integration-configuration.component';
import { DotServiceIntegrationConfigurationResolver } from './dot-service-integration-configuration/dot-service-integration-configuration-resolver.service';
import { DotServiceIntegrationConfigurationDetailResolver } from './dot-service-integration-configuration-detail/dot-service-integration-configuration-detail-resolver.service';
import { DotServiceIntegrationConfigurationDetailComponent } from './dot-service-integration-configuration-detail/dot-service-integration-configuration-detail.component';

const routes: Routes = [
    {
        component: DotServiceIntegrationConfigurationDetailComponent,
        path: ':serviceKey/create/:id',
        resolve: {
            data: DotServiceIntegrationConfigurationDetailResolver
        }
    },
    {
        component: DotServiceIntegrationConfigurationDetailComponent,
        path: ':serviceKey/edit/:id',
        resolve: {
            data: DotServiceIntegrationConfigurationDetailResolver
        }
    },
    {
        component: DotServiceIntegrationConfigurationComponent,
        path: ':serviceKey',
        resolve: {
            data: DotServiceIntegrationConfigurationResolver
        }
    },
    {
        path: '',
        component: DotServiceIntegrationListComponent,
        resolve: {
            integrationServices: DotServiceIntegrationListResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DotServiceIntegrationRoutingModule {}

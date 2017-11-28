import { MenuModule } from 'primeng/primeng';
import { DotMenuService } from '../../../../api/services/dot-menu.service';
import { NgModule } from '@angular/core';
import { IFrameModule } from '../../../../view/components/_common/iframe/index';
import { DotAdditionalActionsMenuModule } from './dot-additional-actions-menu/dot-additional-actions-menu.module';
import { DotLegacyAdditionalActionsMenuComponent } from './dot-additional-actions-menu/dot-legacy-additional-actions-menu.component';
import { DotLegacyAdditionalActionsComponent } from './dot-legacy-additional-actions-iframe/dot-legacy-additional-actions-iframe.component';
import { DotAdditionalActionsIFrameModule } from './dot-legacy-additional-actions-iframe/dot-legacy-additional-actions-iframe.module';


@NgModule({
    declarations: [],
    imports: [
        DotAdditionalActionsMenuModule,
        DotAdditionalActionsIFrameModule
    ],
    exports: [
        DotLegacyAdditionalActionsMenuComponent,
        DotLegacyAdditionalActionsComponent
    ],
    providers: []
})
export class DotAdditionalActionsModule {}

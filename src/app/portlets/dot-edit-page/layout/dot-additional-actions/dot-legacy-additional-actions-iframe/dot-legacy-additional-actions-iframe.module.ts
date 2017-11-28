import { NgModule } from '@angular/core';
import { DotMenuService } from '../../../../../api/services/dot-menu.service';
import { IFrameModule } from '../../../../../view/components/_common/iframe/iframe.module';
import { DotLegacyAdditionalActionsComponent } from './dot-legacy-additional-actions-iframe.component';

@NgModule({
    declarations: [DotLegacyAdditionalActionsComponent],
    imports: [IFrameModule],
    exports: [DotLegacyAdditionalActionsComponent],
    providers: [DotMenuService]
})
export class DotAdditionalActionsIFrameModule {}

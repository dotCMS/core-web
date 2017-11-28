import { NgModule } from '@angular/core';
import { DotTemplateAdditionalActionsMenuModule } from './dot-template-additional-actions-menu/dot-template-additional-actions-menu.module';
import { DotTemplateAdditionalActionsIFrameModule } from './dot-legacy-additional-actions-iframe/dot-legacy-template-additional-actions-iframe.module';
import { DotLegacyTemplateAdditionalActionsComponent } from './dot-legacy-additional-actions-iframe/dot-legacy-template-additional-actions-iframe.component';
import { DotTemplateAdditionalActionsMenuComponent } from './dot-template-additional-actions-menu/dot-template-additional-actions-menu.component';

@NgModule({
    declarations: [],
    imports: [DotTemplateAdditionalActionsMenuModule, DotTemplateAdditionalActionsIFrameModule],
    exports: [DotLegacyTemplateAdditionalActionsComponent, DotTemplateAdditionalActionsMenuComponent],
    providers: []
})
export class DotTemplateAdditionalActionsModule {}

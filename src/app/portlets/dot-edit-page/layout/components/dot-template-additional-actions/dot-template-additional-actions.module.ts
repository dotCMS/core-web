import { NgModule } from '@angular/core';

import { DotTemplateAdditionalActionsIframeModule } from './dot-legacy-template-additional-actions-iframe/dot-legacy-template-additional-actions-iframe.module';
import { DotLegacyTemplateAdditionalActionsComponent } from './dot-legacy-template-additional-actions-iframe/dot-legacy-template-additional-actions-iframe.component';

@NgModule({
    declarations: [],
    imports: [DotTemplateAdditionalActionsIframeModule],
    exports: [DotLegacyTemplateAdditionalActionsComponent],
    providers: []
})
export class DotTemplateAdditionalActionsModule {}

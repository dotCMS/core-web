import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DotTemplateAdvancedComponent } from './dot-template-advanced.component';
import { DotTextareaContentModule } from '@components/_common/dot-textarea-content/dot-textarea-content.module';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotContainerSelectorModule } from '@components/dot-container-selector/dot-container-selector.module';
import { DotPortletBaseModule } from '@components/dot-portlet-base/dot-portlet-base.module';

@NgModule({
    declarations: [DotTemplateAdvancedComponent],
    exports: [DotTemplateAdvancedComponent],
    imports: [
        CommonModule,
        DotContainerSelectorModule,
        DotFieldValidationMessageModule,
        DotTextareaContentModule,
        DotPortletBaseModule
    ],
    providers: []
})
export class DotTemplateAdvancedModule {}

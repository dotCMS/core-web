import { NgModule } from '@angular/core';
import { DotTemplateComponent } from './dot-template.component';
import { InputTextModule } from 'primeng/inputtext';
import { DotTextareaContentModule } from '@components/_common/dot-textarea-content/dot-textarea-content.module';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotFieldValidationMessageModule } from '@components/_common/dot-field-validation-message/dot-file-validation-message.module';
import { DotContainerSelectorModule } from '@components/dot-container-selector/dot-container-selector.module';
import { TemplateContainersCacheService } from '@portlets/dot-edit-page/template-containers-cache.service';

@NgModule({
    declarations: [DotTemplateComponent],
    imports: [
        InputTextModule,
        ButtonModule,
        DotTextareaContentModule,
        ReactiveFormsModule,
        DotFieldValidationMessageModule,
        DotContainerSelectorModule
    ],
    providers: [DotRouterService, TemplateContainersCacheService]
})
export class DotTemplateModule {}

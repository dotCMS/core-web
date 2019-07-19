import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { DotPersonaSelector2Component } from './dot-persona-selector2.component';
import { DotPersonaSelectorOptionModule } from '@components/dot-persona-selector-option/dot-persona-selector-option.module';
import { ButtonModule } from 'primeng/primeng';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';

@NgModule({
    declarations: [DotPersonaSelector2Component],
    exports: [DotPersonaSelector2Component],
    imports: [
        CommonModule,
        FormsModule,
        SearchableDropDownModule,
        DotPersonaSelectorOptionModule,
        DotIconModule,
        DotAvatarModule,
        ButtonModule
    ]
})
export class DotPersonaSelector2Module {}

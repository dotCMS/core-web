import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { DotPersonaSelectorComponent } from './dot-persona-selector.component';
import { DotPersonaSelectorOptionModule } from '@components/dot-persona-selector-option/dot-persona-selector-option.module';
import { ButtonModule } from 'primeng/primeng';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';

@NgModule({
    declarations: [DotPersonaSelectorComponent],
    exports: [DotPersonaSelectorComponent],
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
export class DotPersonaSelectorModule {}

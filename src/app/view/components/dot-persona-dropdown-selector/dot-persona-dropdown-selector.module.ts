import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DotPersonaDropdownSelectorComponent } from './dot-persona-dropdown-selector.component';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [CommonModule, FormsModule, DotIconModule, DotAvatarModule, ButtonModule],
    declarations: [DotPersonaDropdownSelectorComponent],
    exports: [DotPersonaDropdownSelectorComponent]
})
export class DotPersonaDropdownSelectorModule {}

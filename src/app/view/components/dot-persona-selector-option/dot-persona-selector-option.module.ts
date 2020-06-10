import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DotPersonaSelectorOptionComponent } from './dot-persona-selector-option.component';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { ButtonModule } from 'primeng/button';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [CommonModule, FormsModule, DotAvatarModule, ButtonModule, DotDirectivesModule],
    declarations: [DotPersonaSelectorOptionComponent],
    exports: [DotPersonaSelectorOptionComponent]
})
export class DotPersonaSelectorOptionModule {}

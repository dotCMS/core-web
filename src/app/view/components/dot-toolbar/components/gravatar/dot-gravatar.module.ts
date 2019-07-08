import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotGravatarComponent } from './dot-gravatar.component';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';

@NgModule({
    imports: [CommonModule, DotAvatarModule],
    declarations: [DotGravatarComponent],
    exports: [DotGravatarComponent]
})
export class DotGravatarModule {}

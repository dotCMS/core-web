import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/primeng';

import { DotAppsCardComponent } from './dot-apps-card.component';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { NgxMdModule } from 'ngx-md';

@NgModule({
    imports: [CommonModule, CardModule, DotAvatarModule, NgxMdModule],
    declarations: [DotAppsCardComponent],
    exports: [DotAppsCardComponent]
})
export class DotAppsCardModule {}

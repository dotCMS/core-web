import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotGlobalMessageService } from './dot-global-message.service';
import { DotGlobalMessageComponent } from './dot-global-message.component';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';

@NgModule({
    imports: [CommonModule, DotIconModule],
    declarations: [DotGlobalMessageComponent],
    exports: [DotGlobalMessageComponent],
    providers: [DotGlobalMessageService]
})
export class DotGlobalMessageModule {}

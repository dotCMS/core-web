import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotGlobalMessageService } from './dot-global-message.service';
import { DotGlobalMessageComponent } from './dot-global-message.component';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import {DotSpinnerModule} from '@components/_common/dot-spinner/dot-spinner.module';
import {DotLoadingIndicatorModule} from '@components/_common/iframe/dot-loading-indicator/dot-loading-indicator.module';

@NgModule({
    imports: [CommonModule, DotIconModule, DotSpinnerModule, DotLoadingIndicatorModule],
    declarations: [DotGlobalMessageComponent],
    exports: [DotGlobalMessageComponent],
    providers: [DotGlobalMessageService]
})
export class DotGlobalMessageModule {}

import { NgModule } from '@angular/core';
import { MenuModule, ButtonModule } from 'primeng/primeng';
import { DotLegacyAdditionalActionsMenuComponent } from './dot-legacy-additional-actions-menu.component';
import { MessageService } from '../../../../../api/services/messages-service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DotLegacyAdditionalActionsMenuComponent],
    imports: [MenuModule, ButtonModule, CommonModule],
    exports: [DotLegacyAdditionalActionsMenuComponent],
    providers: [MessageService]
})
export class DotAdditionalActionsMenuModule {}

import { IconButtonTooltipModule } from '../icon-button-tooltip/icon-button-tooltip.module';
import { ActionMenuButtonComponent } from './action-menu-button.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SplitButtonModule, MenuModule, Menu } from 'primeng/primeng';

@NgModule({
    entryComponents: [Menu],
    declarations: [ActionMenuButtonComponent],
    exports: [ActionMenuButtonComponent],
    imports: [CommonModule, SplitButtonModule, MenuModule, IconButtonTooltipModule]
})
export class ActionMenuButtonModule {}

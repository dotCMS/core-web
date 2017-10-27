import { ActionMenuButtonComponent } from './action-menu-button.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SplitButtonModule, MenuModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        ActionMenuButtonComponent
    ],
    exports: [
        ActionMenuButtonComponent
    ],
    imports: [
        CommonModule,
        SplitButtonModule,
        MenuModule
    ]
})

export class ActionMenuButtonModule {

}

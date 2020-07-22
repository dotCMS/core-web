import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputSwitchModule } from 'primeng/primeng';

import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotEditPageLockComponent } from './dot-edit-page-lock.component';
import { DotEditPageLockInfoComponent } from '../dot-edit-page-state-controller/components/dot-edit-page-lock-info/dot-edit-page-lock-info.component';

@NgModule({
    declarations: [DotEditPageLockComponent, DotEditPageLockInfoComponent],
    exports: [DotEditPageLockComponent],
    imports: [CommonModule, FormsModule, InputSwitchModule, DotPipesModule]
})
export class DotEditPageLockModule {}

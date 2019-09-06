import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotUnlicensedPorletComponent } from './dot-unlicensed-porlet.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [CommonModule, ButtonModule],
    declarations: [DotUnlicensedPorletComponent],
    exports: [DotUnlicensedPorletComponent]
})
export class DotUnlicensedPorletModule {}

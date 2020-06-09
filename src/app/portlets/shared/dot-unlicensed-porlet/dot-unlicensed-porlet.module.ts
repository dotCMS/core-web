import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotUnlicensedPorletComponent } from './dot-unlicensed-porlet.component';
import { ButtonModule } from 'primeng/button';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [CommonModule, ButtonModule, DotIconModule, DotDirectivesModule],
    declarations: [DotUnlicensedPorletComponent],
    exports: [DotUnlicensedPorletComponent]
})
export class DotUnlicensedPorletModule {}

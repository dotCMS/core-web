import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotThemeSelectorDropdownComponent } from './dot-theme-selector-dropdown.component';

@NgModule({
    declarations: [DotThemeSelectorDropdownComponent],
    exports: [DotThemeSelectorDropdownComponent],
    imports: [CommonModule]
})
export class DotThemeSelectorDropdownModule {}

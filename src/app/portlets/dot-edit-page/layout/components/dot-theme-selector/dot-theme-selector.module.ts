import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotThemeSelectorComponent } from './dot-theme-selector.component';
import { DotThemesService } from '../../../../../api/services/dot-themes/dot-themes.service';
import {DropdownModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [DotThemeSelectorComponent],
    imports: [CommonModule, DropdownModule, FormsModule],
    exports: [DotThemeSelectorComponent],
    providers: [DotThemesService]
})
export class DotThemeSelectorModule {}

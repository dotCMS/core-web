import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { SearchableDropDownModule } from '@components/_common/searchable-dropdown';
import { DotPersonaSelectorComponent } from './dot-persona-selector.component';
import { DotPersonaSelectorOptionModule } from '@components/dot-persona-selector-option/dot-persona-selector-option.module';
import {ButtonModule, FileUploadModule, InputTextModule, SharedModule} from 'primeng/primeng';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotAvatarModule } from '@components/_common/dot-avatar/dot-avatar.module';
import { DotPersonaSelectedItemModule } from '@components/dot-persona-selected-item/dot-persona-selected-item.module';
import { PaginatorService } from '@services/paginator';
import { DotDialogModule } from '@components/dot-dialog/dot-dialog.module';
import { DotSiteSelectorModule } from '@components/_common/dot-site-selector/dot-site-selector.module';

@NgModule({
    declarations: [DotPersonaSelectorComponent],
    exports: [DotPersonaSelectorComponent],
    imports: [
        CommonModule,
        FormsModule,
        SearchableDropDownModule,
        DotPersonaSelectedItemModule,
        DotPersonaSelectorOptionModule,
        DotIconModule,
        DotAvatarModule,
        ButtonModule,
        SharedModule,
        DotDialogModule,
        FileUploadModule,
        InputTextModule,
        ReactiveFormsModule,
        DotSiteSelectorModule
    ],
    providers: [PaginatorService]
})
export class DotPersonaSelectorModule {}

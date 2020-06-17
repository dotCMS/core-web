import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotFileUploadComponent } from './dot-file-upload.component';
import { DotFileUploadService } from '@services/dot-file-upload/dot-file-upload.service';

@NgModule({
    imports: [CommonModule],
    declarations: [DotFileUploadComponent],
    exports: [DotFileUploadComponent],
    providers: [DotFileUploadService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class DotFileUploadModule {}

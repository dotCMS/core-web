import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotRelationshipTreeComponent } from './dot-relationship-tree.component';
import { DotIconButtonModule } from '@components/_common/dot-icon-button/dot-icon-button.module';
import { DotCopyButtonModule } from '@components/dot-copy-button/dot-copy-button.module';

@NgModule({
    declarations: [DotRelationshipTreeComponent],
    exports: [DotRelationshipTreeComponent],
    imports: [CommonModule, DotIconButtonModule, DotCopyButtonModule]
})
export class DotRelationshipTreeModule {}

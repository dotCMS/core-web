import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotTemplateListComponent } from './dot-template-list.component';
import { DotTemplateListResolver } from '@portlets/dot-templates/dot-template-list/dot-template-list-resolver.service';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';
import { DotListingDataTableModule } from '@components/dot-listing-data-table';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { SharedModule } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [DotTemplateListComponent],
    imports: [
        CommonModule,
        DotListingDataTableModule,
        DotPipesModule,
        SharedModule,
        CheckboxModule,
        MenuModule,
        ButtonModule
    ],
    providers: [DotTemplateListResolver, DotTemplatesService]
})
export class DotTemplateListModule {}

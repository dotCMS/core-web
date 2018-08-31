import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DotNavigationComponent } from './dot-navigation.component';
import { AccordionComponent, AccordionGroupComponent } from '../_common/accordion/accordion';
import { DotNavigationService } from './dot-navigation.service';
import { DotIconModule } from '../_common/dot-icon/dot-icon.module';
import { CrumbTrailModule } from '../_common/dot-crumb-trail/dot-crumb-trail.module';
@NgModule({
    imports: [CommonModule, RouterModule, DotIconModule, CrumbTrailModule],
    declarations: [DotNavigationComponent, AccordionGroupComponent, AccordionComponent],
    providers: [DotNavigationService],
    exports: [DotNavigationComponent]
})
export class MainNavigationModule {}

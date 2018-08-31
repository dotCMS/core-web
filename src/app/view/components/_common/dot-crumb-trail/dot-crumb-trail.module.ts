
import { NgModule } from '@angular/core';
import { DotCrumbTrailComponent } from './dot-crumb-trail.component';
import { BreadcrumbModule, MenuModule, ButtonModule } from 'primeng/primeng';
import { CrumbTrailService } from './services/dot-crumb-trail.service';
import { CrumbTrailsGuardService } from './services/crumb-trails-guard.service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [DotCrumbTrailComponent],
    exports: [DotCrumbTrailComponent],
    imports: [
        CommonModule, BreadcrumbModule
    ],
    providers: [CrumbTrailService, CrumbTrailsGuardService]
})
export class CrumbTrailModule {}

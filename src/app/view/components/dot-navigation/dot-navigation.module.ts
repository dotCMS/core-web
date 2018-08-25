import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DotNavigationComponent } from './dot-navigation.component';
import { DotNavigationService } from './services/dot-navigation.service';
import { DotNavIconModule } from './components/dot-nav-icon/dot-nav-icon.module';

@NgModule({
    imports: [CommonModule, RouterModule, DotNavIconModule],
    declarations: [DotNavigationComponent],
    providers: [DotNavigationService],
    exports: [DotNavigationComponent]
})
export class MainNavigationModule {}

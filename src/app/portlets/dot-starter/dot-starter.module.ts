import { NgModule } from '@angular/core';
import { DotStarterRoutingModule } from './dot-starter-routing.module';
import { DotStarterComponent } from './dot-starter.component';

@NgModule({
    declarations: [DotStarterComponent],
    imports: [
        DotStarterRoutingModule
    ]
})
export class DotStarterModule {}
